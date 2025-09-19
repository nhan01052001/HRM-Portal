import React, { Component } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import VnrText from '../../../../../components/VnrText/VnrText';
import { styleSheets, Colors } from '../../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
export default class TaxInfoComponent extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            isLoading: true,
            dataSource: null
        };
    }

    getData = () => {
        const dataBody = {
            UserSubmit: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
        };

        HttpService.Post(
            '[URI_HR]/Sal_GetData/GetSalTaxInformationRegisterPortalByStatusForApp',
            dataBody,
            null,
            this.getData
        ).then(res => {
            if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
                this.setState({
                    dataSource: res.data[0],
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
        const { isLoading, dataSource } = this.state,
            { styles, initLableValue } = this.props;
        return (
            <View style={styles.styBlock}>
                <View style={styles.styTopTitle}>
                    <View style={styles.styWrap}>
                        <VnrText style={[styleSheets.lable, styles.styTitle]} i18nKey={'HRM_HR_Profile_CodeTax'} />
                    </View>
                    {isLoading ? (
                        <ActivityIndicator size={'small'} color={Colors.primary} />
                    ) : (
                        <TouchableOpacity
                            onPress={() => DrawerServices.navigate('TaxInfo')}
                            style={styles.styWrapRight}
                        >
                            <VnrText style={[styleSheets.text, styles.styTextDetail]} i18nKey={'HRM_Common_ViewMore'} />
                        </TouchableOpacity>
                    )}
                </View>

                {dataSource !== null && (
                    <View style={styles.styViewData}>
                        {initLableValue(dataSource, {
                            Name: 'CodeTax',
                            DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_CodeTax',
                            DataType: 'string'
                        })}

                        {initLableValue(dataSource, {
                            Name: 'DateSubmit',
                            DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_DateSubmit',
                            DataType: 'DateTime',
                            DataFormat: 'DD/MM/YYYY'
                        })}
                    </View>
                )}
            </View>
        );
    }
}
