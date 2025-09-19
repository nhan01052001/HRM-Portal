import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import LookupProfileList from './LookupProfileList';
import VnrFilterCommon from '../../../../components/VnrFilter/VnrFilterCommon';
import { styleSheets, styleSafeAreaView } from '../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import { ScreenName } from '../../../../assets/constant';

export default class LookupProfile extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            dataBody: null
        };
        this.storeParamsDefault = null;
        //biến lưu lại object filter
        this.paramsFilter = null;
    }

    paramsDefault = () => {
        let _params = {
            UserSubmit: dataVnrStorage.currentUser.info.ProfileID
        };
        return {
            dataBody: _params
        };
    };

    reload = (paramsFilter) => {
        if (paramsFilter === 'E_KEEP_FILTER') {
            paramsFilter = { ...this.paramsFilter };
        } else {
            this.paramsFilter = { ...paramsFilter };
        }

        let _paramsDefault = this.storeParamsDefault;
        _paramsDefault = {
            ..._paramsDefault,
            dataBody: { ..._paramsDefault.dataBody, ...paramsFilter }
        };
        this.setState(_paramsDefault);
    };

    componentDidMount() {
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);
    }

    render() {
        const { dataBody } = this.state;
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>
                    <VnrFilterCommon screenName={ScreenName.LookupProfile} onSubmitEditing={this.reload} />
                    <View style={[styleSheets.col_10]}>
                        {dataBody && (
                            <LookupProfileList
                                api={{
                                    urlApi: '[URI_HR]/Hre_GetData/New_LookupProfilePortal',
                                    type: 'E_POST',
                                    dataBody: dataBody
                                }}
                                detail={{
                                    dataLocal: false,
                                    screenName: ScreenName.LookupProfile,
                                    screenDetail: ScreenName.LookupProfileViewDetail
                                }}
                                valueField="ID"
                                //renderConfig = {config["ConfigList"][0]["ScreenList"]}
                            />
                        )}
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
