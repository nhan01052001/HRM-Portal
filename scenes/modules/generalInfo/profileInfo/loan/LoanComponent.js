import React, { Component } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import VnrText from '../../../../../components/VnrText/VnrText';
import {
    styleSheets,
    Colors
} from '../../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName } from '../../../../../assets/constant';

export default class LoanComponent extends Component {

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

        if (!dataBody.profileID) {
            this.setState({
                isLoading: false
            });

            return;
        }

        HttpService.Get(`[URI_CENTER]/api/Hre_Personal/GetCreditByUserlogin?profileID=${dataBody.profileID}`, null, this.getData).
            then(res => {
                if (res && res?.Status === EnumName.E_SUCCESS && res.Data) {

                    this.setState({
                        dataSource: res.Data,
                        isLoading: false
                    });
                }
                else {
                    this.setState({
                        isLoading: false
                    });
                }
            });
    }

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
                        <VnrText style={[styleSheets.lable, styles.styTitle]}
                            i18nKey={'HRM_PortalApp_Loan'} />
                    </View>
                    {
                        isLoading ?
                            <ActivityIndicator size={'small'} color={Colors.primary} />
                            : (
                                <TouchableOpacity onPress={() => DrawerServices.navigate('Loan')}
                                    style={styles.styWrapRight}
                                >
                                    <VnrText style={[styleSheets.text, styles.styTextDetail]}
                                        i18nKey={'HRM_Common_ViewMore'} />
                                </TouchableOpacity>
                            )
                    }

                </View>


                {
                    dataSource && (
                        <View style={styles.styViewData}>
                            {initLableValue(
                                dataSource, {
                                    Name: 'AnnualLimit',
                                    DisplayKey: 'HRM_PortalApp_AnnualLimit',
                                    'DataType': 'Double',
                                    'DataFormat': '#,###.##'
                                })}

                            {initLableValue(
                                dataSource, {
                                    Name: 'UsedLimit',
                                    DisplayKey: 'HRM_PortalApp_UsedLimit',
                                    'DataType': 'Double',
                                    'DataFormat': '#,###.##'
                                })}

                            {initLableValue(
                                dataSource, {
                                    Name: 'RemainingLimit',
                                    DisplayKey: 'HRM_PortalApp_RemainingLimit',
                                    'DataType': 'Double',
                                    'DataFormat': '#,###.##'
                                })}
                        </View>
                    )
                }
            </View>

        );
    }
}