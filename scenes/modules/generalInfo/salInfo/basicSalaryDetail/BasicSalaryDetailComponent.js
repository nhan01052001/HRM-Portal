import React, { Component } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import VnrText from '../../../../../components/VnrText/VnrText';
import { styleSheets, Colors } from '../../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';

export default class BasicSalaryDetailComponent extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            isLoading: true,
            dataSource: null,
            length: 0
        };
    }

    getData = () => {
        const dataBody = {
            profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
        };

        HttpService.Post('[URI_HR]/Sal_GetData/New_GetBasicSalaryByIdProfile', dataBody, null, this.getData).then(
            res => {
                if (res && res.Data && Array.isArray(res.Data) && res.Data.length > 0) {
                    this.setState({
                        dataSource: res.Data[0],
                        isLoading: false
                        //length: res.Data.length
                    });
                } else {
                    this.setState({
                        isLoading: false,
                        length: 0
                    });
                }
            }
        );
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
                        <VnrText
                            style={[styleSheets.lable, styles.styTitle]}
                            i18nKey={'HRM_HRE_Research_BasicSalary'}
                            numberOfLines={1}
                        />
                    </View>
                    {isLoading ? (
                        <ActivityIndicator size={'small'} color={Colors.primary} />
                    ) : (
                        <TouchableOpacity
                            onPress={() => DrawerServices.navigate('BasicSalaryDetail')}
                            style={styles.styWrapRight}
                        >
                            <VnrText style={[styleSheets.text, styles.styTextDetail]} i18nKey={'HRM_Common_ViewMore'} />
                        </TouchableOpacity>
                    )}
                </View>

                {dataSource !== null && (
                    <View style={styles.styViewData}>
                        {initLableValue(dataSource, {
                            Name: 'DateOfEffect',
                            DisplayKey: 'HRM_Payroll_BasicSalary_DateOfEffect',
                            DataType: 'DateTime',
                            DataFormat: 'DD/MM/YYYY'
                        })}

                        {initLableValue(dataSource, {
                            Name: 'DecisionNo',
                            DisplayKey: 'HRM_Sal_InsuranceSalry_DecisionNo',
                            DataType: 'string'
                        })}
                    </View>
                )}
            </View>
        );
    }
}
