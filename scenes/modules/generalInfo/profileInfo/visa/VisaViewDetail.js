import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import DrawerServices from '../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import HttpService from '../../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';

const configDefault = [
    {
        Name: 'VisaInfoName',
        DisplayKey: 'HRM_PotalApp_VisaName',
        DataType: 'string'
    },
    {
        Name: 'VisaNo',
        DisplayKey: 'HRM_PotalApp_VisaNo',
        DataType: 'string'
    },
    {
        Name: 'VisaCode',
        DisplayKey: 'HRM_PotalApp_VisaCode',
        DataType: 'string'
    },
    {
        Name: 'Type',
        DisplayKey: 'Hrm_Hre_Type',
        DataType: 'string'
    },
    {
        Name: 'VisaType',
        DisplayKey: 'HRM_PotalApp_VisaType_NumberInOut',
        DataType: 'string'
    },
    {
        Name: 'DateOfIssue',
        DisplayKey: 'HRM_HR_Certificate_DateOfIssuance',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'DateStart',
        DisplayKey: 'HRM_Common_DateStart',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'DateEnd',
        DisplayKey: 'HRM_Common_DateEnd',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'CountryName',
        DisplayKey: 'HRM_PortalApp_Country',
        DataType: 'string'
    },
    {
        Name: 'ProvinceName',
        DisplayKey: 'HRM_PortalApp_Province',
        DataType: 'string'
    },
    {
        Name: 'PlaceOfIssue',
        DisplayKey: 'HRM_PotalApp_VisaIssuePlace',
        DataType: 'string'
    },
    {
        Name: 'TotalCost',
        DisplayKey: 'HRM_PotalApp_VisaTotalExpense',
        DataType: 'string'
    },
    {
        Name: 'ExpenseWithInvoice',
        DisplayKey: 'HRM_PotalApp_ExpenseWithBill',
        DataType: 'string'
    },
    {
        Name: 'ExpenseWithInvoiceCompany',
        DisplayKey: 'HRM_PotalApp_ExpenseWithBillCompany',
        DataType: 'string'
    },
    {
        Name: 'ExpenseWithInvoiceEmployee',
        DisplayKey: 'HRM_PotalApp_ExpenseWithBillEmployee',
        DataType: 'string'
    },
    {
        Name: 'CostWithoutInvoice',
        DisplayKey: 'HRM_PotalApp_ExpenseWithoutBill',
        DataType: 'string'
    },
    {
        Name: 'CostWithoutInvoiceCompany',
        DisplayKey: 'HRM_PotalApp_ExpenseWithoutBillCompany',
        DataType: 'string'
    },
    {
        Name: 'CostWithoutInvoiceEmployee',
        DisplayKey: 'HRM_PotalApp_ExpenseWithoutBillEmployee',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttach',
        DisplayKey: 'Attachment',
        DataType: 'FileAttach'
    },
    {
        Name: 'Notes',
        DisplayKey: 'Note',
        DataType: 'string'
    }
];

export default class VisaViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            //dataRowActionAndSelected: generateRowActionAndSelected(ScreenName.QualificationEdit),
            listActions: this.resultListActionHeader()
        };
    }

    resultListActionHeader = () => {
        const _params = this.props.navigation.state.params;
        if (_params && _params.listActions && Array.isArray(_params.listActions)) {
            return _params.listActions;
        }
        return [];
    };

    // rowActionsHeaderRight = (dataItem) => {
    //     let _listActions = [];
    //     const { rowActions } = this.state.dataRowActionAndSelected;

    //     if (!Vnr_Function.CheckIsNullOrEmpty(rowActions) && !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction)) {
    //         _listActions = rowActions.filter(
    //             (item) => {
    //                 return dataItem.BusinessAllowAction.indexOf(item.type) >= 0
    //             });
    //     }
    //     return _listActions;
    // }

    getDataItem = () => {
        try {
            // const _params = this.props.navigation.state.params,
            //     { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
            const _configListDetail = ConfigListDetail.value['VisaViewDetail']
                ? ConfigListDetail.value['VisaViewDetail']
                : configDefault;


            const profileInfo = dataVnrStorage
                ? dataVnrStorage.currentUser
                    ? dataVnrStorage.currentUser.info
                    : null
                : null;

            const profileID = profileInfo?.ProfileID;
            if (!profileID) {
                this.setState({ dataItem: 'EmptyData' });
                return;
            }

            HttpService.Get(`[URI_CENTER]/Hre_Personal/GetProfileUniformByProfileID?profileID=${profileID}`).then((res) => {
                if (!res) {
                    this.setState({ dataItem: 'EmptyData' });
                    return;
                }

                if (res?.Attachment)
                    res.lstFileAttach = ManageFileSevice.setFileAttachApp(res.Attachment);

                this.setState({ configListDetail: _configListDetail, dataItem: res });
            }).catch((error) => {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            })
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    reload = (E_KEEP_FILTER, actionIsDelete) => {
        //detail
        const { reloadScreenList, screenName } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');

        //nếu action = Delete => back về danh sách
        if (actionIsDelete) {
            DrawerServices.navigate(screenName);
        } else {
            this.getDataItem();
        }
    };

    componentDidMount() {
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, listActions } = this.state,
            { containerItemDetail, bottomActions } = styleScreenDetail;

        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={[styleSheets.col_10]}>
                    <ScrollView>
                        <View style={containerItemDetail}>
                            {configListDetail.map(e => {
                                return Vnr_Function.formatStringTypeV2(dataItem, e);
                            })}
                        </View>
                    </ScrollView>
                    {Array.isArray(listActions) && listActions.length > 0 && (
                        <View style={bottomActions}>
                            <ListButtonMenuRight listActions={listActions} dataItem={dataItem} />
                        </View>
                    )}
                </View>
            );
        } else if (dataItem == 'EmptyData') {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaView>
        );
    }
}
