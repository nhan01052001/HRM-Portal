import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import HreSurveyQuizlList from './HreSurveyQuizList';
import { styleSheets, styleSafeAreaView } from '../../../../constants/styleConfig';
import { ConfigList } from '../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName } from '../../../../assets/constant';
import { dataVnrStorage } from '../../../../assets/auth/authentication';

let configList = null,
    enumName = null,
    screenName = null,
    screenViewDetail = null;

export default class HreSurveyQuiz extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            dataBody: null,
            refreshList: true
        };

        this.storeParamsDefault = null;
        //biến lưu lại object filter
        this.paramsFilter = null;
    }

    reload = paramsFilter => {
        if (paramsFilter === 'E_KEEP_FILTER') {
            paramsFilter = { ...this.paramsFilter };
        } else {
            this.paramsFilter = { ...paramsFilter };
        }

        let _paramsDefault = this.storeParamsDefault;
        _paramsDefault = {
            ..._paramsDefault,
            dataBody: { ..._paramsDefault.dataBody, ...paramsFilter },
            refreshList: !this.state.refreshList
        };

        this.setState(_paramsDefault);
    };

    paramsDefault = () => {
        const _configList = configList[screenName]
                ? configList[screenName]
                : {
                    Api: {
                        //"urlApi": "[URI_HR]/Hre_GetData/GetProfileLanguageLevelList",
                        type: 'POST',
                        pageSize: 20
                    },
                    Order: [
                        {
                            field: 'DateUpdate',
                            dir: 'desc'
                        }
                    ]
                },
            orderBy = _configList[enumName.E_Order];

        let _params = {
            sort: orderBy
        };

        return {
            refreshList: !this.state.refreshList,
            dataBody: _params
        };
    };

    generaRender = () => {
        configList = ConfigList.value;
        enumName = EnumName;
        screenName = ScreenName.HreSurveyQuiz;
        screenViewDetail = ScreenName.HreSurveyQuizViewDetail;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);
    };

    componentDidMount() {
        this.generaRender();
    }

    render() {
        const { dataBody, refreshList } = this.state;
        let surveyEndpointApi = null;
        if (dataVnrStorage.apiConfig && dataVnrStorage.apiConfig.surveyEndpointApi)
            surveyEndpointApi = dataVnrStorage.apiConfig.surveyEndpointApi;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {dataBody != null && surveyEndpointApi != null && (
                    <View style={[styleSheets.container]}>
                        <HreSurveyQuizlList
                            isRefreshList={refreshList}
                            detail={{
                                dataLocal: false,
                                screenDetail: screenViewDetail,
                                screenName: screenName
                            }}
                            api={{
                                urlApi: `${surveyEndpointApi}/api/survey?Type=quiz`,
                                //urlApi: '[URI_HR]//Por_GetData/GetSurveyQuiz',
                                type: EnumName.E_GET,
                                dataBody: dataBody,
                                pageSize: 20
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
