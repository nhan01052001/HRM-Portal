import React, { Component } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import VnrText from '../../../../../components/VnrText/VnrText';
import { styleSheets, Colors, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import moment from 'moment';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
export default class WorkingExperienceComponent extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            isLoading: false,
            dataSource: null
        };
    }

    getData = () => {
        const screenName = ScreenName.WorkingExperienceConfirmed,
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

        HttpService.Post('[URI_HR]/Hre_GetData/GetListWorkingExperienceByProfileID', dataBody, null, this.getData).then(
            res => {
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
                            i18nKey={'Hrm_Hre_WorkingExperience'}
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
                        <TouchableOpacity onPress={() => DrawerServices.navigate('TopTabWorkingExperienceInfo')}>
                            <VnrText style={[styleSheets.text, styles.styTextDetail]} i18nKey={'HRM_Common_ViewMore'} />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.styViewData}>
                    {dataSource && (
                        <View style={[styles.styViewData, CustomStyleSheet.marginTop(0)]}>
                            {initLableValue(
                                {
                                    DateTimeEx:
                                        dataSource.DateStart && dataSource.DateFinish
                                            ? `${moment(dataSource.DateStart).format('DD/MM/YYYY')} - ${moment(
                                                dataSource.DateFinish
                                            ).format('DD/MM/YYYY')}`
                                            : null
                                },
                                {
                                    Name: 'DateTimeEx',
                                    DisplayKey: 'HRM_Sys_TimeRange',
                                    DataType: 'string'
                                }
                            )}

                            {initLableValue(dataSource, {
                                Name: 'CompanyName',
                                DisplayKey: 'CompanyName',
                                DataType: 'string'
                            })}
                        </View>
                    )}
                </View>
            </View>
        );
    }
}
