import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import {
    generateRowActionAndSelected,
    SalSubmitPITFinalizationBusinessFunction
} from './SalSubmitPITFinalizationBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import SalSubmitPITFinalizationAddOrEdit from './SalSubmitPITFinalizationAddOrEdit';

const configDefault = [
    {
        TypeView: 'E_STATUS',
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
        DataType: 'string',
        isHiddenDate: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'YearFormat',
        DisplayKey: 'HRM_Sal_PITFinalizationDelegatee_Year',
        DataType: 'DateTime',
        DataFormat: 'YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'RegisterTypeView',
        DisplayKey: 'HRM_PortalApp_PITFinalization_RegisterType',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IsTaxableIncome',
        DisplayKey: 'HRM_PortalApp_PITFinalization_TaxableIncome',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IsTransferCompany',
        DisplayKey: 'HRM_PortalApp_PITFinalization_TransferCompany',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IsTaxCurrentIncome',
        DisplayKey: 'HRM_PortalApp_PITFinalization_TaxCurrentIncome',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CodeTax',
        DisplayKey: 'HRM_PortalApp_PITFinalization_TaxCode',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'UserConfirm',
        DisplayKey: 'HRM_PortalApp_PITFinalization_Confirmator',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateConfirm',
        DisplayKey: 'HRM_PortalApp_PITFinalization_ConfirmationDate',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttach',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        DataType: 'FileAttach'
    }
];

export default class SalSubmitPITFinalizationViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: generateRowActionAndSelected(ScreenName.SalSubmitPITFinalization),
            listActions: this.resultListActionHeader()
        };
        this.SalSubmitPITFinalizationAddOrEdit = null;
    }

    onEdit = (item) => {
        if (item) {
            if (this.SalSubmitPITFinalizationAddOrEdit && this.SalSubmitPITFinalizationAddOrEdit.onShow) {
                this.SalSubmitPITFinalizationAddOrEdit.onShow({
                    reload: this.reload,
                    record: item
                });
            }
        }
    };

    resultListActionHeader = () => {
        const _params = this.props.navigation.state.params;
        if (_params && _params.listActions && Array.isArray(_params.listActions)) {
            return _params.listActions;
        }
        return [];
    };

    rowActionsHeaderRight = (dataItem) => {
        let _listActions = [];
        const { rowActions } = this.state.dataRowActionAndSelected;

        if (
            !Vnr_Function.CheckIsNullOrEmpty(rowActions) &&
            !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction)
        ) {
            _listActions = rowActions.filter((item) => {
                return dataItem.BusinessAllowAction.indexOf(item.type) >= 0;
            });
        }
        return _listActions;
    };

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[ScreenName.SalSubmitPITFinalizationViewDetail]
                    ? ConfigListDetail.value[ScreenName.SalSubmitPITFinalizationViewDetail]
                    : configDefault;

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;
            if (id) {
                const response = await HttpService.Get(
                    `[URI_CENTER]/api/Sal_PITFinalizationDelegatee/GetPITFinalizationDelegateeByID?ID=${id}`
                );

                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = {
                        ...dataItem,
                        ...response.Data
                    };

                    if (Array.isArray(response.Data?.listPit)) {
                        data = {
                            ...data,
                            ...response.Data?.listPit[0]
                        };
                    }

                    data.itemStatus = Vnr_Services.formatStyleStatusApp(data.Status);
                    data.lstFileAttach = ManageFileSevice.setFileAttachApp(data.FileAttachment);
                    const _listActions = this.rowActionsHeaderRight(data);
                    this.setState({ configListDetail: _configListDetail, dataItem: data, listActions: _listActions });
                } else {
                    this.setState({ dataItem: 'EmptyData' });
                }
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                this.setState({ configListDetail: _configListDetail, dataItem });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    reload = () => {
        const { reloadScreenList } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');
        //this.getDataItem(true);
    };

    componentDidMount() {
        SalSubmitPITFinalizationBusinessFunction.setThisForBusiness(this);
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, listActions } = this.state,
            { containerItemDetail, contentScroll, bottomActions } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;

        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <SalSubmitPITFinalizationAddOrEdit
                        ref={(refs) => (this.SalSubmitPITFinalizationAddOrEdit = refs)}
                    />
                    <ScrollView style={contentScroll} showsVerticalScrollIndicator={false}>
                        <View style={containerItemDetail}>
                            {configListDetail.map((e) => {
                                if (e.TypeView != 'E_COMMON_PROFILE')
                                    return Vnr_Function.formatStringTypeV3(dataItem, e, configListDetail);
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
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaViewDetail>
        );
    }
}
