import React, { Component } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, Text } from 'react-native';
import { styleSheets, Size, Colors } from '../../constants/styleConfig';
import { VnrLoadingSevices } from '../VnrLoading/VnrLoadingPages';
import VnrLoading from '../VnrLoading/VnrLoading';
import HttpService from '../../utils/HttpService';
import { VictoryChart, VictoryGroup, VictoryBar, VictoryStack, VictoryTheme } from 'victory-native';
import EmptyData from '../EmptyData/EmptyData';
import { EnumName } from '../../assets/constant';
import Vnr_Function from '../../utils/Vnr_Function';

export default class VnrChartGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: null,
            listStatus: null,
            listCategory: null,
            listCategoryShortName: {}
        };
    }

    setShortName = text => {
        if (!text) return '';
        if (text.split('').length <= 15) {
            return text;
        } else {
            let lengthText = 6,
                arrIN = text.split(''),
                arrOut = [arrIN[0]];

            arrIN.forEach((e, index) => {
                e === ' ' && arrOut.length <= lengthText && arrOut.push(arrIN[index + 1]);
            });

            if (arrOut.length > 0) {
                let result = arrOut.join('').toUpperCase();
                return result;
            } else {
                return text.substring(0, lengthText);
            }
        }
    };

    getDataChart = () => {
        const { api, groupFeild, categoryFeild } = this.props;
        HttpService.Post(api.url, api.data).then(res => {
            VnrLoadingSevices.hide();

            if (res && res.Data && Array.isArray(res.Data) && res.Data.length > 0) {
                const listCategory = {};
                const listCategoryShortName = {};
                const handelData = res.Data.reduce((acc, currentValue) => {
                    let item = acc[currentValue[categoryFeild]];
                    if (listCategory[currentValue[groupFeild]]) {
                        listCategory[currentValue[groupFeild]] += 1;
                    } else {
                        listCategory[currentValue[groupFeild]] = 1;
                    }

                    if (item) {
                        if (item[currentValue[groupFeild]]) {
                            item[currentValue[groupFeild]]['y'] = item[currentValue[groupFeild]]['y'] + 1;
                        } else {
                            let getShortName = this.setShortName(currentValue[groupFeild]);
                            if (!listCategoryShortName[currentValue[groupFeild]])
                                listCategoryShortName[currentValue[groupFeild]] = getShortName;
                            item[currentValue[groupFeild]] = {
                                y: 1,
                                x: getShortName
                            };
                        }
                    } else {
                        let getShortName = this.setShortName(currentValue[groupFeild]);
                        if (!listCategoryShortName[currentValue[groupFeild]])
                            listCategoryShortName[currentValue[groupFeild]] = getShortName;
                        acc[currentValue[categoryFeild]] = {
                            [currentValue[groupFeild]]: {
                                y: 1,
                                x: getShortName
                            }
                        };
                    }
                    return acc;
                }, {});
                const listKeysGroup = {};
                Object.keys(handelData).forEach((key, index) => {
                    listKeysGroup[key] = {
                        isDisplay: true,
                        color: this.colorChart()[index]
                    };
                });

                this.setState({
                    dataSource: handelData,
                    listStatus: listKeysGroup,
                    listCategory: listCategory,
                    isLoading: false,
                    listCategoryShortName: listCategoryShortName
                });
            } else {
                this.setState({
                    isLoading: false,
                    dataSource: EnumName.E_EMPTYDATA
                });
            }
        });
    };

    componentDidMount() {
        this.getDataChart();
    }

    colorChart = () => {
        const themeColor = [
            Colors.neutralGreen_6,
            Colors.orange_6,
            Colors.navy_6,
            Colors.red_6,
            Colors.blue_6,
            Colors.purple_6,

            Colors.neutralGreen_5,
            Colors.orange_5,
            Colors.navy_5,
            Colors.red_5,
            Colors.blue_5,
            Colors.purple_5,

            Colors.neutralGreen_3,
            Colors.orange_3,
            Colors.navy_3,
            Colors.red_3,
            Colors.blue_3,
            Colors.purple_3
        ];
        return themeColor;
    };

    filterType = (key) => () => {
        let { listStatus } = this.state;
        let countDisplay = 0;

        listStatus[key]['isDisplay'] = !listStatus[key]['isDisplay'];

        Object.keys(listStatus).forEach(key => {
            if (listStatus[key]['isDisplay']) {
                countDisplay += 1;
            }
        });

        if (countDisplay < 1) {
            listStatus[key]['isDisplay'] = true;
            return;
        }

        this.setState({ listStatus: listStatus });
    };

    renderType = () => {
        const { listStatus } = this.state,
            listType = Object.keys(listStatus);
        return listType.map((key, index) => {
            const { color, isDisplay } = listStatus[key];
            return (
                <TouchableOpacity key={index} onPress={this.filterType(key, index)} style={[styles.styTypeItem]}>
                    <View
                        style={[
                            styles.styTypeDot,
                            {
                                backgroundColor: isDisplay ? color : Colors.gray_7
                            }
                        ]}
                    />
                    <Text
                        style={[
                            styleSheets.text,
                            styles.styTypeText,
                            {
                                color: isDisplay ? Colors.black : Colors.gray_7
                            }
                        ]}
                    >
                        {key}
                    </Text>
                </TouchableOpacity>
            );
        });
    };

    renderDetail = () => {
        const { dataSource, listStatus, listCategory, listCategoryShortName } = this.state;
        const listType = Object.keys(dataSource).filter(key => listStatus[key]['isDisplay']);
        return Object.keys(listCategory).map((key, index) => {
            return (
                <View style={styles.styItem} key={index}>
                    <View style={styles.srtTitleGroup}>
                        <Text style={[styleSheets.lable, styles.styTitle]}>{`${key} (${
                            listCategoryShortName[key]
                        })`}</Text>
                        <Text style={[styleSheets.lable, styles.styTitle]}>{listCategory[key]}</Text>
                    </View>
                    <View style={styles.styGroup}>
                        {listType.map((keyGroup) => {
                            const item = dataSource[keyGroup],
                                { color, isDisplay } = listStatus[keyGroup];
                            if (item[key]) {
                                let persenItem = Vnr_Function.mathRoundNumber(
                                    (item[key]['y'] * 100) / listCategory[key]
                                );
                                return (
                                    <View style={styles.styItemGroup}>
                                        <View style={[styles.styGroupLable]}>
                                            <View
                                                style={[
                                                    styles.styGroupDot,
                                                    {
                                                        backgroundColor: isDisplay ? color : Colors.gray_7
                                                    }
                                                ]}
                                            />
                                            <Text
                                                style={[
                                                    styleSheets.text,
                                                    styles.styTextGroupLable,
                                                    {
                                                        color: isDisplay ? Colors.black : Colors.gray_7
                                                    }
                                                ]}
                                            >
                                                {keyGroup}
                                            </Text>
                                        </View>

                                        <Text style={[styleSheets.text, styles.styTextGroupLable]}>
                                            {`${item[key]['y']} ⇔ ${persenItem}%`}
                                        </Text>
                                    </View>
                                );
                            } else {
                                return <View />;
                            }
                        })}
                    </View>
                </View>
            );
        });
    };

    render() {
        const { isLoading, dataSource, listStatus } = this.state;
        let contentChart = <View />;
        if (isLoading) {
            contentChart = <VnrLoading size="large" isVisible={isLoading} />;
        } else if (dataSource == EnumName.E_EMPTYDATA || dataSource.length == 0) {
            contentChart = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataSource && typeof dataSource === 'object') {
            const listType = Object.keys(dataSource).filter(key => listStatus[key]['isDisplay']);
            contentChart = (
                <View style={styles.container}>
                    <VictoryChart
                        height={HEIGHT_CHART}
                        theme={VictoryTheme.material}
                        width={Size.deviceWidth}
                        padding={{
                            top: 50,
                            left: 100,
                            right: 50,
                            bottom: 50
                        }}
                    >
                        <VictoryGroup offset={5}>
                            <VictoryStack
                                colorScale={listType.map(key => {
                                    return listStatus[key]['color'];
                                })}
                                horizontal
                            >
                                {listType.map((key, i) => {
                                    let item = dataSource[key],
                                        toa = Object.values(item);
                                    toa.sort((a, b) => {
                                        return a.x.localeCompare(b.x);
                                    });

                                    return <VictoryBar key={i} alignment="start" data={[...toa]} barWidth={Size.text} />;
                                })}
                            </VictoryStack>
                        </VictoryGroup>
                    </VictoryChart>

                    <View style={styles.styViewType}>{this.renderType()}</View>

                    <ScrollView contentContainerStyle={styles.styScroll}>{this.renderDetail()}</ScrollView>
                </View>
            );
        }

        return contentChart;
    }
}

