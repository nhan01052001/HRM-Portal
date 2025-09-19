import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import TaxInformationRegisterList from '../taxInformationRegisterList/TaxInformationRegisterList';
import { styleSheets, styleSafeAreaView, styleContentFilterDesign } from '../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import {
    TaxApprovedTaxInformationRegisterBusinessFunction,
    generateRowActionAndSelected
} from './TaxApprovedTaxInformationRegisterBusiness';
import { TaxApproveTaxInformationRegisterBusinessFunctionisterList } from '../taxApproveTaxInformationRegister/TaxApproveTaxInformationRegisterBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import HttpService from '../../../../../utils/HttpService';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { VnrBtnCreate } from '../../../../../componentsV3/VnrBtnCreate/VnrBtnCreate';

let configList = null,
    enumName = null,
    taxApprovedTaxInformationRegister = null,
    taxApprovedTaxInformationRegisterViewDetail = null,
    taxApprovedTaxInformationRegisterKeyTask = null,
    taxSubmitTaxInformationRegisterAddOrEdit = null,
    pageSizeList = 20;

class TaxApprovedTaxInformationRegister extends Component {
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
        // set lại false khi đã reload
        TaxApproveTaxInformationRegisterBusinessFunctionisterList.checkForReLoadScreen[
            ScreenName.TaxApprovedTaxInformationRegister
        ] = false;
        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: taxApprovedTaxInformationRegisterKeyTask,
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
        if (!configList[taxApprovedTaxInformationRegister]) {
            configList[taxApprovedTaxInformationRegister] = {
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
                        Type: 'E_DELETE',
                        Resource: {
                            Name: 'New_Sal_TaxInformationRegister_New_Index_Portal',
                            Rule: 'Delete'
                        },
                        Confirm: {
                            isInputText: false,
                            isValidInputText: false
                        }
                    }
                ]
            };
        }

        const _configList = configList[taxApprovedTaxInformationRegister],
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
                    keyTask: taxApprovedTaxInformationRegisterKeyTask,
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
                    keyTask: taxApprovedTaxInformationRegisterKeyTask,
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
        if (nextProps.reloadScreenName == taxApprovedTaxInformationRegisterKeyTask) {
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
        TaxApproveTaxInformationRegisterBusinessFunctionisterList.checkForReLoadScreen[
            ScreenName.TaxApprovedTaxInformationRegister
        ] = false;

        //set by config
        configList = ConfigList.value;
        enumName = EnumName;

        taxApprovedTaxInformationRegister = ScreenName.TaxApprovedTaxInformationRegister;
        taxApprovedTaxInformationRegisterViewDetail = ScreenName.TaxApprovedTaxInformationRegisterViewDetail;
        taxSubmitTaxInformationRegisterAddOrEdit = ScreenName.TaxSubmitTaxInformationRegisterAddOrEdit;
        taxApprovedTaxInformationRegisterKeyTask = EnumTask.KT_AttApprovedTaxInformationRegister;
        TaxApprovedTaxInformationRegisterBusinessFunction.setThisForBusiness(this);
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: taxApprovedTaxInformationRegisterKeyTask,
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
                {taxApprovedTaxInformationRegister && taxApprovedTaxInformationRegisterViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={styleContentFilterDesign}
                            screenName={taxApprovedTaxInformationRegister}
                            onSubmitEditing={this.reload}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <TaxInformationRegisterList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: taxApprovedTaxInformationRegisterViewDetail,
                                        screenName: taxApprovedTaxInformationRegister
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={taxApprovedTaxInformationRegisterKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
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

                            {PermissionForAppMobile &&
                                PermissionForAppMobile.value['New_Sal_TaxInformationRegister_New_Index_Portal'] &&
                                PermissionForAppMobile.value['New_Sal_TaxInformationRegister_New_Index_Portal'][
                                    'Create'
                                ] && <VnrBtnCreate onAction={() => this.CheckUserRegisterTaxInformationForApp()} />}
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

export default connect(mapStateToProps, null)(TaxApprovedTaxInformationRegister);
