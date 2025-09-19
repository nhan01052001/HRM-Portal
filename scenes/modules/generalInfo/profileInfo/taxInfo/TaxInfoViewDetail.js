import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';

const configDefault = [
    {
        Name: 'CodeEmp',
        DisplayKey: 'HRM_Att_Leaveday_LeavedayList_CodeEmp',
        DataType: 'string'
    },
    {
        Name: 'ProfileName',
        DisplayKey: 'HRM_Att_Leaveday_LeavedayList_ProfileName',
        DataType: 'string'
    },
    {
        Name: 'PositionName',
        DisplayKey: 'HRM_Attendance_PositionName',
        DataType: 'string'
    },
    {
        Name: 'JobTitleName',
        DisplayKey: 'HRM_Attendance_JobTitleName',
        DataType: 'string'
    },
    {
        Name: 'OrgStructureName',
        DisplayKey: 'HRM_Canteen_TamScanLog_OrgStructureName',
        DataType: 'string'
    },
    {
        Name: 'CompanyName',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_strCompanyIDs',
        DataType: 'string'
    },
    {
        Name: 'WorkPlaceName',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_strWorkPlaceIDs',
        DataType: 'string'
    },
    {
        Name: 'DateSubmit',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_DateSubmit',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'CodeTax',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_CodeTax',
        DataType: 'string'
    },
    {
        Name: 'DateOfIssuedTaxCode',
        DisplayKey: 'DateOfIssuedTaxCode',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'TaxDepartment',
        DisplayKey: 'HRM_Rec_Candidate_TaxDepartment',
        DataType: 'string'
    },
    {
        Name: 'TypeView',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_strType',
        DataType: 'string'
    },
    {
        Name: 'AdjustmentCategorieView',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_AdjustmentCategorie',
        DataType: 'string'
    },
    {
        Name: 'AdditionalCategorieView',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_AdditionalCategorie',
        DataType: 'string'
    },
    {
        Name: 'lstFileAttach',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        DataType: 'FileAttach'
    },
    {
        Name: 'StatusView',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_Status',
        DataType: 'string'
    },
    {
        Name: 'Note',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_Note',
        DataType: 'string'
    }
];

export default class TaxInfoViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null
        };
    }

    getDataItem = (isReload = false) => {
        try {
            const _params = this.props.navigation.state.params,
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail =
                    ConfigListDetail.value[screenName] != null ? ConfigListDetail.value[screenName] : configDefault;
            //_configListDetail = configDefault;
            // _configListDetail = configDefault;
            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                // HttpService.Post(`[URI_HR]/Att_GetData/GetTamScanLogRegisterById`, {
                //     id: !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID,
                //     screenName: screenName,
                //     uri: dataVnrStorage.apiConfig.uriHr
                // })
                //     .then(res => {
                //         console.log(res);
                //         if (!Vnr_Function.CheckIsNullOrEmpty(res)) {
                //             this.setState({ configListDetail: _configListDetail, dataItem: res });
                //         }
                //         else {
                //             this.setState({ dataItem: 'EmptyData' });
                //         }
                //     });
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                this.setState({ configListDetail: _configListDetail, dataItem });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    componentDidMount() {
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail } = this.state,
            { containerItemDetail } = styleScreenDetail;

        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={[styleSheets.col_10]}>
                    <ScrollView>
                        <View style={containerItemDetail}>
                            {configListDetail.map((e) => {
                                return Vnr_Function.formatStringTypeV2(dataItem, e);
                            })}
                        </View>
                    </ScrollView>
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
