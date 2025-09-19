import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import ContractList from './ContractList';
import { styleSheets, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ScreenName } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';

export default class Contract extends Component {
    constructor(porps) {
        super(porps);
    }

    componentDidMount() {}

    render() {
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>
                    <ContractList
                        detail={{
                            dataLocal: false,
                            screenDetail: ScreenName.ContractDetail,
                            screenName: ScreenName.Contract
                        }}
                        api={{
                            urlApi: '[URI_HR]/Hre_GetData/GetContractByProfileID',
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