const HEIGHT_CHART = Size.deviceWidth * 0.7;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    styViewType: {
        flexDirection: 'row',
        width: Size.deviceWidth,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingHorizontal: Size.defineSpace * 2
    },
    styTypeItem: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginLeft: 20
    },
    styTypeDot: {
        width: Size.text,
        height: Size.text,
        borderRadius: Size.text,
        marginRight: 3
    },
    styTypeText: {
        fontSize: Size.text - 3
    },

    styScroll: {
        marginTop: Size.defineSpace,
        width: Size.deviceWidth,
        paddingHorizontal: Size.defineSpace,
        paddingBottom: 20
    },

    // item styles
    styItem: {
        width: '100%'
    },
    srtTitleGroup: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 8,
        backgroundColor: Colors.gray_3,
        justifyContent: 'space-between',
        borderRadius: 7,
        marginTop: -0.5
    },
    styTitle: {
        fontSize: Size.text + 1,
        fontWeight: '500'
    },
    styItemGroup: {
        flexDirection: 'row',
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        justifyContent: 'space-between',
        paddingVertical: Size.defineSpace * 0.7,
        marginHorizontal: Size.defineSpace
    },
    styGroupLable: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    styGroupDot: {
        width: Size.text - 5,
        height: Size.text - 5,
        borderRadius: (Size.text - 5) / 2,
        marginRight: 5
    },
    styTextGroupLable: {
        fontSize: Size.text - 2,
        color: Colors.gray_8
    }
});
