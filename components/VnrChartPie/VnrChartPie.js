import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { styleSheets, Size, Colors } from '../../constants/styleConfig';
import VnrLoading from '../VnrLoading/VnrLoading';
import HttpService from '../../utils/HttpService';
import { VictoryPie } from 'victory-native';
import EmptyData from '../EmptyData/EmptyData';
import { EnumName } from '../../assets/constant';
import Vnr_Function from '../../utils/Vnr_Function';
import { ConfigChart } from '../../assets/configProject/ConfigChart';

export default class VnrChartPie extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: null,
            totalData: 0
        };
    }

    getDataChart = () => {
        if (ConfigChart.value !== null) {
            const { api, groupFeild } = this.props;

            HttpService.Post(api.url, api.data)
                .then(res => {
                    if (res && res.Data && Array.isArray(res.Data) && res.Data.length > 0) {
                        const total = res.Total;
                        const handelData = res.Data.reduce((acc, currentValue) => {
                            let item = acc[currentValue[groupFeild]];
                            if (item && item['y']) {
                                item['y'] = item['y'] + 1;
                            } else {
                                acc[currentValue[groupFeild]] = {
                                    y: 1,
                                    x: currentValue[groupFeild],
                                    isDisplay: true
                                };
                            }
                            return acc;
                        }, {});

                        Object.keys(handelData).forEach((key, index) => {
                            handelData[key].color = this.colorChart()[index];
                        });

                        this.setState({
                            isLoading: false,
                            dataSource: handelData,
                            totalData: total
                        });
                    } else {
                        this.setState({
                            isLoading: false,
                            dataSource: EnumName.E_EMPTYDATA
                        });
                    }
                })
        } else {
            this.setState({
                isLoading: false,
                dataSource: EnumName.E_EMPTYDATA
            });
        }
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
        const { dataSource } = this.state;
        let total = 0,
            countDisplay = 0;
        dataSource[key]['isDisplay'] = !dataSource[key]['isDisplay'];
        Object.keys(dataSource).forEach(key => {
            if (dataSource[key]['isDisplay']) {
                countDisplay += 1;
                total += dataSource[key]['y'];
            }
        });

        if (countDisplay < 1) {
            dataSource[key]['isDisplay'] = true;
            return;
        }

        this.setState({ dataSource, totalData: total });
        // console.log(key, index)
    };

    renderType = () => {
        const { dataSource } = this.state,
            listType = Object.keys(dataSource);
        return listType.map((key, index) => {
            const { color, isDisplay } = dataSource[key];
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

    render() {
        const { isLoading, dataSource, totalData } = this.state,
            { widthChart } = this.props;
        let contentChart = <View />;
        if (isLoading) {
            contentChart = <VnrLoading size="large" isVisible={isLoading} />;
        } else if (dataSource == EnumName.E_EMPTYDATA || Object.keys(dataSource).length == 0) {
            contentChart = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataSource && Object.keys(dataSource).length > 0) {
            const listType = Object.keys(dataSource).filter(key => dataSource[key]['isDisplay']);
            contentChart = (
                <View style={styles.container}>
                    <VictoryPie
                        width={widthChart ? widthChart : WIDTH_CHART}
                        colorScale={listType.map(key => {
                            return dataSource[key]['color'];
                        })}
                        categories={{ x: listType }}
                        data={listType.map(key => {
                            return dataSource[key];
                        })}
                        animate={{
                            duration: 500
                        }}
                        labels={({ datum }) => {
                            if (dataSource[datum.x]) {
                                const { y } = dataSource[datum.x];
                                return [`${Vnr_Function.mathRoundNumber((y * 100) / totalData)}%`, y];
                            }
                        }}
                        style={{
                            labels: {
                                fontSize: Size.text - 1,
                                fill: ({ datum }) => {
                                    return dataSource[datum.x] ? dataSource[datum.x].color : Colors.black;
                                },
                                fontFamily: styleSheets.text.fontFamily
                            }
                        }}
                        labelPosition={({ index }) => (index ? 'centroid' : 'startAngle')}
                        labelPlacement={'perpendicular'}
                    />
                    <View style={styles.styViewType}>{this.renderType()}</View>
                </View>
            );
        }

        return contentChart;
    }
}

const WIDTH_CHART = Size.deviceWidth * 0.8;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 30
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
    }
});
