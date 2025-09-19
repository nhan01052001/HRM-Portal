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
    TaxSubmitTaxInformationRegisterBusinessFunction
} from './TaxSubmitTaxInformationRegisterBusiness';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import DrawerServices from '../../../../../utils/DrawerServices';

// need fix
const configDefault = [
    {
        Name: 'CodeEmp',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_CodeEmp',
        DataType: 'string'
    },
    {
        Name: 'ProfileName',
        DisplayKey: 'HRM_Att_Leaveday_LeavedayList_ProfileName',
        DataType: 'string'
    },
    {
        Name: 'Type',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_strType',
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
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_DateOfIssuedTaxCode',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'TaxDepartment',
        DisplayKey: 'HRM_Rec_Candidate_TaxDepartment',
        DataType: 'string'
    },
    {
        Name: 'ProfileName',
        DisplayKey: 'eBHXHD02TSTangCol1',
        DataType: 'string'
    },
    {
        Name: 'DateOfBirth',
        DisplayKey: 'eBHXHD02TSTangCol3',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'CountryName',
        DisplayKey: 'eBHXHD02TSTangCol24',
        DataType: 'string'
    },
    {
        Name: 'PhoneNumber',
        DisplayKey: 'HRM_Insurance_InsuranceInfo_PhoneNumber',
        DataType: 'string'
    },
    {
        Name: 'Email',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_Email',
        DataType: 'string'
    },
    {
        Name: 'CompanyEmail ',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_CompanyEmail',
        DataType: 'string'
    },
    {
        Name: 'CompanyName',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_strCompanyIDs',
        DataType: 'string'
    },
    {
        Name: 'lstFileAttach',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        DataType: 'FileAttach'
    },
    {
        Name: 'Note',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_Note',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'SalaryTaxInfoToInput__E_IDCard',
        DataType: 'string'
    },
    {
        Name: 'IDNo',
        DisplayKey: 'eBHXHD02TSGiamCol74',
        DataType: 'string'
    },
    {
        Name: 'DateOfBirth',
        DisplayKey: 'eBHXHD02TSTangCol3',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'IDPlaceOfIssue',
        DisplayKey: 'Rec_CandidateProfile_PlaceOfIssueNewID',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'IdentificationNo',
        DataType: 'string'
    },
    {
        Name: 'IDCard',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_IDCard',
        DataType: 'string'
    },
    {
        Name: 'IDCardDateOfIssue',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_IDCardDateOfIssue',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'IDCardPlaceOfIssue',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_IDCardPlaceOfIssue',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'SalaryTaxInfoToInput__E_Passport',
        DataType: 'string'
    },
    {
        Name: 'PassportNo',
        DisplayKey: 'iBHXHD02TSGiamCol131',
        DataType: 'string'
    },
    {
        Name: 'PassportDateofIssue',
        DisplayKey: 'ProfilePassportDateOfIssue',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'PassportPlaceOfIssue',
        DisplayKey: 'ProfilePassportPlaceOfIssue',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Hre_Relatives_PAddress',
        DataType: 'string'
    },
    {
        Name: 'CountryName',
        DisplayKey: 'HRM_Hre_Relatives_CountryPermanent',
        DataType: 'string'
    },
    {
        Name: 'ProvinceName',
        DisplayKey: 'HRM_Hre_Relatives_ProvincePermanent',
        DataType: 'string'
    },
    {
        Name: 'DistrictName',
        DisplayKey: 'HRM_Hre_Relatives_DistrictPermanent',
        DataType: 'string'
    },
    {
        Name: 'VillageName',
        DisplayKey: 'HRM_Hre_Relatives_WardPermanent',
        DataType: 'string'
    },
    {
        Name: 'PAddress',
        DisplayKey: 'HRM_Hre_Relatives_AddressPermanent',
        DataType: 'string'
    },
    {
        Name: 'CountryName',
        DisplayKey: 'HRM_Hre_Relatives_CountryTemporary',
        DataType: 'string'
    },
    {
        Name: 'ProvinceName',
        DisplayKey: 'HRM_Hre_Relatives_ProvinceTemporary',
        DataType: 'string'
    },
    {
        Name: 'DistrictName',
        DisplayKey: 'HRM_Hre_Relatives_DistrictTemporary',
        DataType: 'string'
    },
    {
        Name: 'VillageName',
        DisplayKey: 'HRM_Hre_Relatives_WardTemporary',
        DataType: 'string'
    },
    {
        Name: 'PAddress',
        DisplayKey: 'HRM_Hre_Relatives_AddressTemporary',
        DataType: 'string'
    }
];

export default class TaxSubmitTaxInformationRegisterViewDetail extends Component {
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
                const response = await HttpService.Get(
                    `[URI_HR]/api/Sal_TaxInformationRegister?id=${
                        !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID
                    }`
                );

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
            DrawerServices.navigate('TaxSubmitTaxInformationRegister');
        } else {
            this.getDataItem(true);
        }
    };

    componentDidMount() {
        TaxSubmitTaxInformationRegisterBusinessFunction.setThisForBusiness(this, true);
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
