import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import TaxInfoList from './TaxInfoList';
import { styleSheets, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ScreenName } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';

export default class TaxInfo extends Component {
    constructor(porps) {
        super(porps);
    }

    componentDidMount() {}

    render() {
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>
                    <TaxInfoList
                        detail={{
                            dataLocal: false,
                            screenDetail: ScreenName.TaxInfoViewDetail,
                            screenName: ScreenName.TaxInfo
                        }}
                        api={{
                            urlApi: '[URI_HR]/Sal_GetData/GetSalTaxInformationRegisterPortal',
                            type: 'E_POST',
                            dataBody: {
                                UserSubmit: dataVnrStorage.currentUser.info
                                    ? dataVnrStorage.currentUser.info.ProfileID
                                    : null
                            }
                        }}
                        valueField="ID"
                    />
                </View>
            </SafeAreaView>
        );
    }
}
