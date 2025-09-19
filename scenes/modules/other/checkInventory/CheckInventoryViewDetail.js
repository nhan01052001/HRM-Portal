import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleSafeAreaView, Size, Colors } from '../../../../constants/styleConfig';
import VnrText from '../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../utils/Vnr_Function';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../components/EmptyData/EmptyData';
import DrawerServices from '../../../../utils/DrawerServices';

export default class CheckInventoryViewDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataItem: null
        };
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

    reload = (E_KEEP_FILTER, actionIsDelete) => {
        const { reloadScreenList } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');

        //nếu action = Delete => back về danh sách
        if (actionIsDelete) {
            DrawerServices.navigate('AttSubmitBusinessTravelTransfer');
        } else {
            this.getDataItem(true);
        }
    };

    componentDidMount() {
        this.getDataItem();
    }

    render() {
        const { dataItem } = this.state;
        let contentViewDetail = <VnrLoading size={'large'} />;

        if (dataItem) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <View style={styles.styViewDetail}>
                        <Image source={require('../../../../assets/images/BarCode.png')} style={styles.styBarCode} />
                        <VnrText
                            style={[styleSheets.text, styles.styTextData]}
                            i18nKey={'HRM_Hre_CheckInventory_RequestData'}
                        />
                        <Image source={require('../../../../assets/images/QRCode_Dome.png')} style={styles.styQrCode} />

                        <View style={styles.styViewValue}>
                            {dataItem.Qty != null && dataItem.Qty != 0 ? (
                                <View style={styles.styViewInventory}>
                                    <Text style={[styleSheets.text, styles.styTextInventory]}>
                                        {dataItem.Qty != null ? dataItem.Qty : ''}
                                    </Text>
                                    <Text style={[styleSheets.lable, styles.styTextUnitName]}>
                                        {dataItem.UnitName != null ? dataItem.UnitName : ''}
                                    </Text>
                                </View>
                            ) : (
                                <View style={styles.styViewInventory}>
                                    <VnrText
                                        style={[styleSheets.text, styles.styTextOutStock]}
                                        i18nKey={'HRM_Hre_CheckInventory_OutOfStock'}
                                    />
                                </View>
                            )}

                            <Text style={[styleSheets.text, styles.styTextItemName]}>
                                {dataItem.FacilityItemName != null ? dataItem.FacilityItemName : ''}
                            </Text>

                            <Text style={[styleSheets.text, styles.styTextUnitCode]}>
                                {dataItem.Code != null ? dataItem.Code : ''}
                            </Text>
                        </View>

                        {/* bottom button close, confirm */}
                        <View style={styles.groupButton}>
                            <TouchableOpacity
                                onPress={() => DrawerServices.navigate('CheckInventory')}
                                style={styles.groupButton__button_save}
                            >
                                <VnrText
                                    style={[styleSheets.lable, styles.groupButton__text]}
                                    i18nKey={'HRM_Hre_CheckInventory_ContinueCheck'}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
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
    styViewDetail: {
        flex: 1,
        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineSpace,
        alignItems: 'center'
    },
    styBarCode: {
        width: Size.deviceWidth - Size.defineSpace * 2
    },
    styQrCode: {
        width: Size.deviceWidth * 0.5
    },
    styTextData: {
        fontSize: Size.text + 2,
        marginVertical: Size.defineSpace
    },
    styViewValue: {
        flex: 1,
        width: Size.deviceWidth - Size.defineSpace * 2,
        marginTop: Size.defineSpace * 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopColor: Colors.gray_5,
        borderStyle: 'dotted',
        borderTopWidth: 1
    },
    styViewInventory: {
        flexDirection: 'row',
        marginLeft: Size.defineSpace
    },
    styTextInventory: {
        fontSize: Size.textlarge + 20,
        fontWeight: '700',
        color: Colors.primary
    },
    styTextOutStock: {
        fontSize: Size.textlarge + 20,
        fontWeight: '700',
        color: Colors.red
    },
    styTextUnitName: {
        fontSize: Size.textlarge,
        color: Colors.primary,
        marginLeft: 4,
        position: 'absolute',
        top: -Size.text,
        right: -(Size.text * 3)
    },
    styTextItemName: {},
    styTextUnitCode: {
        color: Colors.gray_7
    },

    groupButton: {},
    groupButton__button_save: {
        width: Size.deviceWidth - Size.defineSpace * 2,
        height: Size.heightButton,
        borderRadius: styleSheets.radius_5,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    groupButton__text: {
        marginLeft: 5,
        color: Colors.white
    }
});
