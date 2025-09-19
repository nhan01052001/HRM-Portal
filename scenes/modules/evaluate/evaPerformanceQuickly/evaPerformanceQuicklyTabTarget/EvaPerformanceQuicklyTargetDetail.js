import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    styleProfileInfo,
    stylesModalPopupBottom,
    Colors,
    Size,
    stylesScreenDetailV3,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import Modal from 'react-native-modal';
// import VnrListEvaPerformanceQuicklyProfileDetail from '../../../../../VnrList/VnrListEvaPerformanceQuicklyProfileDetail/VnrListEvaPerformanceQuicklyProfileDetail';
import { IconColse } from '../../../../../constants/Icons';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
export default class EvaPerformanceQuicklyTargetDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            listTarget: null,
            dataRowTouch: null,
            listActions: this.resultListActionHeader(),
            fullDataItem: null
        };
    }

    resultListActionHeader = () => {
        const _params = this.props.navigation.state.params;
        if (_params && _params.listActions && Array.isArray(_params.listActions)) {
            return _params.listActions;
        }
        return [];
    };

    getDataItem = () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);
            if (dataItem && dataItem.listPerformanceQuicklyModel && dataItem.listPerformanceQuicklyModel[0]) {
                this.setState({
                    dataItem: dataItem.listPerformanceQuicklyModel[0],
                    listTarget: dataItem.listPerformanceQuicklyModel,
                    fullDataItem: dataItem
                });
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

    renderItemMoreDetail = (dataMore) => {
        return (
            <ScrollView contentContainerStyle={stylesModalPopupBottom.styleScrollVew}>
                <View style={styles.styViewMoreDetail}>
                    <View style={styleSheets.text}>
                        <VnrText style={[styleSheets.lable]} i18nKey={'DisplayKey'} />
                    </View>
                    <View style={styleSheets.viewControl}>
                        <VnrText style={[styleSheets.text]} value={dataMore.KPIName} />
                    </View>
                </View>
            </ScrollView>
        );
    };

    hideModalMore = () => {
        this.setState({ dataRowTouch: null });
    };

    render() {
        const { dataItem, listTarget, dataRowTouch, listActions, fullDataItem } = this.state,
            { itemContent, containerItemDetail, textLableInfo, bottomActions } = styleScreenDetail;

        let contentViewDetail = <VnrLoading size={'large'} />;

        if (dataItem && listTarget) {
            contentViewDetail = (
                <View style={[styleSheets.col_10]}>
                    <ScrollView>
                        {/* <View style={styles.viewUpdate}> */}
                        <View style={styleProfileInfo.styleViewTitleGroup}>
                            <VnrText
                                style={[styleSheets.text, styleProfileInfo.textLableGroup]}
                                i18nKey={'HRM_HR_GeneralInformation'}
                            />
                        </View>
                        <View style={containerItemDetail}>
                            <View style={itemContent}>
                                <View style={styleSheets.viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Tas_Task_Evaluationdate'}
                                    />
                                </View>
                                <View style={styleSheets.viewControl}>
                                    <Text numberOfLines={1} style={styleSheets.text}>
                                        {moment(dataItem.DateEvaluation).format('DD/MM/YYYY')}
                                    </Text>
                                </View>
                            </View>

                            {/* Giá trị  - */}
                            <View style={itemContent}>
                                <View style={styleSheets.viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'ValueFields'} />
                                </View>
                                <View style={styleSheets.viewControl}>
                                    <VnrText
                                        style={[styleSheets.text]}
                                        value={`${dataItem.MinimumRating} ~ ${dataItem.MaximumRating}`}
                                    />
                                </View>
                            </View>

                            {/* KPIName - Tên tiêu chí */}
                            <View style={itemContent}>
                                <View style={styleSheets.viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'KPIName'} />
                                </View>
                                <View style={styleSheets.viewControl}>
                                    <VnrText style={[styleSheets.text]} value={dataItem.KPIName} />
                                </View>
                            </View>

                            {/* TagetNumber - Chỉ tiêu */}
                            {(dataItem.Actual || dataItem.Target) && (
                                <View style={itemContent}>
                                    <View style={styleSheets.viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'TagetNumber'} />
                                    </View>
                                    <View style={styleSheets.viewControl}>
                                        <VnrText style={[styleSheets.text]} value={dataItem.Target} />
                                    </View>
                                </View>
                            )}

                            {/* Actual - Thực đạt */}
                            {(dataItem.Actual || dataItem.Target) && (
                                <View style={itemContent}>
                                    <View style={styleSheets.viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'ResultNumber'} />
                                    </View>
                                    <View style={styleSheets.viewControl}>
                                        <VnrText style={[styleSheets.text]} value={dataItem.Actual} />
                                    </View>
                                </View>
                            )}

                            {/* Điểm - Score*/}
                            {dataItem.Score && (
                                <View style={itemContent}>
                                    <View style={styleSheets.viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'TotalMark'} />
                                    </View>
                                    <View style={styleSheets.viewControl}>
                                        <VnrText style={[styleSheets.text]} value={dataItem.Score} />
                                    </View>
                                </View>
                            )}

                            {/* Times - Số lần*/}
                            {dataItem.Times && (
                                <View style={itemContent}>
                                    <View style={styleSheets.viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'FormOfCalculation__E_TIMES'}
                                        />
                                    </View>
                                    <View style={styleSheets.viewControl}>
                                        <VnrText style={[styleSheets.text]} value={dataItem.Times} />
                                    </View>
                                </View>
                            )}

                            {/* Ghi chu - Comment */}
                            <View style={itemContent}>
                                <View style={styleSheets.viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Sal_InsuranceSalry_Note'}
                                    />
                                </View>
                                <View style={styleSheets.viewControl}>
                                    <VnrText style={[styleSheets.text]} value={dataItem.Comment} />
                                </View>
                            </View>
                        </View>
                        <View style={styleProfileInfo.styleViewTitleGroup}>
                            <VnrText
                                style={[styleSheets.text, styleProfileInfo.textLableGroup]}
                                i18nKey={'HRM_Common_List_Profile'}
                            />
                        </View>
                        {/* <VnrListEvaPerformanceQuicklyProfileDetail
                            // rowTouch={

                            //     (data) => {
                            //         console.log(data)
                            //         this.setState({ dataRowTouch: data })
                            //     }
                            // }
                            dataLocal={listTarget}
                            valueField="ID"
                        /> */}

                        <Modal
                            onBackButtonPress={() => this.hideModalMore()}
                            key={'@MODAL_EDIT'}
                            isVisible={dataRowTouch}
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
                                    {dataRowTouch && this.renderItemMoreDetail(dataRowTouch)}
                                </SafeAreaView>
                            </View>
                        </Modal>
                    </ScrollView>
                    {Array.isArray(listActions) && listActions.length > 0 && (
                        <View style={bottomActions}>
                            <ListButtonMenuRight listActions={listActions} dataItem={fullDataItem} />
                        </View>
                    )}
                </View>
            );
        } else if (dataItem == 'EmptyData') {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styViewMoreDetail: {
        flexDirection: 'row',
        paddingVertical: styleSheets.p_10,
        paddingHorizontal: styleSheets.p_10,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.borderColor,
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});
