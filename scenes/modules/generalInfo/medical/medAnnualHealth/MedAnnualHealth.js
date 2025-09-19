import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Colors,
    Size,
    styleSafeAreaView,
    styleContentFilterDesign
} from '../../../../../constants/styleConfig';
import { IconCreate } from '../../../../../constants/Icons';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import { generateRowActionAndSelected, MedAnnualHealthBusinessFunction } from './MedAnnualHealthBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import VnrListCommon from '../../../../../components/VnrListCommon/VnrListCommon';
import { VnrBtnCreate } from '../../../../../componentsV3/VnrBtnCreate/VnrBtnCreate';
import DrawerServices from '../../../../../utils/DrawerServices';

let permission = null,
    configList = null,
    enumName = null,
    medAnnualHealth = null,
    medAnnualHealthAddOrEdit = null,
    medAnnualHealthViewDetail = null,
    medAnnualHealthKeyTask = null,
    pageSizeList = 20;

class MedAnnualHealth extends Component {
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
        //biến lưu lại object filter
        this.paramsFilter = null;
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
                keyTask: medAnnualHealthKeyTask,
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
        const _configList = configList[medAnnualHealth],
            //renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order];

        const dataRowActionAndSelected = generateRowActionAndSelected();
        let _params = {
            IsPortal: true,
            sort: orderBy,
            pageSize: pageSizeList
        };

        return {
            rowActions: dataRowActionAndSelected.rowActions,
            selected: dataRowActionAndSelected.selected,
            //renderRow: renderRow,
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
                    keyTask: medAnnualHealthKeyTask,
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
                    keyTask: medAnnualHealthKeyTask,
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
        // console.log(nextProps,'nextProps')
        if (nextProps.reloadScreenName == medAnnualHealthKeyTask) {
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
        if (!ConfigList.value[ScreenName.MedAnnualHealth]) {
            ConfigList.value[ScreenName.MedAnnualHealth] = {
                Api: {
                    urlApi: '[URI_HR]/Med_GetData/GetAnnualHealthListPortal',
                    type: 'POST',
                    pageSize: 20
                },
                Row: [],
                Order: [],
                BusinessAction: [
                    {
                        Type: 'E_DELETE',
                        Resource: {
                            Name: 'HealthCheckupResults_Index_HealthCheckupResults_Gird_btnDel',
                            Rule: 'View'
                        },
                        Confirm: {
                            isInputText: false,
                            isValidInputText: false
                        }
                    },
                    {
                        Type: 'E_MODIFY',
                        Resource: {
                            Name: 'HealthCheckupResults_Index_HealthCheckupResults_Gird_btnEdit',
                            Rule: 'View'
                        },
                        Confirm: {
                            isInputText: true,
                            isValidInputText: false
                        }
                    },
                    {
                        Type: 'E_CANCEL',
                        Resource: {
                            Name: 'HealthCheckupResults_Index_HealthCheckupResults_Gird_btnCancel',
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
        permission = PermissionForAppMobile.value;
        configList = ConfigList.value;
        enumName = EnumName;
        medAnnualHealth = ScreenName.MedAnnualHealth; // undefind
        medAnnualHealthAddOrEdit = ScreenName.MedAnnualHealthAddOrEdit;
        medAnnualHealthViewDetail = ScreenName.MedAnnualHealthViewDetail;
        medAnnualHealthKeyTask = EnumTask.KT_MedAnnualHealth;
        MedAnnualHealthBusinessFunction.setThisForBusiness(this);
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: medAnnualHealthKeyTask,
            payload: {
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
            // renderRow,
            rowActions,
            selected,
            isLazyLoading,
            isRefreshList,
            statusDataList,
            keyQuery,
            dataChange,
            dataBusinessCost
        } = this.state;
        debugger;
        return (
            <SafeAreaView {...styleSafeAreaView}>
                {medAnnualHealth && medAnnualHealthViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <VnrListCommon
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: medAnnualHealthViewDetail,
                                        screenName: medAnnualHealth
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={medAnnualHealthKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Med_GetData/GetAnnualHealthListPortal',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: 20
                                    }}
                                    valueField="ID"
                                    //renderConfig={renderRow}
                                />
                            )}

                            {PermissionForAppMobile &&
                                PermissionForAppMobile.value[
                                    'HealthCheckupResults_Index_HealthCheckupResults_Gird_btnCreate'
                                ] &&
                                PermissionForAppMobile.value[
                                    'HealthCheckupResults_Index_HealthCheckupResults_Gird_btnCreate'
                                ]['Create'] && (
                                <VnrBtnCreate
                                    onAction={() => {
                                        DrawerServices.navigate(medAnnualHealthAddOrEdit, {
                                            reload: () => this.reload()
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

const styles = StyleSheet.create({
    headerCloseModal: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textTitleBussiness: { marginTop: 20, textAlign: 'center', fontWeight: 'bold' }
});

export default connect(
    mapStateToProps,
    null
)(MedAnnualHealth);
