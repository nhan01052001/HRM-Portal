import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import ComputerLevelList from '../computerLevelList/ComputerLevelList';
import { styleSheets, styleSafeAreaView } from '../../../../../../constants/styleConfig';
import { ConfigList } from '../../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../../assets/auth/authentication';
import { startTask } from '../../../../../../factories/BackGroundTask';
import { connect } from 'react-redux';

import {
    generateRowActionAndSelected,
    ComputerLevelWaitConfirmBusinessFunction
} from './ComputerLevelWaitConfirmBusinessFunction';
import { ComputerLevelConfirmedBusinessFunction } from '../computerLevelConfirmed/ComputerLevelConfirmedBusinessFunction';
import { ConfigListFilter } from '../../../../../../assets/configProject/ConfigListFilter';

let configList = null,
    enumName = null,
    computerLevelWaitConfirm = null,
    computerLevelWaitConfirmViewDetail = null,
    computerLevelWaitConfirmKeyTask = null,
    pageSizeList = 20;

class ComputerLevelWaitConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataBody: null,
            rowActions: [],
            selected: [],
            isRefreshList: false,
            isLazyLoading: false,
            keyQuery: null,
            dataAttachFile: {
                data: null,
                modalVisibleAttachFile: false
            },
            FileAttach: {
                disable: false,
                refresh: false,
                value: null,
                visibleConfig: true,
                visible: true
            }
        };

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            ComputerLevelWaitConfirmBusinessFunction.setThisForBusiness(this);
            if (ComputerLevelConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.ComputerLevelWaitConfirm]) {
                this.reload();
            }
        });
        this.storeParamsDefault = null;
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    checkDataFormNotify = () => {
        const { params = {} } = this.props.navigation.state,
            _params = typeof params == 'object' ? params : JSON.parse(params);
        return _params;
    };

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
        ComputerLevelConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.ComputerLevelWaitConfirm] = false;

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: computerLevelWaitConfirmKeyTask,
                payload: {
                    ...dataBody,
                    keyQuery: keyQuery,
                    isCompare: false,
                    reload: this.reload
                }
            });
        });
    };

    paramsDefault = () => {
        if (!configList[computerLevelWaitConfirm]) {
            configList[computerLevelWaitConfirm] = {
                Api: {
                    urlApi: '[URI_HR]/Hre_GetData/GetHre_ComputerLevel',
                    type: 'GET',
                    pageSize: 20
                },
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
                            Name: 'HRM_HR_ComputerLevel_Portal_Create_WaitingGrid_btnEdit',
                            Rule: 'Modify'
                        },
                        Confirm: {
                            isInputText: false,
                            isValidInputText: false
                        }
                    },
                    {
                        Type: 'E_DELETE',
                        Resource: {
                            Name: 'HRM_HR_ComputerLevel_Portal_Create_WaitingGrid_btnDel',
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
                            Name: 'HRM_HR_ComputerLevel_Portal_WaitingGrid_btnTransfer',
                            Rule: 'View'
                        }
                    }
                ]
            };
        }

        const _configList = configList[computerLevelWaitConfirm],
            renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order],
            dataFromParams = this.checkDataFormNotify();

        const dataRowActionAndSelected = generateRowActionAndSelected(ScreenName.ComputerLevelWaitConfirm);
        let _params = {
            ...dataFromParams,
            IsPortal: true,
            sort: orderBy,
            pageSize: pageSizeList,
            ProfileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
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
                    keyTask: computerLevelWaitConfirmKeyTask,
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
                    keyTask: computerLevelWaitConfirmKeyTask,
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
        if (nextProps.reloadScreenName == computerLevelWaitConfirmKeyTask) {
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
        ComputerLevelConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.ComputerLevelWaitConfirm] = false;
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        computerLevelWaitConfirm = ScreenName.ComputerLevelWaitConfirm;
        computerLevelWaitConfirmViewDetail = ScreenName.ComputerLevelWaitConfirmViewDetail;
        computerLevelWaitConfirmKeyTask = EnumTask.KT_ComputerLevelWaitConfirm;

        ComputerLevelWaitConfirmBusinessFunction.setThisForBusiness(this, false);

        let _paramsDefault = this.paramsDefault(),
            paramStore = { ..._paramsDefault, dataBody: { ..._paramsDefault.dataBody } },
            dataFromParams = this.checkDataFormNotify();
        this.storeParamsDefault = _paramsDefault;


        // xoa filter defaule
        Object.keys(dataFromParams).forEach(key => {
            paramStore.dataBody[key] = null;
        });

        this.setState(ConfigListFilter.value[computerLevelWaitConfirm] ? _paramsDefault : paramStore);

        startTask({
            keyTask: computerLevelWaitConfirmKeyTask,
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
            renderRow,
            rowActions,
            selected,
            isLazyLoading,
            isRefreshList,
            keyQuery,
            dataChange
        } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {computerLevelWaitConfirm && computerLevelWaitConfirmViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <ComputerLevelList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: computerLevelWaitConfirmViewDetail,
                                        screenName: computerLevelWaitConfirm
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={computerLevelWaitConfirmKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Hre_GetData/GetHre_ComputerLevel',
                                        type: enumName.E_GET,
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
)(ComputerLevelWaitConfirm);
