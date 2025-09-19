import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import EvaPerformanceQuicklyHistoryList from './evaPerformanceQuicklyHistoryList/EvaPerformanceQuicklyHistoryList';
import VnrFilterCommon from '../../../../components/VnrFilter/VnrFilterCommon';
import { styleSheets, styleSafeAreaView } from '../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import { ScreenName } from '../../../../assets/constant';

export default class EvaPerformanceQuicklyHistory extends Component {
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
        //http://192.168.1.3:2703//Eva_GetData/GetEvaPerformanceQuicklyListHistory_Portal

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>
                    <VnrFilterCommon
                        screenName={ScreenName.EvaPerformanceQuicklyHistory}
                        onSubmitEditing={this.reload}
                    />
                    <View style={[styleSheets.col_10]}>
                        {dataBody && (
                            <EvaPerformanceQuicklyHistoryList
                                api={{
                                    urlApi: '[URI_HR]/Eva_GetData/GetEvaPerformanceQuicklyListHistory_Portal',
                                    type: 'E_POST',
                                    dataBody: dataBody
                                }}
                                detail={{
                                    dataLocal: false,
                                    screenName: ScreenName.EvaPerformanceQuicklyHistory,
                                    screenDetail: ScreenName.EvaPerformanceQuicklyHistoryViewDetail
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
