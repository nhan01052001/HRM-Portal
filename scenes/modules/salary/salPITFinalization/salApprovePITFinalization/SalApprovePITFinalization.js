import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import SalPITFinalizationList from '../salPITFinalizationList/SalPITFinalizationList';
import { styleSheets, styleSafeAreaView, styleContentFilterDesign } from '../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import {
    SalApprovePITFinalizationBusinessFunction,
    generateRowActionAndSelected
} from './SalApprovePITFinalizationBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import DrawerServices from '../../../../../utils/DrawerServices';
import { VnrBtnCreate } from '../../../../../componentsV3/VnrBtnCreate/VnrBtnCreate';

let configList = null,
    enumName = null,
    salApprovePITFinalization = null,
    salApprovePITFinalizationAddOrEdit = null,
    salApprovePITFinalizationViewDetail = null,
    salApprovePITFinalizationTask = null,
    pageSizeList = 20;

class SalApprovePITFinalization extends Component {
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

        //biến lưu lại object filter
        this.paramsFilter = null;

        // if (PermissionForAppMobile && PermissionForAppMobile.value['New_Sal_PITFinalizationDelegatee_New_Index']
        //     && PermissionForAppMobile.value['New_Sal_PITFinalizationDelegatee_New_Index']['Create']
        // ) {
        //     props.navigation.setParams({
        //         headerRight: (
        //             <TouchableOpacity
        //                 onPress={() => {
        //                     props.navigation.navigate(salApprovePITFinalizationAddOrEdit, { reload: this.reload })
        //                 }} >
        //                 <View style={styleSheets.bnt_HeaderRight}>
        //                     <IconCreate color={Colors.gray_10} size={Size.iconSizeHeader} />
        //                 </View>
        //             </TouchableOpacity>
        //         )
        //     });
        // }
        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // Trường hợp goBack từ detail thì phải gán lại this
            SalApprovePITFinalizationBusinessFunction.setThisForBusiness(this);
            if (SalApprovePITFinalizationBusinessFunction.checkForReLoadScreen[salApprovePITFinalization]) {
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

        // set "false" when reloaded
        SalApprovePITFinalizationBusinessFunction.checkForReLoadScreen[salApprovePITFinalization];

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: salApprovePITFinalizationTask,
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
        if (!configList[salApprovePITFinalization]) {
            configList[salApprovePITFinalization] = {
                Api: {
                    urlApi: '[URI_HR]/Sal_GetData/GetSalPITFinalizationDelegateeList_Portal',
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
                            Name: 'New_Sal_PITFinalizationDelegatee_New_Index',
                            Rule: 'Modify'
                        },
                        Confirm: {
                            isInputText: true,
                            isValidInputText: false
                        }
                    },
                    {
                        Type: 'E_DELETE',
                        Resource: {
                            Name: 'New_Sal_PITFinalizationDelegatee_New_Index',
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
                            Name: 'New_Sal_PITFinalizationDelegatee_btnSendRequest',
                            Rule: 'View'
                        }
                    }
                ]
            };
        }

        const _configList = configList[salApprovePITFinalization],
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
                    keyTask: salApprovePITFinalizationTask,
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
                    keyTask: salApprovePITFinalizationTask,
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
        if (nextProps.reloadScreenName == salApprovePITFinalizationTask) {
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
        //main
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;

        salApprovePITFinalization = ScreenName.SalApprovePITFinalization;
        salApprovePITFinalizationAddOrEdit = ScreenName.SalApprovePITFinalizationAddOrEdit;
        salApprovePITFinalizationViewDetail = ScreenName.SalApprovePITFinalizationViewDetail;
        salApprovePITFinalizationTask = EnumTask.KT_SalApprovePITFinalization;

        // when comein screen auto set "false"
        SalApprovePITFinalizationBusinessFunction.checkForReLoadScreen[salApprovePITFinalization] = false;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: salApprovePITFinalizationTask,
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
                {salApprovePITFinalization && salApprovePITFinalizationViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={styleContentFilterDesign}
                            screenName={salApprovePITFinalization}
                            onSubmitEditing={this.reload}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <SalPITFinalizationList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: salApprovePITFinalizationViewDetail,
                                        screenName: salApprovePITFinalization
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={salApprovePITFinalizationTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    // need fix  New_PlanOvertimeByFilter GetRegisterVehiclePortal
                                    api={{
                                        urlApi: '[URI_HR]/Sal_GetData/GetSalPITFinalizationDelegateeList_Portal',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: 20
                                    }}
                                    valueField="ID"
                                    renderConfig={renderRow}
                                />
                            )}
                            {PermissionForAppMobile &&
                                PermissionForAppMobile.value[
                                    'New_Sal_PITFinalizationDelegatee_WaitingConfirm_New_Index'
                                ] &&
                                PermissionForAppMobile.value[
                                    'New_Sal_PITFinalizationDelegatee_WaitingConfirm_New_Index'
                                ]['Create'] && (
                                <VnrBtnCreate
                                    onAction={() => {
                                        DrawerServices.navigate(salApprovePITFinalizationAddOrEdit, {
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

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(mapStateToProps, null)(SalApprovePITFinalization);
