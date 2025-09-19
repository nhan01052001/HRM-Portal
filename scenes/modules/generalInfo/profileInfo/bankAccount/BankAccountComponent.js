import React, { Component } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import VnrText from '../../../../../components/VnrText/VnrText';
import { styleSheets, Colors } from '../../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import { translate } from '../../../../../i18n/translate';

export default class BankAccountComponent extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            isLoading: true,
            dataSource: null
        };
    }

    getData = () => {
        const dataBody = {
            profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
        };

        const listKeyAccount = [
            'HRM_Payroll_Sal_Salary_Account_1',
            'HRM_Payroll_Sal_Salary_Account_2',
            'HRM_Payroll_Sal_Salary_Account_3',
            'HRM_Payroll_Sal_Salary_Account_4',
            'HRM_Payroll_Sal_Salary_Account_5',
            'HRM_Payroll_Sal_Salary_Account_6',
            'HRM_Payroll_Sal_Salary_Account_7',
            'HRM_Payroll_Sal_Salary_Account_8',
            'HRM_Payroll_Sal_Salary_Account_9',
            'HRM_Payroll_Sal_Salary_Account_10',
            'HRM_Payroll_Sal_Salary_Account_11',
            'HRM_Payroll_Sal_Salary_Account_12',
            'HRM_Payroll_Sal_Salary_Account_13'
        ];

        HttpService.Post('[URI_HR]/Att_GetData/GetSalSalaryInformation', dataBody, null, this.getData).then(res => {
            if (res && res.Data && Array.isArray(res.Data) && res.Data.length > 0) {
                const dataItem = res.Data[0];
                const data = [];

                for (let i = 1; i <= 13; i++) {
                    let key = listKeyAccount[i - 1];
                    let numberBank = i == 1 ? '' : i,
                        BankName = dataItem[`BankName${numberBank}`],
                        AccountNo = dataItem[`AccountNo${numberBank}`],
                        IsCash = dataItem[`IsCash${numberBank}`],
                        CurrencyName = dataItem[`CurrencyName${numberBank}`],
                        BranchName = dataItem[`BranchName${numberBank}`],
                        BankBrandName = dataItem[`BankBrandName${numberBank}`],
                        ProvinceName = dataItem[`ProvinceCodeName${numberBank}`],
                        Address = dataItem[`Address${numberBank}`],
                        SwiftCode = dataItem[`SwiftCode${numberBank}`],
                        SortCode = dataItem[`SortCode${numberBank}`],
                        CountryName = dataItem[`CountryName${numberBank}`],
                        AccountName = dataItem[`AccountName${numberBank}`],
                        IBAN = dataItem[`IBAN${numberBank}`],
                        AmountTransfer = dataItem[`AmountTransfer${numberBank}`],
                        Note = dataItem[`Note${i}`],
                        IsRemainAmontByCash = dataItem[`IsRemainAmontByCash${numberBank}`],
                        AccountCompanyName = dataItem[`AccountCompany${i}Name`];

                    if (BankName != null) {
                        let item = {
                            ...dataItem,
                            LableNumberAccount: translate(key),
                            BankName: BankName,
                            AccountNo: AccountNo,
                            IsCash: IsCash,
                            CurrencyName: CurrencyName,
                            BranchName: BranchName,
                            BankBrandName: BankBrandName,
                            ProvinceName: ProvinceName,
                            Address: Address,
                            SwiftCode: SwiftCode,
                            SortCode: SortCode,
                            CountryName: CountryName,
                            AccountName: AccountName,
                            IBAN: IBAN,
                            AmountTransfer: AmountTransfer,
                            Note: Note,
                            IsRemainAmontByCash: IsRemainAmontByCash,
                            AccountCompanyName: AccountCompanyName,
                            ID: i
                        };
                        data.push(item);
                    }
                }

                this.setState({
                    length: data.length,
                    dataSource: data,
                    isLoading: false
                });
            } else {
                this.setState({
                    isLoading: false
                });
            }
        });
    };

    componentDidMount() {
        this.getData();
    }

    render() {
        const { isLoading, length } = this.state,
            { styles } = this.props;
        return (
            <View style={styles.styBlock}>
                <View style={styles.styTopTitle}>
                    <View style={styles.styWrap}>
                        <VnrText
                            style={[styleSheets.lable, styles.styTitle]}
                            i18nKey={'HRM_PortalApp_BankAccunt_Info'}
                        />

                        {length > 0 && (
                            <View style={styles.styViewCount}>
                                <Text style={[styleSheets.text, styles.styCountText]}>
                                    {`+${length} ${translate('Sal_Infomation_Account')}`}
                                </Text>
                            </View>
                        )}
                    </View>
                    {isLoading ? (
                        <ActivityIndicator size={'small'} color={Colors.primary} />
                    ) : (
                        <TouchableOpacity
                            onPress={() =>
                                DrawerServices.navigate('TopTabBankAccountInfo', {
                                    //dataSource: dataSource,
                                    //screenName: 'BankAccountConfirmed',
                                })
                            }
                            style={styles.styWrapRight}
                        >
                            <VnrText style={[styleSheets.text, styles.styTextDetail]} i18nKey={'HRM_Common_ViewMore'} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    }
}
