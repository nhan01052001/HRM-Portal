import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import AppendixContractList from './AppendixContractList';
import { styleSheets, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ScreenName } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';

export default class AppendixContract extends Component {
    constructor(porps) {
        super(porps);
    }

    componentDidMount() {}

    render() {
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>
                    <AppendixContractList
                        detail={{
                            dataLocal: false,
                            screenDetail: ScreenName.AppendixContractViewDetail,
                            screenName: ScreenName.AppendixContract
                        }}
                        api={{
                            urlApi: '[URI_HR]/Hre_GetData/GetContractAnnexByProfileID',
                            type: 'E_POST',
                            dataBody: {
                                profileID: dataVnrStorage.currentUser.info
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
