import React, { Component } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleSafeAreaView,
    Size,
    Colors,
    stylesScreenDetailV2,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import moment from 'moment';
import { translate } from '../../../../../i18n/translate';

export default class SalSubmitPaymentCostRegisterMoreViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            keyType: ''
        };

        const _params = props.navigation.state.params,
            { keyType } = typeof _params == 'object' ? _params : JSON.parse(_params);

        if (keyType) {
            props.navigation.setParams({
                title: keyType
            });
        }
    }

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataItem, keyType } = typeof _params == 'object' ? _params : JSON.parse(_params);

            this.setState({
                dataItem: dataItem,
                keyType: keyType
            });
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    componentDidMount() {
        this.getDataItem();
    }

    initLableValue = (item) => {
        const { styViewValue, viewLable, styTextValueInfo } = stylesScreenDetailV2;
        let styTextValue = { ...styleSheets.text, ...styTextValueInfo },
            styTextLable = {
                ...styleSheets.lable,
                ...{ textAlign: 'left', fontSize: Size.text + 1, fontWeight: '700' }
            };

        let dateStart = item.FromDate ? item.FromDate : null,
            dateEnd = item.ToDate ? item.ToDate : null,
            timeCouse = '';

        let dmyStart = moment(dateStart).format('DD/MM/YYYY'),
            dmyEnd = moment(dateEnd).format('DD/MM/YYYY'),
            myStart = moment(dateStart).format('MM/YYYY'),
            myEnd = moment(dateEnd).format('MM/YYYY'),
            yStart = moment(dateStart).format('YYYY'),
            yEnd = moment(dateEnd).format('YYYY'),
            dStart = moment(dateStart).format('DD'),
            dEnd = moment(dateEnd).format('DD'),
            dmStart = moment(dateStart).format('DD/MM');
        if (dmyStart === dmyEnd) {
            timeCouse = dmyStart;
        } else if (myStart === myEnd) {
            timeCouse = `${dStart} - ${dEnd}/${myStart}`;
        } else if (yStart === yEnd) {
            timeCouse = `${dmStart} - ${dmyEnd}`;
        } else {
            timeCouse = `${dmyStart} - ${dmyEnd}`;
        }

        return (
            <View style={styles.styContentData}>
                <View style={styles.styItemData}>
                    <View style={viewLable}>
                        <VnrText style={styTextLable} value={item.PaymentAmountName ? item.PaymentAmountName : ''} />
                    </View>
                    <View style={styViewValue}>
                        <VnrText
                            style={styTextLable}
                            value={`${
                                (item.TotalAmount !== '' && item.TotalAmount != null) || item.TotalAmount == 0
                                    ? Vnr_Function.formatNumber(item.TotalAmount)
                                    : ''
                            }`}
                        />
                    </View>
                </View>

                <View style={styles.styItemData}>
                    <View style={viewLable}>
                        {timeCouse && (
                            <VnrText
                                style={[styTextValue, styles.styTextValueCus, styles.styTextTimeCoures]}
                                i18nKey={timeCouse}
                            />
                        )}
                    </View>
                    <View style={styViewValue}>
                        <VnrText
                            style={[styTextValue, styles.styTextValueCus]}
                            value={`${translate('QuantityCalculate')}: ${item.Quantity ? item.Quantity : '0'} ${
                                item.UnitView ? item.UnitView : ''
                            }`}
                        />
                    </View>
                </View>

                <View style={styles.styItemData}>
                    <View style={viewLable} />
                    <View style={styViewValue}>
                        <VnrText
                            style={[styTextValue, styles.styTextValueCus]}
                            value={`${translate('HRM_Category_PaymentAmount_Specification')}: ${
                                item.Specification ? item.Specification : ''
                            }`}
                        />
                    </View>
                </View>

                <View style={styles.styViewNote}>
                    <View style={styles.styItemDataNote}>
                        <View style={viewLable}>
                            <VnrText style={styleSheets.lable} i18nKey={'Notes'} />
                        </View>
                        <View style={viewLable}>
                            <VnrText
                                style={[styleSheets.text, styles.styTextNote]}
                                value={item.Notes ? item.Notes : ''}
                            />
                        </View>
                    </View>

                    <View style={styles.styItemDataNote}>
                        <View style={viewLable}>
                            <VnrText style={styleSheets.lable} i18nKey={'NoteOfSecretary'} />
                        </View>
                        <View style={viewLable}>
                            <VnrText
                                style={[styleSheets.text, styles.styTextNote]}
                                value={item.NoteOfSecretary ? item.NoteOfSecretary : ''}
                            />
                        </View>
                    </View>
                </View>

                {item.lstFileAttach &&
                    Vnr_Function.formatStringTypeV2(item, {
                        TypeView: 'E_FILEATTACH',
                        Name: 'lstFileAttach',
                        DisplayKey: 'HRM_Att_BusinessTravel_FileAttachment',
                        DataType: 'FileAttach'
                    })}
            </View>
        );
    };

    render() {
        const { dataItem, keyType } = this.state,
            { styTextGroup } = stylesScreenDetailV2;

        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem) {
            // console.log(dataItem.listDataCost, 'listDataCost')
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={CustomStyleSheet.flexGrow(1)}>
                        <View style={styles.styBlock}>
                            {dataItem.listDataCost[keyType] &&
                                dataItem.listDataCost[keyType].map((e) => this.initLableValue(e))}

                            {/* {
                                        dataItem.listDataTotalCost[key] && (
                                            <View style={styles.styViewDataTotal}>
                                                <View style={styles.styWrapRight}>
                                                    <VnrText
                                                        style={[styleSheets.lable, styTextGroup]}
                                                        value={}
                                                    />
                                                </View>
                                            </View>
                                        )
                                    } */}
                        </View>
                    </ScrollView>
                    {dataItem.listDataTotalCost[keyType] && (
                        <View style={styles.styViewBottomCost}>
                            <VnrText
                                style={[styleSheets.text, styles.styLableTextBottom]}
                                value={`${translate('SumAmount')} `}
                            />

                            <VnrText
                                style={[styleSheets.lable, styTextGroup]}
                                value={`${
                                    (dataItem.TotalAmount != null && dataItem.TotalAmount != '') ||
                                    dataItem.TotalAmount == 0
                                        ? Vnr_Function.formatNumber(dataItem.TotalAmount)
                                        : ''
                                } ${dataItem.Specification ? dataItem.Specification : ''}`}
                            />
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
    styTextTimeCoures: { textAlign: 'left' },
    styViewBottomCost: {
        backgroundColor: Colors.gray_3,
        width: Size.deviceWidth - Size.defineSpace * 2,
        marginHorizontal: Size.defineSpace,
        marginTop: Size.defineSpace,
        marginBottom: Size.defineSpace * 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Size.defineHalfSpace,
        borderRadius: 8,
        borderColor: Colors.gray_5,
        borderWidth: 0.5
    },
    styLableTextBottom: {
        color: Colors.gray_8,
        fontSize: Size.text - 1
    },
    styTextValueCus: {
        fontSize: Size.text - 1
    },
    styBlock: {
        width: Size.deviceWidth,
        backgroundColor: Colors.white,
        paddingBottom: Size.defineHalfSpace,
        marginBottom: Size.defineHalfSpace
    },
    styContentData: {
        width: Size.deviceWidth - Size.defineSpace * 2,
        backgroundColor: Colors.white,

        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 1,
        marginTop: Size.defineSpace,
        paddingBottom: Size.defineSpace,
        marginHorizontal: Size.defineSpace,
        paddingRight: 2
    },
    styViewNote: {
        marginVertical: Size.defineHalfSpace,
        width: '100%'
    },
    styItemData: {
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: Size.defineHalfSpace - 2
    },
    styItemDataNote: {
        width: '100%',
        marginTop: Size.defineHalfSpace - 2
    },
    styTextNote: {
        fontSize: Size.text - 1,
        color: Colors.gray_9,
        marginTop: 5,
        marginLeft: 3
    }
});
