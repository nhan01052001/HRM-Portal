import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import TaxInformationRegisterList from '../taxInformationRegisterList/TaxInformationRegisterList';
import { styleSheets, styleSafeAreaView, styleContentFilterDesign } from '../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import {
    TaxApproveTaxInformationRegisterBusinessFunctionisterList,
    generateRowActionAndSelected
} from './TaxApproveTaxInformationRegisterBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import HttpService from '../../../../../utils/HttpService';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';

let configList = null,
    enumName = null,
    taxApproveTaxInformationRegister = null,
    taxApproveTaxInformationRegisterViewDetail = null,
    taxApproveTaxInformationRegisterKeyTask = null,
    taxSubmitTaxInformationRegisterAddOrEdit = null,
    pageSizeList = 20;

class TaxApproveTaxInformationRegister extends Component {
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
            dataPlanLimit: {
                data: null,
                modalVisiblePlanLimit: false
            }
        };

        this.storeParamsDefault = null;

        // if (PermissionForAppMobile
        //     && PermissionForAppMobile.value['New_Sal_TaxInformationRegister_New_Index_Portal']
        //     && PermissionForAppMobile.value['New_Sal_TaxInformationRegister_New_Index_Portal']['Create']
        // ) {
        //     props.navigation.setParams({
        //         headerRight: (
        //             <TouchableOpacity
        //                 onPress={() => {
        //                     this.CheckUserRegisterTaxInformationForApp()
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
            TaxApproveTaxInformationRegisterBusinessFunctionisterList.setThisForBusiness(this);
            if (
                TaxApproveTaxInformationRegisterBusinessFunctionisterList.checkForReLoadScreen[
                    taxApproveTaxInformationRegister
                ]
            ) {
                this.reload();
            }
        });
    }

    CheckUserRegisterTaxInformationForApp = () => {
        HttpService.MultiRequest([
            HttpService.Get('[URI_HR]/sal_getdata/CheckUserRegisterTaxInformationForApp'),
            HttpService.Get('[URI_SYS]/Sys_GetData/GetEnum?text=TaxRegisterStatus')
        ])
            .then((resAll) => {
                if (resAll && Array.isArray(resAll) && resAll.length > 0) {
                    if (resAll[0]?.Success === true) {
                        if (resAll[0].Messenger !== undefined && resAll[0].Messenger !== null) {
                            ToasterSevice.showWarning(resAll[0].Messenger);
                        } else if (resAll[0].Data !== undefined && resAll[0].Data !== null) {
                            this.props.navigation.navigate(taxSubmitTaxInformationRegisterAddOrEdit, {
                                reload: () => this.reload(),
                                resAll
                            });
                        } else {
                            ToasterSevice.showError('HRM_Message_GetDataServices_Error');
                        }
                    } else {
                        ToasterSevice.showError('HRM_Message_GetDataServices_Error');
                    }
                }
            })
            .catch(() => {
                ToasterSevice.showWarning('HRM_Common_SendRequest_Error');
            });
    };

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
        TaxApproveTaxInformationRegisterBusinessFunctionisterList.checkForReLoadScreen[
            taxApproveTaxInformationRegister
        ] = false;

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: taxApproveTaxInformationRegisterKeyTask,
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
        if (!configList[taxApproveTaxInformationRegister]) {
            configList[taxApproveTaxInformationRegister] = {
                Api: {
                    urlApi: '[URI_HR]/Sal_GetData/GetSalTaxInformationRegisterPortal',
                    type: 'POST',
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
                            Name: 'New_Sal_TaxInformationRegister_New_Index_Portal',
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
                            Name: 'New_Sal_TaxInformationRegister_New_Index_Portal',
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
                            Name: 'New_Sal_TaxInformationRegister_btnForward',
                            Rule: 'View'
                        },
                        Confirm: {
                            isInputText: false,
                            isValidInputText: false
                        }
                    }
                ]
            };
        }
        const _configList = configList[taxApproveTaxInformationRegister],
            renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order];

        const dataRowActionAndSelected = generateRowActionAndSelected();
        let _params = {
            IsPortal: true,
            sort: orderBy,
            pageSize: pageSizeList,
            NotificationID: this.checkDataFormNotify()
            // CodeEmp: "SFN10012"
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
                    keyTask: taxApproveTaxInformationRegisterKeyTask,
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
                    keyTask: taxApproveTaxInformationRegisterKeyTask,
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
        if (nextProps.reloadScreenName == taxApproveTaxInformationRegisterKeyTask) {
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
        taxApproveTaxInformationRegister = ScreenName.TaxApproveTaxInformationRegister;
        taxApproveTaxInformationRegisterViewDetail = ScreenName.TaxApproveTaxInformationRegisterViewDetail;
        taxSubmitTaxInformationRegisterAddOrEdit = ScreenName.TaxSubmitTaxInformationRegisterAddOrEdit;
        taxApproveTaxInformationRegisterKeyTask = EnumTask.KT_AttApproveTaxInformationRegister;

        // when comein screen auto set "false"
        TaxApproveTaxInformationRegisterBusinessFunctionisterList.checkForReLoadScreen[
            taxApproveTaxInformationRegister
        ] = false;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: taxApproveTaxInformationRegisterKeyTask,
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
        const { dataBody, renderRow, rowActions, selected, isLazyLoading, isRefreshList, keyQuery, dataChange } =
            this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {taxApproveTaxInformationRegister && taxApproveTaxInformationRegisterViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={styleContentFilterDesign}
                            screenName={taxApproveTaxInformationRegister}
                            onSubmitEditing={this.reload}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <TaxInformationRegisterList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: taxApproveTaxInformationRegisterViewDetail,
                                        screenName: taxApproveTaxInformationRegister
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={taxApproveTaxInformationRegisterKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    // need fix   New_PlanOvertimeApproveByFilter [done]
                                    api={{
                                        urlApi: '[URI_HR]/Sal_GetData/GetSalTaxInformationRegisterPortal',
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

export default connect(mapStateToProps, null)(TaxApproveTaxInformationRegister);
