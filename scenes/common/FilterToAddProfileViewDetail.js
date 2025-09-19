/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleSafeAreaView } from '../../constants/styleConfig';
import { config } from '../../assets/config';
import VnrText from '../../components/VnrText/VnrText';
import moment from 'moment';
import format from 'number-format.js';

export default class FilterToAddProfileViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: this.props.navigation.state.params.dataItem
        };
    }

    formatStringType = (data, col) => {
        if (data[col.Name]) {
            if (col.DataType && col.DataType.toLowerCase() == 'datetime') {
                return moment(data[col.Name]).format(col.DataFormat);
            }
            if (col.DataType && col.DataType.toLowerCase() == 'double') {
                return format(col.DataFormat, data[col.Name]);
            } else {
                return data[col.Name];
            }
        } else {
            return '';
        }
    };

    render() {
        const { dataItem } = this.state;
        const { screenName } = this.props.navigation.state.params;
        const listConfig = config['ConfigList'].find(item => item.ScreenName === screenName);
        return listConfig != undefined && dataItem != null ? (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>
                    <View style={[styleSheets.col_10]}>
                        <ScrollView>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    paddingHorizontal: styleSheets.p_10
                                }}
                            >
                                {listConfig.ScreenDetailField.map(e => {
                                    return (
                                        <View
                                            key={e.Label}
                                            style={{
                                                flexDirection: 'column',
                                                marginVertical: styleSheets.m_10
                                            }}
                                        >
                                            <View style={styleSheets.viewLable}>
                                                <VnrText
                                                    style={styleSheets.lable}
                                                    i18nKey={e.DisplayKey}
                                                    value={e.DisplayKey}
                                                />
                                            </View>
                                            <View style={styleSheets.viewControl}>
                                                <Text style={styleSheets.text}>
                                                    {this.formatStringType(dataItem, e)}
                                                </Text>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        ) : null;
    }
}
