import React, { Component } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import VnrText from '../../../../../components/VnrText/VnrText';
import { styleSheets, Colors } from '../../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import moment from 'moment';
import TouchIDService from '../../../../../utils/TouchIDService';

export default class ContractComponent extends Component {
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

        HttpService.Post('[URI_HR]/Hre_GetData/GetContractByProfileID', dataBody, null, this.getData).then(res => {
            if (res && res.Data && Array.isArray(res.Data) && res.Data.length > 0) {
                let newItem = null;
                if (res.Data.length == 1) {
                    newItem = res.Data[0];
                } else {
                    newItem = res.Data.sort(function(a, b) {
                        return moment(b.DateSigned).toDate() - moment(a.DateSigned).toDate();
                    })[0];
                }

                this.setState({
                    dataSource: newItem,
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
        if (isSuccess) DrawerServices.navigate('Contract');
    };

    render() {
        const { isLoading, dataSource } = this.state,
            { styles, initLableValue } = this.props;
        return (
            <View style={styles.styBlock}>
                <View style={styles.styTopTitle}>
                    <View style={styles.styWrap}>
                        <VnrText style={[styleSheets.lable, styles.styTitle]} i18nKey={'HRM_Contract'} />
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
                            Name: 'ContractTypeName',
                            DisplayKey: 'HRM_HR_Contract_ContractTypeID',
                            DataType: 'string'
                        })}

                        {initLableValue(dataSource, {
                            Name: 'DateSigned',
                            DisplayKey: 'HRM_HR_Contract_DateSigned',
                            DataType: 'DateTime',
                            DataFormat: 'DD/MM/YYYY'
                        })}

                        {initLableValue(dataSource, {
                            Name: 'DateStart',
                            DisplayKey: 'HRM_HR_Profile_StartDate',
                            DataType: 'DateTime',
                            DataFormat: 'DD/MM/YYYY'
                        })}

                        {initLableValue(dataSource, {
                            Name: 'DateEnd',
                            DisplayKey: 'HRM_HR_Profile_EndDate',
                            DataType: 'DateTime',
                            DataFormat: 'DD/MM/YYYY'
                        })}
                    </View>
                )}
            </View>
        );
    }
}
