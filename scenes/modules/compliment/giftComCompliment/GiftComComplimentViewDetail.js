import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Image, Text, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleSafeAreaView, Size, Colors, CustomStyleSheet } from '../../../../constants/styleConfig';
import Vnr_Function from '../../../../utils/Vnr_Function';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../components/EmptyData/EmptyData';
import { translate } from '../../../../i18n/translate';
import GiftConfirmExChangeComCompliment from './GiftConfirmExChangeComCompliment';
import { ToasterSevice } from '../../../../components/Toaster/Toaster';

export default class GiftComComplimentViewDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataItem: null
        };
        this.GiftConfirmExChangeComCompliment = null;
    }

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);

            if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                this.setState({ dataItem });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    reload = () => {
        const { reloadScreenList } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER', true);
    };

    componentDidMount() {
        //AttApproveBusinessTravelBusinessFunction.setThisForBusiness(this);
        this.getDataItem();
    }

    render() {
        const { dataItem } = this.state;

        const _params = this.props.navigation.state.params,
            { itemSelected } = _params;
        let totalPoints = 0;

        itemSelected &&
            itemSelected.map((item) => {
                if (item?.Cost && item?.quantitySelected) {
                    totalPoints += item?.Cost * item?.quantitySelected;
                }
            });

        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={CustomStyleSheet.flexGrow(1)}>
                        <View style={styles.container}>
                            <Image style={styles.image} source={{ uri: dataItem.Image }} />

                            <View style={styles.styGiftExchange}>
                                <View
                                    style={{
                                        backgroundColor: Colors.white,
                                        paddingHorizontal: Size.defineSpace,
                                        paddingVertical: Size.defineSpace
                                    }}
                                >
                                    <Text style={styles.title}>{dataItem.Title}</Text>

                                    <View>
                                        <Text style={styles.description}>
                                            {translate('RemainCost')}: {dataItem?.Remaining} | {translate('Đã đổi')}:{' '}
                                            {dataItem?.Exchange}
                                        </Text>
                                    </View>
                                    {/* point && btn Add */}
                                    <View style={styles.styPointAddView}>
                                        {/* point */}
                                        <View>
                                            <Text style={[styleSheets.lable, styles.title, { color: Colors.blue }]}>
                                                {dataItem?.Cost} {translate('Point')}
                                            </Text>
                                        </View>

                                        {/* btn Add */}
                                        {/* {
                                            dataItem?.isSelect && dataItem?.quantitySelected > 0 ? (
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <TouchableOpacity style={[{ backgroundColor: Colors.white, borderColor: Colors.primary, borderWidth: 0.5 }, styles.btnAddOrMinus]}
                                                    // onPress={() => {
                                                    //     this.props.onMinus();
                                                    // }}
                                                    >
                                                        <IconMinus size={20} color={Colors.primary} />
                                                    </TouchableOpacity>
                                                    <Text style={[styleSheets.lable, { paddingHorizontal: 12, fontSize: Size.text + 1 }]}>
                                                        {isNaN(Number(dataItem?.quantitySelected)) === false ? dataItem?.quantitySelected < 10 ? "0" + dataItem?.quantitySelected : dataItem?.quantitySelected : "0"}
                                                    </Text>
                                                    <TouchableOpacity style={[{ backgroundColor: Colors.primary }, styles.btnAddOrMinus]}
                                                    // onPress={() => {
                                                    //     this.props.onAdd();
                                                    // }}
                                                    >
                                                        <IconPlus size={20} color={Colors.white} />
                                                    </TouchableOpacity>
                                                </View>
                                            ) : (
                                                <TouchableOpacity style={{
                                                    flexDirection: 'row', alignItems: 'center',
                                                    backgroundColor: Colors.primary,
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 5,
                                                    borderRadius: 2
                                                }}
                                                    onPress={() => {
                                                        //this.props.onClick();
                                                    }}
                                                >
                                                    <IconPlus size={Size.text} color={Colors.white} />
                                                    <Text style={[styles.description, { fontSize: Size.text + 1, color: Colors.white }]}>{translate("HRM_Common_SearchAdd")}</Text>
                                                </TouchableOpacity>
                                            )
                                        } */}
                                    </View>
                                    {/* <Text style={styles.price}>Price: ${dataItem.Cost}</Text> */}
                                </View>

                                <View style={styles.styViewGiftDetail}>
                                    <Text style={styles.styGiftDetailText}>Chi tiết quà tặng</Text>
                                    <Text style={[styles.description, styles.styDescriptionExtend]}>
                                        {dataItem.Description}
                                    </Text>
                                </View>
                            </View>

                            {/* <Button title="Add to Cart" /> */}
                        </View>
                    </ScrollView>
                    <GiftConfirmExChangeComCompliment
                        ref={(refs) => (this.GiftConfirmExChangeComCompliment = refs)}
                        dateItems={itemSelected}
                        totalPoints={totalPoints}
                    />
                    {itemSelected && itemSelected.length > 0 && (
                        <View style={styles.styItemSelected}>
                            <TouchableOpacity
                                style={styles.styBtnItemSelected}
                                onPress={() => {
                                    if (this.props.navigation.state?.params?.point < totalPoints) {
                                        ToasterSevice.showWarning('Điểm quy đổi không đủ!');
                                    } else if (
                                        this.GiftConfirmExChangeComCompliment &&
                                        this.GiftConfirmExChangeComCompliment.onShow
                                    ) {
                                        this.GiftConfirmExChangeComCompliment.onShow({
                                            reload: this.reload,
                                            record: null
                                        });
                                    }
                                }}
                            >
                                <View>
                                    <Text style={styles.styTextTotalChoice}>Tổng chọn</Text>
                                </View>
                                <View>
                                    <Text style={styles.styTextTotalPoints}>
                                        {itemSelected.length} phần • {totalPoints} điểm
                                    </Text>
                                </View>
                            </TouchableOpacity>
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
    styTextTotalPoints: { fontSize: 16, fontWeight: Platform.OS === 'ios' ? '300' : '500', color: Colors.white },
    styTextTotalChoice: { fontSize: 16, fontWeight: Platform.OS === 'ios' ? '400' : '600', color: Colors.white },
    styBtnItemSelected: {
        backgroundColor: Colors.primary,
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 12
    },
    styItemSelected: { backgroundColor: Colors.white, padding: 12 },
    styDescriptionExtend: { lineHeight: 18 },
    styGiftDetailText: { fontSize: 16, fontWeight: Platform.OS === 'ios' ? '400' : '600', marginVertical: 8 },
    styViewGiftDetail: { backgroundColor: Colors.white, paddingHorizontal: Size.defineSpace, marginTop: 12 },
    styPointAddView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Size.defineHalfSpace,
        alignItems: 'center'
    },
    styGiftExchange: { flex: 1, backgroundColor: Colors.gray_5 },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    image: {
        width: Size.deviceWidth,
        height: Size.deviceheight * 0.3
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    description: {
        textAlign: 'justify'
        // marginVertical: 10,
    }
});
