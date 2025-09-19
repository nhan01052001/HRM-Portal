import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../assets/configProject/ConfigListDetail';
import VnrText from '../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../utils/Vnr_Function';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
export default class LookupProfileViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null
        };
    }

    getDataItem = (isReload = false) => {
        try {
            const _params = this.props.navigation.state.params,
                { screenName, dataId, dataItem } = typeof _params === 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[screenName];

            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                HttpService.Post('[URI_HR]/Att_GetData/GetTamScanLogRegisterById', {
                    id: !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID,
                    screenName: screenName,
                    uri: dataVnrStorage.apiConfig.uriHr
                }).then((res) => {
                    if (!Vnr_Function.CheckIsNullOrEmpty(res)) {
                        this.setState({ configListDetail: _configListDetail, dataItem: res });
                    } else {
                        this.setState({ dataItem: 'EmptyData' });
                    }
                });
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                this.setState({ configListDetail: _configListDetail, dataItem });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    componentDidMount() {
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail } = this.state,
            { itemContent, containerItemDetail, textLableInfo } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={[styleSheets.col_10]}>
                    <ScrollView>
                        <View style={containerItemDetail}>
                            {configListDetail.map((e) => {
                                return (
                                    <View key={e.Label} style={itemContent}>
                                        <View style={styleSheets.viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={e.DisplayKey}
                                                value={e.DisplayKey}
                                            />
                                        </View>
                                        <View style={styleSheets.viewControl}>
                                            {Vnr_Function.formatStringType(dataItem, e)}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>
                </View>
            );
        } else if (dataItem === 'EmptyData') {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaView>
        );
    }
}
