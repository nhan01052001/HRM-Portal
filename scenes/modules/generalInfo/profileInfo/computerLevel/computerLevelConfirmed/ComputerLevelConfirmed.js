import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import ComputerLevelList from '../computerLevelList/ComputerLevelList';
import { styleSheets, styleSafeAreaView } from '../../../../../../constants/styleConfig';
import { ConfigList } from '../../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../../assets/auth/authentication';
import { PermissionForAppMobile } from '../../../../../../assets/configProject/PermissionForAppMobile';
import { startTask } from '../../../../../../factories/BackGroundTask';
import { connect } from 'react-redux';
import {
    generateRowActionAndSelected,
    ComputerLevelConfirmedBusinessFunction
} from './ComputerLevelConfirmedBusinessFunction';
import { VnrBtnCreate } from '../../../../../../componentsV3/VnrBtnCreate/VnrBtnCreate';
import { ConfigListFilter } from '../../../../../../assets/configProject/ConfigListFilter';

let configList = null,
    enumName = null,
    computerLevelConfirmed = null,
    computerLevelConfirmedViewDetail = null,
    computerLevelConfirmedKeyTask = null,
    pageSizeList = 20;

class ComputerLevelConfirmed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataBody: null,
            rowActions: [],
            selected: [],
            isRefreshList: true,
            isLazyLoading: false,
            keyQuery: null,
            dataChange: false, //biến check dữ liệu có thay đổi hay không
            dataPlanLimit: {
                data: null,
                modalVisiblePlanLimit: false
            }
        };

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            ComputerLevelConfirmedBusinessFunction.setThisForBusiness(this, false);
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

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: computerLevelConfirmedKeyTask,
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
        if (!configList[computerLevelConfirmed]) {
            configList[computerLevelConfirmed] = {
                Api: {
                    urlApi: '[URI_HR]/Hre_GetData/GetListComputerLevelByProfileID',
                    type: 'Get',
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
                            Name: 'HRM_HR_ComputerLevel_Portal_ListGird_btnEdit',
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

        const _configList = configList[computerLevelConfirmed],
            renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order],
            dataFromParams = this.checkDataFormNotify();

        const dataRowActionAndSelected = generateRowActionAndSelected(ScreenName.ComputerLevelConfirmed);
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
                    keyTask: computerLevelConfirmedKeyTask,
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
                    keyTask: computerLevelConfirmedKeyTask,
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
        if (nextProps.reloadScreenName == computerLevelConfirmedKeyTask) {
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
        //set by config

        configList = ConfigList.value;
        enumName = EnumName;
        computerLevelConfirmed = ScreenName.ComputerLevelConfirmed;
        computerLevelConfirmedViewDetail = ScreenName.ComputerLevelConfirmedViewDetail;
        computerLevelConfirmedKeyTask = EnumTask.KT_ComputerLevelConfirmed;

        ComputerLevelConfirmedBusinessFunction.setThisForBusiness(this, false);

        let _paramsDefault = this.paramsDefault(),
            paramStore = { ..._paramsDefault, dataBody: { ..._paramsDefault.dataBody } },
            dataFromParams = this.checkDataFormNotify();
        this.storeParamsDefault = _paramsDefault;

        // xoa filter defaule
        Object.keys(dataFromParams).forEach(key => {
            paramStore.dataBody[key] = null;
        });

        this.setState(ConfigListFilter.value[computerLevelConfirmed] ? _paramsDefault : paramStore);

        startTask({
            keyTask: computerLevelConfirmedKeyTask,
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
                {computerLevelConfirmed && computerLevelConfirmedViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <ComputerLevelList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: computerLevelConfirmedViewDetail,
                                        screenName: computerLevelConfirmed
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={computerLevelConfirmedKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Hre_GetData/GetListComputerLevelByProfileID',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: 20
                                    }}
                                    valueField="ID"
                                    renderConfig={renderRow}
                                />
                            )}
                            {PermissionForAppMobile &&
                                PermissionForAppMobile.value['HRM_HR_ComputerLevel_Portal_ListGird_btnCreate'] &&
                                PermissionForAppMobile.value['HRM_HR_ComputerLevel_Portal_ListGird_btnCreate'][
                                    'Create'
                                ] && (
                                <VnrBtnCreate
                                    onAction={() => {
                                        this.props.navigation.navigate('ComputerLevelAddOrEdit', {
                                            reload: () => this.reload(),
                                            screenName: ScreenName.ComputerLevelConfirmed
                                        });
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
)(ComputerLevelConfirmed);
