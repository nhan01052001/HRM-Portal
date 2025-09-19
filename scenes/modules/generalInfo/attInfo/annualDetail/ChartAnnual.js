import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import {
    styleSheets,
    Size,
    Colors,
    styleSafeAreaView,
    stylesModalPopupBottom,
    styleViewTitleForGroup,
    CustomStyleSheet,
    stylesScreenDetailV3
} from '../../../../../constants/styleConfig';
import { IconColse } from '../../../../../constants/Icons';
import { translate } from '../../../../../i18n/translate';
import { SafeAreaView } from 'react-navigation';
import Modal from 'react-native-modal';
import VnrText from '../../../../../components/VnrText/VnrText';
import { ScrollView } from 'react-native-gesture-handler';
import format from 'number-format.js';
import Vnr_Function from '../../../../../utils/Vnr_Function';
export default class ChartAnnual extends React.Component {
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
                            {
                                color: item.chartColor ? item.chartColor : Colors.primary
                            }
                        ]}
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
            { styleViewTitleGroup, textLableGroup } = styleViewTitleForGroup;

        return listConfigGeneral.map((item) => {
            if (item['Name'] == 'E_Group') {
                return (
                    <View style={styleViewTitleGroup}>
                        <VnrText style={[styleSheets.text, textLableGroup]} i18nKey={item['DisplayKey']} />
                    </View>
                );
            } else {
                let val = dataSource[item.Name];
                if (val && item.DataType && item.DataType.toLowerCase() == 'double') {
                    val = format(item.DataFormat, dataSource[item.Name]);
                }
                return (
                    <View style={styles.itemContent}>
                        <View style={styleSheets.text}>
                            <VnrText style={[styleSheets.text]} i18nKey={item['DisplayKey']} />
                        </View>
                        <View style={styleSheets.viewControl}>
                            <VnrText style={[styleSheets.lable, styles.colorTextWaiting]} value={val} />
                        </View>
                    </View>
                );
            }
        });
    };

    // handelDataChart = (dataSource) => {
    //     try {
    //         const dataChart = [
    //             {
    //                 Name: 'HRM_Attendance_AttendanceTable_RealWorkDayCount',
    //                 Value: dataSource['RealWorkDayCount'] ? dataSource['RealWorkDayCount'] : 0,
    //                 svg: { fill: Colors.green },
    //                 chartColor: Colors.green
    //             },
    //             {
    //                 Name: 'HRM_Common_PaidLeaveDays',
    //                 Value: dataSource['PaidLeaveDays'] ? dataSource['PaidLeaveDays'] : 0,
    //                 svg: { fill: Colors.warning },
    //                 chartColor: Colors.warning
    //             },
    //             {
    //                 Name: 'HRM_Common_UnPaidLeave',
    //                 Value: dataSource['UnPaidLeave'] ? dataSource['UnPaidLeave'] : 0,
    //                 svg: { fill: Colors.danger },
    //                 chartColor: Colors.danger
    //             },
    //         ]

    //         this.setState({ dataChart: dataChart });
    //     } catch (error) {
    //         console.log(error)
    //     }

    // }

    // UNSAFE_componentWillReceiveProps(nextProps) {
    //     if (nextProps.isRefresh != this.props.isRefresh) {
    //         this.handelDataChart(nextProps.dataSource, this.props.listConfigGeneral, this.props.listConfigMaster);
    //     }
    // }

    // componentDidMount() {
    //     const { dataSource, listConfigGeneral, listConfigMaster } = this.props;
    //     this.handelDataChart(dataSource, listConfigGeneral, listConfigMaster);
    // }

    hideModalMore = () => {
        this.setState({ isShowMore: false });
    };

    showModalMore = () => {
        this.setState({ isShowMore: true });
    };

    render() {
        const { listConfigGeneral, dataSource, listConfigMaster } = this.props;

        return (
            <View style={{}}>
                {dataSource && (
                    <View style={styles.colTopChart}>
                        {/* <View style={styles.rowTopChart}>
                                <View style={styles.sizeChart}>
                                    <PieChart
                                        style={{ width: Size.deviceWidth * 0.27, height: Size.deviceWidth * 0.27 }}
                                        valueAccessor={({ item }) => item.Value}
                                        data={dataChart}
                                        spacing={0}
                                        outerRadius={'95%'}
                                    >
                                    </PieChart>
                                </View>
                                <View
                                    style={[
                                        styles.styleViewItemChart,
                                    ]}>
                                    {this.renderItemChart(dataChart)}
                                </View>
                            </View> */}
                        <View style={styles.viewMoreDetail}>
                            {this.renderItemMaster(listConfigMaster)}
                            {Array.isArray(listConfigGeneral) && listConfigGeneral.length > 0 && (
                                <TouchableOpacity style={styles.viewMoreRight} onPress={this.showModalMore}>
                                    <Text style={[styleSheets.text, styles.styleShowMore]}>
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
                                        <VnrText style={styleSheets.lable} i18nKey={'HRM_HR_GeneralInformation'} />
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

    viewTextDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5
    },

    viewMoreDetail: {
        minHeight: 10,
        // borderTopColor: Colors.borderColor,
        // borderTopWidth: 1,
        // paddingTop: 10,
        paddingLeft: 10
        // marginTop: 10,
    },

    styleShowMore: {
        color: Colors.primary,
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        textDecorationColor: Colors.primary,
        paddingBottom: 2
    },
    viewMoreRight: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingRight: 20
    },

    colorTextWaiting: {
        color: Colors.primary
    },

    itemContent: {
        flexDirection: 'row',
        paddingVertical: styleSheets.p_10,
        paddingHorizontal: styleSheets.p_10,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.borderColor,
        justifyContent: 'space-between',
        alignItems: 'center'
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
        width: '100%'
    }
});
