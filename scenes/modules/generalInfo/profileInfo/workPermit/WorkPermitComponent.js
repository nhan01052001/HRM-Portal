import React, { Component } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import VnrText from '../../../../../components/VnrText/VnrText';
import { styleSheets, Colors } from '../../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';

export default class WorkPermitComponent extends Component {
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

        HttpService.Post('[URI_HR]/Hre_GetData/GetListRelativeByProfileID', dataBody, null, this.getData).then(res => {
            if (res && res.Data && Array.isArray(res.Data) && res.Data.length > 0) {
                this.setState({
                    dataSource: res.Data,
                    length: res.Data.length,
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
        const { isLoading } = this.state,
            { styles } = this.props;
        return (
            <View style={styles.styBlock}>
                <View style={styles.styTopTitle}>
                    <View style={styles.styWrap}>
                        <VnrText
                            style={[styleSheets.lable, styles.styTitle]}
                            i18nKey={'HRM_Hr_Hre_IsCopyworkpermit'}
                            numberOfLines={1}
                        />
                        {/* {
                            length > 0 && (
                                <View style={styles.styViewCount}>
                                    <Text style={[styleSheets.text, styles.styCountText]}>
                                        {`+${length} ${translate('Hrm_Sal_EvaluationOfSalaryApprove_FluctuationsPerson')}`}
                                    </Text>
                                </View>
                            )
                        } */}
                    </View>

                    {isLoading ? (
                        <ActivityIndicator size={'small'} color={Colors.primary} />
                    ) : (
                        <TouchableOpacity onPress={() => DrawerServices.navigate('WorkPermit')}>
                            <VnrText style={[styleSheets.text, styles.styTextDetail]} i18nKey={'HRM_Common_ViewMore'} />
                        </TouchableOpacity>
                    )}
                </View>
                {/* <View style={styles.styViewData}>
                    {
                        (dataSource && dataSource.length > 0) && (
                            dataSource.map((item, index) => {
                                return (
                                    <View style={[styles.styViewData, { marginTop: 0 }]}>
                                        {initLableValue(
                                            item, {
                                            Name: "RelativeName",
                                            DisplayKey: "HRM_HR_Profile_LastName",
                                            DataType: "string",
                                        })}

                                        {initLableValue(
                                            item, {
                                            Name: "RelativeTypeName",
                                            DisplayKey: "RelativeTypeName",
                                            DataType: "string",
                                        })}

                                    </View>
                                )
                            })

                        )
                    }
                </View> */}
            </View>
        );
    }
}
