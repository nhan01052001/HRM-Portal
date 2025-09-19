import React, { Component } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import VnrText from '../../../../../components/VnrText/VnrText';
import { styleSheets, Colors } from '../../../../../constants/styleConfig';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
export default class PassportComponent extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            isLoading: true,
            dataSource: null
        };
    }

    getData = () => {
        this.setState({
            dataSource: null,
            isLoading: false
        });

        HttpService.Post(
            `[URI_HR]/Hre_GetDataV2/GetListPassportByProfileID?profileID=${dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null}`,
            null,
            this.getData
        ).then((res) => {
            if (res && res.Data && Array.isArray(res.Data) && res.Data.length > 0) {
                let newItem = res.Data[0];


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

    render() {
        const { isLoading, dataSource } = this.state,
            { styles, initLableValue } = this.props;

        return (
            <View style={styles.styBlock}>
                <View style={styles.styTopTitle}>
                    <View style={styles.styWrap}>
                        <VnrText
                            style={[styleSheets.lable, styles.styTitle]}
                            i18nKey={'ProfilePersonalInfoToInput__E_Passport'}
                        />
                    </View>
                    {isLoading ? (
                        <ActivityIndicator size={'small'} color={Colors.primary} />
                    ) : (
                        <TouchableOpacity
                            onPress={() =>
                                DrawerServices.navigate('TopTabPassportInfo')
                            }
                            style={styles.styWrapRight}
                        >
                            <VnrText style={[styleSheets.text, styles.styTextDetail]} i18nKey={'HRM_Common_ViewMore'} />
                        </TouchableOpacity>
                    )}
                </View>

                {dataSource !== null && (
                    <View style={styles.styViewData}>
                        {initLableValue(dataSource, {
                            Name: 'PassportNo',
                            DisplayKey: 'HRM_HR_Profile_PassportNo',
                            DataType: 'string'
                        })}

                        {initLableValue(dataSource, {
                            Name: 'PassportPlaceNewName',
                            DisplayKey: 'HRM_HR_Profile_PassportPlaceOfIssue',
                            DataType: 'string'
                        })}

                        {initLableValue(dataSource, {
                            Name: 'PassportDateOfIssue',
                            DisplayKey: 'HRM_HR_Profile_PassportDateOfIssue',
                            DataType: 'DateTime',
                            DataFormat: 'DD/MM/YYYY'
                        })}

                        {initLableValue(dataSource, {
                            Name: 'PassportDateOfExpiry',
                            DisplayKey: 'HRM_HR_Profile_PassportDateOfExpiry',
                            DataType: 'DateTime',
                            DataFormat: 'DD/MM/YYYY'
                        })}
                    </View>
                )}
            </View>
        );
    }
}
