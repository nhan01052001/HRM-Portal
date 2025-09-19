import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import SalApprovePaymentCostRegisterList from '../salApprovePaymentCostRegisterList/SalApprovePaymentCostRegisterList';
import {
    styleSheets,
    styleSafeAreaView,
    styleContentFilterDesign
} from '../../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../../assets/constant';
import { generateRowActionAndSelected, SalApprovedPaymentCostRegisterBusiness } from './SalApprovedPaymentCostRegisterBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../../factories/BackGroundTask';
import { SalWaitApprovePaymentCostRegisterBusiness } from '../salWaitApprovePaymentCostRegister/SalWaitApprovePaymentCostRegisterBusiness';

let configList = null,
    enumName = null,
    salApprovedPaymentCostRegister = null,
    salApprovePaymentCostRegisterViewDetail = null,
    salApprovedPaymentCostRegisterKeyTask = null,
    pageSizeList = 20;

class SalApprovedPaymentCostRegister extends Component {
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
            if (SalWaitApprovePaymentCostRegisterBusiness.checkForReLoadScreen[ScreenName.SalApprovedPaymentCostRegister]) {
                this.reload();
            }
        });
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
        // set false khi đã reload.
        SalWaitApprovePaymentCostRegisterBusiness.checkForReLoadScreen[ScreenName.SalApprovedPaymentCostRegister] = false;
        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: salApprovedPaymentCostRegisterKeyTask,
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

        if (!salApprovedPaymentCostRegister) {
            salApprovedPaymentCostRegister = ScreenName.SalApprovedPaymentCostRegister;
        }
        if (!configList[salApprovedPaymentCostRegister]) {
            configList[salApprovedPaymentCostRegister] = {
                Api: {
                    urlApi: '[URI_HR]/Sal_GetData/GetSalPaymentcostRegisterApprovedPortal',
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
                BusinessAction: []
            };
        }

        const _configList = configList[salApprovedPaymentCostRegister],
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
                    keyTask: salApprovedPaymentCostRegisterKeyTask,
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
                    keyTask: salApprovedPaymentCostRegisterKeyTask,
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
        if (nextProps.reloadScreenName == salApprovedPaymentCostRegisterKeyTask) {
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
        SalWaitApprovePaymentCostRegisterBusiness.checkForReLoadScreen[ScreenName.SalApprovedPaymentCostRegister] = false;
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        salApprovedPaymentCostRegister = ScreenName.SalApprovedPaymentCostRegister;
        salApprovePaymentCostRegisterViewDetail = ScreenName.SalApprovePaymentCostRegisterViewDetail;
        salApprovedPaymentCostRegisterKeyTask = EnumTask.KT_SalApprovedPaymentCostRegister;
        SalApprovedPaymentCostRegisterBusiness.setThisForBusiness(this);
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: salApprovedPaymentCostRegisterKeyTask,
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
                {salApprovedPaymentCostRegister && salApprovePaymentCostRegisterViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={styleContentFilterDesign}
                            screenName={salApprovedPaymentCostRegister}
                            onSubmitEditing={this.reload}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <SalApprovePaymentCostRegisterList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: salApprovePaymentCostRegisterViewDetail,
                                        screenName: salApprovedPaymentCostRegister
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={salApprovedPaymentCostRegisterKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Sal_GetData/GetSalPaymentcostRegisterApprovedPortal',
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
)(SalApprovedPaymentCostRegister);
