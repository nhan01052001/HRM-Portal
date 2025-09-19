import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import {
    generateRowActionAndSelected,
    SalApprovePITFinalizationBusinessFunction
} from './SalApprovePITFinalizationBusiness';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import DrawerServices from '../../../../../utils/DrawerServices';
import { ScreenName } from '../../../../../assets/constant';

// need fix
const configDefault = [
    {
        TypeView: 'E_COMMON',
        Name: 'EmpCode',
        DisplayKey: 'HRM_Sal_PITFinalizationDelegatee_EmpCode',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ProfileName',
        DisplayKey: 'HRM_Payroll_UnusualED_ProfileName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Year',
        DisplayKey: 'HRM_Sal_PITFinalizationDelegatee_Year',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IsFinalization',
        DisplayKey: 'HRM_Payroll_Sal_PITAmount_IsFinalization',
        DataType: 'bool'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IsPITFinalization',
        DisplayKey: 'HRM_Sal_PITFinalizationDelegatee_IsPITFinalization',
        DataType: 'bool'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IsExportTax',
        DisplayKey: 'HRM_Sal_PITFinalizationDelegatee_IsExportTax',
        DataType: 'bool'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IsTaxableIncome',
        DisplayKey: 'HRM_Sal_PITFinalizationDelegatee_IsTaxableIncome',
        DataType: 'bool'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IsTaxCurrentIncome',
        DisplayKey: 'HRM_Sal_PITFinalizationDelegatee_IsTaxCurrentIncome',
        DataType: 'bool'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Nationality',
        DisplayKey: 'HRM_Sal_PITFinalizationDelegatee_Nationality',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TaxCode',
        DisplayKey: 'HRM_Sal_PITFinalizationDelegatee_TaxCode',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Note',
        DisplayKey: 'HRM_Sal_PITFinalizationDelegatee_Note',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttach',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateUpdate',
        DisplayKey: 'HRM_Category_LeaveDayType_DateUpdate',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_STATUS',
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
        DataType: 'string'
    }
];

export default class SalApprovePITFinalizationViewDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: generateRowActionAndSelected(),
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

    getDataItem = async (isReload = false) => {
        try {
            const _params = this.props.navigation.state.params,
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail =
                    ConfigListDetail.value[screenName] != null ? ConfigListDetail.value[screenName] : configDefault;
            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                // need fix [done]
                let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;
                const response = await HttpService.Get(`[URI_HR]/api/Sal_PITFinalizationDelegatee/GetById?id=${id}`);

                const _listActions = await this.rowActionsHeaderRight(response);
                if (!Vnr_Function.CheckIsNullOrEmpty(response)) {
                    this.setState({
                        configListDetail: _configListDetail,
                        dataItem: response,
                        listActions: _listActions
                    });
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

    reload = (E_KEEP_FILTER, actionIsDelete) => {
        const { reloadScreenList } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');
        //nếu action = Delete => back về danh sách
        if (actionIsDelete) {
            DrawerServices.navigate(ScreenName.SalApprovePITFinalization);
        } else {
            this.getDataItem(true);
        }
    };

    componentDidMount() {
        SalApprovePITFinalizationBusinessFunction.setThisForBusiness(this, true);
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, listActions } = this.state,
            { containerItemDetail, bottomActions } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={CustomStyleSheet.flexGrow(1)}>
                        <View style={containerItemDetail}>
                            {configListDetail.map((e) => {
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
