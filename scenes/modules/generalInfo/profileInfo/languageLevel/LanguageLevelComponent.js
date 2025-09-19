import React, { Component } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import VnrText from '../../../../../components/VnrText/VnrText';
import { styleSheets, Colors, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';

export default class LanguageLevelComponent extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            isLoading: false,
            dataSource: null
        };
    }

    getData = () => {
        const screenName = ScreenName.LanguageLevelConfirmed,
            configList = ConfigList.value,
            _configList = configList[screenName],
            orderBy = _configList[EnumName.E_Order];

        const dataBody = {
            profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null,
            IsPortal: true,
            page: 1,
            pageSize: 20,
            sort: orderBy
        };

        HttpService.Post(
            '[URI_HR]/Hre_GetData/GetListProfileLanguageLevelByProfileID',
            dataBody,
            null,
            this.getData
        ).then(res => {
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

    render() {
        const { isLoading, dataSource } = this.state,
            { styles, initLableValue } = this.props;
        return (
            <View style={styles.styBlock}>
                <View style={styles.styTopTitle}>
                    <View style={styles.styWrap}>
                        <VnrText
                            style={[styleSheets.lable, styles.styTitle]}
                            i18nKey={'HRM_Rec_Candidate_LanguageLevel'}
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
                        <TouchableOpacity onPress={() => DrawerServices.navigate('TopTabLanguageLevelInfo')}>
                            <VnrText style={[styleSheets.text, styles.styTextDetail]} i18nKey={'HRM_Common_ViewMore'} />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.styViewData}>
                    {dataSource != null && (
                        <View style={[styles.styViewData, CustomStyleSheet.marginTop(0)]}>
                            {initLableValue(dataSource, {
                                Name: 'LanguageType',
                                DisplayKey: 'HRM_HR_Language_SpecialTypeID',
                                DataType: 'string'
                            })}
                            {initLableValue(dataSource, {
                                Name: 'RatingOrScore',
                                DisplayKey: 'RatingOrScore',
                                DataType: 'string'
                            })}
                        </View>
                    )}
                </View>
            </View>
        );
    }
}
