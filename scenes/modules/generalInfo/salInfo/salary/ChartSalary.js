/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { styleSheets, Size, Colors } from '../../../../../constants/styleConfig';
import { PieChart } from 'react-native-svg-charts';
import { EnumName } from '../../../../../assets/constant';
import DrawerServices from '../../../../../utils/DrawerServices';

export default class ChartSalary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataChart: [],
            totalItemValue: null
        };
    }

    getTime = () => {
        return new Date();
    };

    renderItemChart = dataChart => {
        return dataChart.map((item, index) => {
            return (
                // eslint-disable-next-line react-native/no-inline-styles
                <View key={index} style={[styles.viewTextChartItem, { width: dataChart.length > 2 ? '50%' : '100%' }]}>
                    <Text
                        style={[
                            styleSheets.text,
                            styles.titleTakeHome,
                            {
                                color: item.chartColor ? item.chartColor : Colors.primary
                            }
                        ]}
                        numberOfLines={2}
                    >
                        {item['Name']}
                    </Text>
                    <Text style={[styleSheets.text, styles.numberTitle]} numberOfLines={1}>
                        {item['Value']}
                    </Text>
                </View>
            );
        });
    };

    handelDataChart = (dataSource, listGroup) => {
        let _totalItemValue = null;
        try {
            if (dataSource != EnumName.E_EMPTYDATA && dataSource.length > 0) {
                // eslint-disable-next-line no-unused-vars
                for (let Key in listGroup) {
                    if (Key == 'E_CHART') {
                        const listDateItemChart = [];
                        if (Array.isArray(listGroup[Key]['Mapping']) && listGroup[Key]['Mapping'].length > 0) {
                            listGroup[Key]['Mapping'].forEach(item => {
                                let index = dataSource.findIndex(value => value.Code === item.Key);
                                if (index != -1) {
                                    let dataItem = dataSource[index];
                                    if (dataItem.ValueType === 'Double') {
                                        let strinValue =
                                            typeof dataItem.Value == 'string'
                                                ? dataItem.Value.replace(/,/g, '')
                                                : dataItem.Value;
                                        dataItem.ValueForChart = parseFloat(strinValue);
                                    } else {
                                        dataItem.ValueForChart = 0;
                                    }

                                    if (item.chartColor) {
                                        dataItem.chartColor = item.chartColor;
                                    }
                                    //totalValue += dataItem.ValueForChart
                                    dataItem.svg = { fill: item.chartColor ? item.chartColor : Colors.green };
                                    if (item.IsTotalChart === true) {
                                        _totalItemValue = dataItem;
                                    } else {
                                        listDateItemChart.length < 4 && listDateItemChart.push(dataItem);
                                    }
                                }
                            });
                        }

                        this.setState({ dataChart: listDateItemChart, totalItemValue: _totalItemValue });
                        return true;
                    }
                }
            } else {
                this.setState({ dataChart: [], totalItemValue: null });
            }
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.isRefresh != this.props.isRefresh) {
            this.handelDataChart(nextProps.dataSource, nextProps.listGroup);
        }
    }

    componentDidMount() {
        const { dataSource, listGroup } = this.props;
        this.handelDataChart(dataSource, listGroup);
    }

    render() {
        const { dataChart, totalItemValue } = this.state;
        return (
            <View style={{}}>
                {dataChart.length > 0 ? (
                    <View style={styles.rowTopChart}>
                        <View style={styles.sizeChart}>
                            <PieChart
                                style={{ width: Size.deviceWidth * 0.24, height: Size.deviceWidth * 0.24 }}
                                valueAccessor={({ item }) => item.ValueForChart}
                                data={dataChart}
                                spacing={0}
                                outerRadius={'95%'}
                            />
                        </View>
                        <View
                            style={[
                                styles.styleViewItemChart,
                                { flexWrap: dataChart.length > 2 ? 'wrap' : 'nowrap' },
                                { flexDirection: dataChart.length > 2 ? 'row' : 'column' }
                            ]}
                        >
                            {this.renderItemChart(dataChart)}
                        </View>
                    </View>
                ) : (
                    <View />
                )}
                {totalItemValue != null && totalItemValue.Name && totalItemValue.Value && (
                    <View style={styles.viewTotalSal}>
                        <Text style={[styleSheets.text, styles.titleTotalSal]}>{`${totalItemValue.Name}`}</Text>
                        <Text
                            style={[
                                styleSheets.text,
                                styles.titleTotalSal,
                                {
                                    color: totalItemValue.chartColor ? totalItemValue.chartColor : Colors.primary
                                }
                            ]}
                            numberOfLines={2}
                        >
                            {`${totalItemValue.Value}`}
                        </Text>
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    rowTopChart: {
        flexDirection: 'row',
        paddingVertical: 15
    },

    titleTakeHome: {
        // textAlign:'center',
        fontSize: Size.text + 1,
        fontWeight: '600',
        marginBottom: 5
    },
    numberTitle: {
        fontSize: Size.text + 2,
        color: Colors.primary,
        fontWeight: '600',
        marginBottom: 15
    },
    viewTotalSal: {
        // paddingHorizontal : 20
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    titleTotalSal: {
        fontSize: Size.text + 2,
        color: Colors.primary,
        fontWeight: '600'
    },
    viewTextChartItem: {
        // width:'50%',
        // justifyContent:'center',
        // alignItems:'center'
    },
    styleViewItemChart: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    sizeChart: {
        width: Size.deviceWidth * 0.35,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
