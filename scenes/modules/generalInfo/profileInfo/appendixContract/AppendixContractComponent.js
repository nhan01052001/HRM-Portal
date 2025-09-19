import React, { Component } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import VnrText from '../../../../../components/VnrText/VnrText';
import { styleSheets, Colors } from '../../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import TouchIDService from '../../../../../utils/TouchIDService';

export default class AppendixContractComponent extends Component {
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

        HttpService.Post('[URI_HR]/Hre_GetData/GetContractAnnexByProfileID', dataBody, null, this.getData).then(res => {
            if (res && res.Data && Array.isArray(res.Data) && res.Data.length > 0) {
                this.setState({
                    dataSource: res.Data[0],
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

    onFinish = isSuccess => {
        if (isSuccess) DrawerServices.navigate('AppendixContract');
    };

    render() {
        const { isLoading, dataSource } = this.state,
            { styles, initLableValue } = this.props;
        return (
            <View style={styles.styBlock}>
                <View style={styles.styTopTitle}>
                    <View style={styles.styWrap}>
                        <VnrText style={[styleSheets.lable, styles.styTitle]} i18nKey={'HRM_HR_Appendix_Contract'} />
                    </View>
                    {isLoading ? (
                        <ActivityIndicator size={'small'} color={Colors.primary} />
                    ) : (
                        <TouchableOpacity
                            onPress={() => TouchIDService.checkConfirmPass(this.onFinish.bind(this), 'E_CONTRACT')}
                            style={styles.styWrapRight}
                        >
                            <VnrText style={[styleSheets.text, styles.styTextDetail]} i18nKey={'HRM_Common_ViewMore'} />
                        </TouchableOpacity>
                    )}
                </View>

                {dataSource !== null && (
                    <View style={styles.styViewData}>
                        {initLableValue(dataSource, {
                            Name: 'AnnexCode',
                            DisplayKey: 'HRM_Hre_ContractExtend_AnnexCode',
                            DataType: 'string'
                        })}

                        {initLableValue(dataSource, {
                            Name: 'AppendixContractName',
                            DisplayKey: 'AppendixContractTypeName',
                            DataType: 'string'
                        })}

                        {initLableValue(dataSource, {
                            Name: 'ContractAnnexStartDate',
                            DisplayKey: 'HRM_Hre_ContractExtend_DateStart',
                            DataType: 'DateTime',
                            DataFormat: 'DD/MM/YYYY'
                        })}

                        {initLableValue(dataSource, {
                            Name: 'ContractAnnexEndDate',
                            DisplayKey: 'HRM_Hre_ContractExtend_DateEnd',
                            DataType: 'DateTime',
                            DataFormat: 'DD/MM/YYYY'
                        })}
                    </View>
                )}
            </View>
        );
    }
}
