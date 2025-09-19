import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import {
    styleSheets,
    Size,
    Colors,
    styleSafeAreaView,
    stylesModalPopupBottom,
    styleScreenDetail,
    CustomStyleSheet,
    stylesScreenDetailV3
} from '../../../../../constants/styleConfig';
import { IconColse } from '../../../../../constants/Icons';
import { PieChart } from 'react-native-svg-charts';
import { translate } from '../../../../../i18n/translate';
import { SafeAreaView } from 'react-navigation';
import Modal from 'react-native-modal';
import VnrText from '../../../../../components/VnrText/VnrText';
import { ScrollView } from 'react-native-gesture-handler';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import DrawerServices from '../../../../../utils/DrawerServices';

export default class ChartAttendance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataChart: [],
            dataDetail: [],
            totalItemValue: 0,
            isShowMore: false
        };
    }

    getTime = () => {
        return new Date();
    };

    renderItemChart = (dataChart) => {
        return dataChart.map((item, index) => {
            return (
                <View key={index} style={styles.viewTextChartItem}>
                    <VnrText
                        style={[
                            styleSheets.text,
                            styles.titleTakeHome,
                            // eslint-disable-next-line react-native/no-inline-styles
                            {
                                color: item.chartColor ? item.chartColor : Colors.primary,
                                maxWidth: '84%'
                            }]}
                        numberOfLines={2}
                        i18nKey={item['Name']}
                    />
                    <Text style={[styleSheets.text, styles.numberTitle]} numberOfLines={1}>
                        {Vnr_Function.mathRoundNumber(item['Value'])}
                    </Text>
                </View>
            );
        });
    };

    renderItemMaster = (listConfigMaster) => {
        const { dataSource } = this.props;
        return listConfigMaster.map((item, index) => {
            let val = dataSource[item.Name];
            if (val) {
                val = Vnr_Function.mathRoundNumber(val);
            }
            return (
                <View key={index} style={styles.viewTextDetailItem}>
                    <VnrText
                        style={[styleSheets.text, CustomStyleSheet.marginRight(15)]}
                        numberOfLines={2}
                        i18nKey={item['DisplayKey']}
                    />
                    <Text style={styleSheets.lable} numberOfLines={1}>
                        {val}
                    </Text>
                </View>
            );
        });
    };

    renderItemMoreDetail = (listConfigGeneral) => {
        const { dataSource } = this.props,
            { containerItemDetail } = styleScreenDetail;

        return (
            <View style={containerItemDetail}>
                {listConfigGeneral.map((item) => {
                    if (item.DisplayKey !== null) {
                        return Vnr_Function.formatStringTypeV2(dataSource, item);
                    } else {
                        return <View />;
                    }
                })}
            </View>
        );
    };

    handelDataChart = (dataSource) => {
        try {
            // nhan.nguyen: 0179528: [Hotfix_ KOG_v8.11. 21.01.10.174 ]: Hiển thị field “Tổng ngày công hưởng lương” và ẩn field “Công thực tế” trên app
            if (
                !Array.isArray(ConfigList.value['ChartAttendance']) ||
                ConfigList.value['ChartAttendance'].length === 0
            ) {
                this.setState({ dataChart: [] });
                return;
            }

            const dataChart = ConfigList.value['ChartAttendance'].map((item) => {
                return {
                    ...item,
                    Value: dataSource[item.Value] ? dataSource[item.Value] : 0
                };
            });
            this.setState({ dataChart: dataChart });
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.isRefresh != this.props.isRefresh) {
            this.handelDataChart(nextProps.dataSource, this.props.listConfigGeneral, this.props.listConfigMaster);
        }
    }

    componentDidMount() {
        const { dataSource, listConfigGeneral, listConfigMaster } = this.props;
        this.handelDataChart(dataSource, listConfigGeneral, listConfigMaster);
    }

    hideModalMore = () => {
        this.setState({ isShowMore: false });
    };

    showModalMore = () => {
        this.setState({ isShowMore: true });
    };

    render() {
        const { dataChart } = this.state,
            { listConfigGeneral, listConfigMaster } = this.props;

        return (
            <View style={{}}>
                {dataChart.length > 0 && (
                    <View style={styles.colTopChart}>
                        <View style={styles.rowTopChart}>
                            <View style={styles.sizeChart}>
                                <PieChart
                                    style={{ width: Size.deviceWidth * 0.27, height: Size.deviceWidth * 0.27 }}
                                    valueAccessor={({ item }) => item.Value}
                                    data={dataChart}
                                    spacing={0}
                                    outerRadius={'95%'}
                                />
                            </View>
                            <View style={[styles.styleViewItemChart]}>{this.renderItemChart(dataChart)}</View>
                        </View>
                        <View style={styles.viewMoreDetail}>
                            {this.renderItemMaster(listConfigMaster)}
                            {Array.isArray(listConfigGeneral) && listConfigGeneral.length > 0 && (
                                <TouchableOpacity style={styles.viewMoreRight} onPress={this.showModalMore}>
                                    <Text style={[styleSheets.text, styles.styleShowMore, {}]}>
                                        {`${translate('HRM_Common_Showmore')}`}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <Modal
                            onBackButtonPress={() => this.hideModalMore()}
                            key={'@MODAL_EDIT'}
                            isVisible={this.state.isShowMore}
                            onBackdropPress={() => this.hideModalMore()}
                            customBackdrop={
                                <TouchableWithoutFeedback onPress={() => this.hideModalMore()}>
                                    <View style={stylesScreenDetailV3.modalBackdrop} />
                                </TouchableWithoutFeedback>
                            }
                            style={CustomStyleSheet.margin(0)}
                        >
                            <View style={stylesModalPopupBottom.viewModal}>
                                <SafeAreaView {...styleSafeAreaView} style={[stylesModalPopupBottom.safeRadius]}>
                                    <View style={stylesModalPopupBottom.headerCloseModal}>
                                        <TouchableOpacity onPress={() => this.hideModalMore()}>
                                            <IconColse color={Colors.grey} size={Size.iconSize} />
                                        </TouchableOpacity>
                                        <VnrText style={styleSheets.lable} i18nKey={'HRM_Attendance_General'} />
                                        <IconColse color={Colors.white} size={Size.iconSize} />
                                    </View>
                                    <ScrollView contentContainerStyle={stylesModalPopupBottom.styleScrollVew}>
                                        {this.renderItemMoreDetail(listConfigGeneral)}
                                    </ScrollView>
                                </SafeAreaView>
                            </View>
                        </Modal>
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    colTopChart: {
        marginVertical: 10
    },
    rowTopChart: {
        flexDirection: 'row'
    },

    viewTextDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5
    },

    viewMoreDetail: {
        minHeight: 10,
        borderTopColor: Colors.borderColor,
        borderTopWidth: 1,
        paddingTop: 10,
        paddingLeft: 10,
        marginTop: 10
    },

    styleShowMore: {
        color: Colors.primary,
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        textDecorationColor: Colors.primary
    },
    viewMoreRight: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingRight: 20
    },
    titleTakeHome: {
        fontSize: Size.text,
        fontWeight: '600',
        marginBottom: 5
    },

    numberTitle: {
        fontSize: Size.text + 2,
        color: Colors.primary,
        fontWeight: '600',
        marginBottom: 10
    },
    viewTextChartItem: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },

    styleViewItemChart: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    sizeChart: {
        width: Size.deviceWidth * 0.4,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
