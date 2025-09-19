import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView, Colors } from '../../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../../components/EmptyData/EmptyData';
import DrawerServices from '../../../../../../utils/DrawerServices';
import { ScreenName } from '../../../../../../assets/constant';
import { translate } from '../../../../../../i18n/translate';

const configDefault = [
    {
        Name: 'RelativeName',
        DisplayKey: 'RelativeName',
        DataType: 'string'
    },
    {
        Name: 'GenderView',
        DisplayKey: 'GenderView',
        DataType: 'string'
    },
    {
        Name: 'YearOfBirth',
        DisplayKey: 'DateOfBirth',
        DataType: 'string'
    },
    {
        Name: 'RelativeTypeName',
        DisplayKey: 'RelativeTypeName',
        DataType: 'string'
    },
    {
        Name: 'IDNo',
        DisplayKey: 'IDNo',
        DataType: 'string'
    },
    {
        Name: 'ProvinceName',
        DisplayKey: 'Hre_SignatureRegister_province',
        DataType: 'string'
    },
    {
        Name: 'DistrictName',
        DisplayKey: 'HRM_LabelInfo_District',
        DataType: 'string'
    },
    {
        Name: 'VillageName',
        DisplayKey: 'Cat_Village-Name',
        DataType: 'string'
    }
];

export default class HouseholdAddRelativeViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            listActions: this.resultListActionHeader()
        };
    }

    resultListActionHeader = () => {
        const _params = this.props.navigation.state.params;
        if (_params && _params.listActions && Array.isArray(_params.listActions)) {
            return _params.listActions;
        }
        return [];
    };

    getDataItem = (isReload = false) => {
        try {
            const _params = this.props.navigation.state.params,
                { dataId, dataItem, screenName } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[screenName]
                    ? ConfigListDetail.value[screenName]
                    : configDefault;

            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                //
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                this.setState({ configListDetail: _configListDetail, dataItem });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    reload = (E_KEEP_FILTER, actionIsDelete) => {
        //detail
        const { reloadScreenList, screenName } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');

        //nếu action = Delete => back về danh sách
        if (actionIsDelete) {
            DrawerServices.navigate(screenName);
        } else {
            this.getDataItem();
        }
    };

    // componentDidMount() {
    //     this.getDataItem();
    // }
    componentDidMount() {
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail } = this.state,
            { containerItemDetail, bottomActions } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={[styleSheets.col_10]}>
                    <ScrollView>
                        <View style={containerItemDetail}>
                            {configListDetail.map(e => {
                                return Vnr_Function.formatStringTypeV2(dataItem, e);
                            })}
                        </View>
                    </ScrollView>
                    <View style={bottomActions}>
                        <View style={styles.viewIcon}>
                            <TouchableOpacity
                                onPress={() =>
                                    DrawerServices.navigate('HouseholdAddOrEdit', {
                                        record: {
                                            ...dataItem,
                                            ID: null
                                        },
                                        reload: () => this.reload(),
                                        screenName: ScreenName.HouseholdConfirmed
                                    })
                                }
                                style={[styles.bnt_icon]}
                            >
                                <Text style={[styleSheets.text, { color: Colors.white }]}>
                                    {translate('HRM_Common_Create')}
                                </Text>
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
    bnt_icon: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },

    viewIcon: {
        flex: 1,
        marginHorizontal: 5,
        backgroundColor: Colors.primary
    }
});
