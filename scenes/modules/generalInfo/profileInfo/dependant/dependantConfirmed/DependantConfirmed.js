import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import DependantList from '../dependantList/DependantList';
import {
    styleSheets,
    styleSafeAreaView
} from '../../../../../../constants/styleConfig';
import { ConfigList } from '../../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../../assets/auth/authentication';
import { PermissionForAppMobile } from '../../../../../../assets/configProject/PermissionForAppMobile';
import { startTask } from '../../../../../../factories/BackGroundTask';
import { connect } from 'react-redux';
import { generateRowActionAndSelected, DependantConfirmedBusinessFunction } from './DependantConfirmedBusinessFunction';
import { VnrBtnCreate } from '../../../../../../componentsV3/VnrBtnCreate/VnrBtnCreate';

let configList = null,
    enumName = null,
    dependantConfirmed = null,
    dependantConfirmedViewDetail = null,
    dependantConfirmedKeyTask = null,
    pageSizeList = 20;

class DependantConfirmed extends Component {
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
            DependantConfirmedBusinessFunction.setThisForBusiness(this, false);
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
            { NotificationID } = typeof params == 'object' ? params : JSON.parse(params);
        return NotificationID ? NotificationID : null;
    };

    checkDataFormLink = () => {
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
                keyTask: dependantConfirmedKeyTask,
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
        const _configList = configList[dependantConfirmed],
            renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order],
            dataFromParams = this.checkDataFormLink();

        const dataRowActionAndSelected = generateRowActionAndSelected(dependantConfirmed);
        let _params = {
            ...dataFromParams,
            IsPortal: true,
            sort: orderBy,
            pageSize: pageSizeList,
            profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null,
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
                // pull to refresh delete params from link
                if (dataBody?.tokenEncodedParam) {
                    delete dataBody?.tokenEncodedParam;
                }
                startTask({
                    keyTask: dependantConfirmedKeyTask,
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
                    keyTask: dependantConfirmedKeyTask,
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
        if (nextProps.reloadScreenName == dependantConfirmedKeyTask) {
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
        dependantConfirmed = ScreenName.DependantConfirmed;
        dependantConfirmedViewDetail = ScreenName.DependantConfirmedViewDetail;
        dependantConfirmedKeyTask = EnumTask.KT_DependantConfirmed;

        DependantConfirmedBusinessFunction.setThisForBusiness(this, false);
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;

        this.setState(_paramsDefault);

        startTask({
            keyTask: dependantConfirmedKeyTask,
            payload: {
                ..._paramsDefault.dataBody,
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload
            }
        });
    }

    // openModalPlanLimit closeModalPlanLimit viewListItemPlanLimitTime

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
                {dependantConfirmed && dependantConfirmedViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <DependantList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: dependantConfirmedViewDetail,
                                        screenName: dependantConfirmed
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={dependantConfirmedKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    // need fix   New_PlanOvertimeApproveByFilter [done]
                                    api={{
                                        urlApi: '[URI_HR]/Hre_GetData/GetDependantListByProfileIDByModel',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: 20
                                    }}
                                    valueField="ID"
                                    renderConfig={renderRow}
                                />
                            )}
                            {PermissionForAppMobile &&
                                PermissionForAppMobile.value['Personal_DependantConfirmed'] &&
                                PermissionForAppMobile.value['Personal_DependantConfirmed']['Create'] && (
                                <VnrBtnCreate
                                    onAction={() => {
                                        this.props.navigation.navigate('DependantAddOrEdit', {
                                            reload: () => this.reload(),
                                            screenName: ScreenName.DependantConfirmed
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
)(DependantConfirmed);
