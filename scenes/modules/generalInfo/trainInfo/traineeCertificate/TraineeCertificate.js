import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import TraineeCertificateList from './TraineeCertificateList';
import { styleSheets, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ScreenName } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';

let screenName = null,
    screenViewDetail = null;

export default class TraineeCertificate extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            renderRow: null,
            isShowList: false
        };
    }

    generaRender = () => {
        screenName = ScreenName.TraineeCertificate;
        screenViewDetail = ScreenName.TraineeCertificateViewDetail;
        this.setState({ isShowList: true });
        // const _configList = configList && configList['GeneralInfoTrainee'],
        //     renderRow = _configList && _configList[enumName.E_Row];

        // this.setState({ renderRow });
    };

    componentDidMount() {
        this.generaRender();
    }

    render() {
        const { isShowList } = this.state;
        return (
            <SafeAreaView {...styleSafeAreaView}>
                {isShowList && (
                    <View style={[styleSheets.container]}>
                        <TraineeCertificateList
                            detail={{
                                dataLocal: false,
                                screenDetail: screenViewDetail,
                                screenName: screenName
                            }}
                            api={{
                                urlApi: '[URI_HR]/Por_GetData/GetTraineeCertificateByProfileID',
                                type: 'E_POST',
                                dataBody: {
                                    profileID: dataVnrStorage.currentUser.info
                                        ? dataVnrStorage.currentUser.info.ProfileID
                                        : null
                                }
                            }}
                            valueField="ID"
                            //renderConfig={renderRow}
                        />
                    </View>
                )}
            </SafeAreaView>
        );
    }
}
