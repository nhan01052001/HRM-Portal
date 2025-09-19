import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView, Colors } from '../../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../../utils/HttpService';
import {
    BankAccountConfirmedBusinessFunction
} from './BankAccountConfirmedBusinessFunction';
import DrawerServices from '../../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { translate } from '../../../../../../i18n/translate';

const configDefault = [
    {
        TypeView: 'E_COMMON',
        Name: 'SalaryPaidAccountView',
        DisplayKey: 'SalaryPaidAccountView',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'GroupBank',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_GroupBank',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttach',
        DisplayKey: 'FileAttach',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_BankAccountInformation',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'AccountName',
        DisplayKey: 'HRM_Category_AccountType_AccountTypeName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'AccountNo',
        DisplayKey: 'BankAccountNo',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'BankName',
        DisplayKey: 'eBHXHD02TSTangCol46',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'BranchName',
        DisplayKey: 'HRM_Evaluation_EligibleEmployee_E_BRANCH',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'BankBrandName',
        DisplayKey: 'iBHXHD02TSTangCol47',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CountryName',
        DisplayKey: 'lblform_VisaInfo_CountryID',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ProvinceCodeName',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_ProvinceCodeNameGeneral',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Address',
        DisplayKey: 'Hre_SignatureRegister_owner_address',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SwiftCode',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_SwiftCodeGeneral',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SortCode',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_SortCodeGeneral',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateReleased',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_DateReleasedGeneral',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateExpired',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_DateExpiredGeneral',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IsCash',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_IsCashGeneral',
        DataType: 'bool'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IsRemainAmontByCash',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_IsRemainAmontByCashGeneral',
        DataType: 'bool'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'AmountTransfer',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_AmountTransferGeneral',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CurrencyName',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_CurrencyIDGeneral',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'AccountCompany1Name',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_AccountCompanyIDGeneral',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IBAN',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_IBANGeneral',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Note1',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_NoteGeneral',
        DataType: 'string'
    }
];

export default class BankAccountConfirmedViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            isMultipleAccounts: false,
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

    getDataItem = (isReload = false) => {
        try {
            const _params = this.props.navigation.state.params,
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);

            let _configListDetail =
                ConfigListDetail.value[screenName] != null ? ConfigListDetail.value[screenName] : configDefault;

            let ID = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem?.ID;
            if (!Vnr_Function.CheckIsNullOrEmpty(ID) || isReload) {
                HttpService.Get(`[URI_HR]/Att_GetData/GetByIdSalaryInformationToJson?ID=${ID}`).then(res => {
                    if (!Vnr_Function.CheckIsNullOrEmpty(res)) {
                        const data = res;
                        data.BusinessAllowAction = ['E_MODIFY'];

                        let listTopConfig = [],
                            listAccountConfig = [],
                            listAccount = [];

                        if (data.NumberOfAccount && data.NumberOfAccount != 'E_ACCOUNTS_1') {
                            const findGpIndex = _configListDetail.findIndex(item => item.TypeView == 'E_GROUP');
                            if (findGpIndex != -1) {
                                _configListDetail.forEach((item, index) => {
                                    if (index < findGpIndex) listTopConfig.push(item);
                                    else if (index > findGpIndex) {
                                        listAccount.push(item);
                                        listAccountConfig.push(item);
                                    }
                                });

                                listAccountConfig = [
                                    {
                                        TypeView: 'E_GROUP',
                                        DisplayKey: translate('InformationApproved_Account') + ' 1',
                                        DataType: 'string',
                                        ValueColor: Colors.primary
                                    }
                                ].concat(listAccountConfig);

                                let numberAccounts = data.NumberOfAccount ? data.NumberOfAccount.split('_')[2] : 0;
                                for (let i = 2; i <= parseInt(numberAccounts); i++) {
                                    listAccountConfig = listAccountConfig.concat([
                                        {
                                            TypeView: 'E_GROUP',
                                            DisplayKey: `${translate('InformationApproved_Account')} ${i}`,
                                            DataType: 'string',
                                            ValueColor: Colors.primary
                                        }
                                    ]);

                                    listAccount.map(item => {
                                        if (item.Name == 'AccountCompany1Name') {
                                            listAccountConfig.push({
                                                ...item,
                                                Name: `AccountCompany${i}Name`
                                            });
                                        } else if (item.Name == 'Note1') {
                                            listAccountConfig.push({
                                                ...item,
                                                Name: `Note${i}`
                                            });
                                        } else {
                                            listAccountConfig.push({
                                                ...item,
                                                Name: `${item.Name}${i}`
                                            });
                                        }
                                    });
                                }

                                this.setState({
                                    configListDetail: [...listTopConfig, ...listAccountConfig],
                                    dataItem: data
                                });
                            }
                        } else {
                            this.setState({ configListDetail: _configListDetail, dataItem: res });
                        }
                    } else {
                        this.setState({ dataItem: 'EmptyData' });
                    }
                });
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

    // componentDidMount() {
    //     this.getDataItem();
    // }
    componentDidMount() {
        BankAccountConfirmedBusinessFunction.setThisForBusiness(this);
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
