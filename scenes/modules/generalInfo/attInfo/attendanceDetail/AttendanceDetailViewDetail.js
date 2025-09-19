import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleSafeAreaView, styleScreenDetail } from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';

export default class AttendanceDetailViewDetail extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            dataItem: this.props.navigation.state.params.dataItem
        };
    }
    render() {
        const { dataItem } = this.state,
            { screenName } = this.props.navigation.state.params,
            { itemContent, containerItemDetail, textLableInfo } = styleScreenDetail;
        let listConfig = ConfigListDetail && ConfigListDetail.value ? ConfigListDetail.value[screenName] : [];
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>
                    <View style={[styleSheets.col_10]}>
                        <ScrollView>
                            <View style={containerItemDetail}>
                                {listConfig.map((e) => {
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
                </View>
            </SafeAreaView>
        );
    }
}
