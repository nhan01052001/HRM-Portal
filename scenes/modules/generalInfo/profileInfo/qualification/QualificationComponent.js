import React, { Component } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import VnrText from '../../../../../components/VnrText/VnrText';
import { styleSheets, Colors } from '../../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';

export default class QualificationComponent extends Component {
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

        HttpService.Post('[URI_HR]/Hre_GetData/GetQualificationID', dataBody, null, this.getData).then(res => {
            if (res && res.Data && Array.isArray(res.Data) && res.Data.length > 0) {
                this.setState({
                    dataSource: res.Data,
                    isLoading: false,
                    length: res.Data.length
                });
            } else {
                this.setState({
                    isLoading: false,
                    length: 0
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
                            i18nKey={'HRM_HR_Qualification_QualificationName'}
                            numberOfLines={1}
                        />

                        {length > 0 && (
                            <View style={styles.styViewCount}>
                                <Text style={[styleSheets.text, styles.styCountText]}>{`+${length}`}</Text>
                            </View>
                        )}
                    </View>
                    {isLoading ? (
                        <ActivityIndicator size={'small'} color={Colors.primary} />
                    ) : (
                        <TouchableOpacity
                            onPress={() => DrawerServices.navigate('TopTabQualificationInfo')}
                            style={styles.styWrapRight}
                        >
                            <VnrText style={[styleSheets.text, styles.styTextDetail]} i18nKey={'HRM_Common_ViewMore'} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* </View> */}
                {/* <View style={styles.styViewData}>
                    {
                        (dataSource && dataSource.length > 0) && (
                            dataSource.map((item, index) => {
                                return (
                                    <View style={[styles.styViewData, { marginTop: 0 }]}>
                                        {initLableValue(
                                            item, {
                                            Name: "DependantName",
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
