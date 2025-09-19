import React, { Component } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import VnrText from '../../../../../components/VnrText/VnrText';
import { styleSheets, Colors, Size, CustomStyleSheet } from '../../../../../constants/styleConfig';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import { translate } from '../../../../../i18n/translate';
export default class PartyUnionComponent extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            isLoading: true,
            dataSource: null
        };
    }

    getData = () => {
        HttpService.Get('[URI_HR]/Hre_GetDataV2/GetProfilePartyUnionByProfileForApp', null, this.getData).then(res => {
            if (res && Object.keys(res).length > 0) {
                this.setState({
                    dataSource: res,
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
            { styles } = this.props;
        return (
            <View style={styles.styBlock}>
                <View style={styles.styTopTitle}>
                    <View style={styles.styWrap}>
                        <VnrText style={[styleSheets.lable, styles.styTitle]} i18nKey={'HRM_PartyUnion'} />
                    </View>
                    {isLoading ? (
                        <ActivityIndicator size={'small'} color={Colors.primary} />
                    ) : (
                        <TouchableOpacity
                            onPress={() =>
                                DrawerServices.navigate('PartyUnionViewDetail', {
                                    dataItem: dataSource,
                                    screenName: 'PartyUnionViewDetail'
                                })
                            }
                            style={styles.styWrapRight}
                        >
                            <VnrText style={[styleSheets.text, styles.styTextDetail]} i18nKey={'HRM_Common_ViewMore'} />
                        </TouchableOpacity>
                    )}
                </View>

                {dataSource &&
                    (dataSource.IsCommunistPartyMember || dataSource.IsYouthUnionist || dataSource.IsTradeUnionist) && (
                    <View style={[styles.styViewData, CustomStyleSheet.paddingLeft(0)]}>
                        {dataSource && dataSource.IsCommunistPartyMember && (
                            <View
                                style={[
                                    styles.styViewCount,
                                    {
                                        ...CustomStyleSheet.marginLeft(0),
                                        ...CustomStyleSheet.marginRight(Size.defineHalfSpace),
                                        ...CustomStyleSheet.marginBottom(Size.defineHalfSpace)
                                    }
                                ]}
                            >
                                <Text style={[styleSheets.text, styles.styCountText]}>
                                    {` ${translate('HRM_HR_ProfilePartyUnion_IsCommunistPartyMember')}`}
                                </Text>
                            </View>
                        )}

                        {dataSource && dataSource.IsYouthUnionist && (
                            <View
                                style={[
                                    styles.styViewCount,
                                    {
                                        ...CustomStyleSheet.marginLeft(0),
                                        ...CustomStyleSheet.marginRight(Size.defineHalfSpace),
                                        ...CustomStyleSheet.marginBottom(Size.defineHalfSpace)
                                    }
                                ]}
                            >
                                <Text style={[styleSheets.text, styles.styCountText]}>
                                    {` ${translate('HRM_HR_ProfilePartyUnion_IsYouthUnionist')}`}
                                </Text>
                            </View>
                        )}

                        {dataSource && dataSource.IsTradeUnionist && (
                            <View
                                style={[
                                    styles.styViewCount,
                                    {
                                        ...CustomStyleSheet.marginLeft(0),
                                        ...CustomStyleSheet.marginRight(Size.defineHalfSpace),
                                        ...CustomStyleSheet.marginBottom(Size.defineHalfSpace)
                                    }
                                ]}
                            >
                                <Text style={[styleSheets.text, styles.styCountText]}>
                                    {` ${translate('HRM_HR_ProfilePartyUnion_IsTradeUnionist')}`}
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        );
    }
}
