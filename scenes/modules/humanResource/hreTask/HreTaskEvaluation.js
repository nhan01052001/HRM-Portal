import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import HreTaskList from './hreTaskList/HreTaskList';
import { styleSheets, styleSafeAreaView, styleContentFilterDesign } from '../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName } from '../../../../assets/constant';
import { generateRowActionAndSelected, TaskBusinessBusinessFunction } from './HreTaskBusiness';
import HreModalEvaluation from './HreModalEvaluation';
let enumName = null,
    hreTaskEvaluation = null,
    hreTaskViewDetail = null;

export default class HreTaskEvaluation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataBody: null,
            rowActions: [],
            selected: [],
            refreshList: true,
            evaluateModalVisible: false,
            evaluateData: null
        };

        this.storeParamsDefault = null;

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            TaskBusinessBusinessFunction.setThisForBusiness(this);
        });
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
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

    paramsDefault = screenName => {
        const _configList = ConfigList[screenName],
            orderBy = _configList[enumName.E_Order];

        const dataRowActionAndSelected = generateRowActionAndSelected(screenName);
        let _params = {
            sort: orderBy
        };
        return {
            rowActions: dataRowActionAndSelected.rowActions,
            selected: dataRowActionAndSelected.selected,
            refreshList: !this.state.refreshList,
            dataBody: _params
        };
    };

    componentDidMount() {
        //const { navigation } = this.props;
        //set by config
        enumName = EnumName;

        hreTaskEvaluation = ScreenName.HreTaskEvaluation;
        hreTaskViewDetail = ScreenName.HreTaskViewDetail;

        let _paramsDefault = this.paramsDefault(hreTaskEvaluation);
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);
    }

    hideModalEvaluate = () => {
        this.setState({ evaluateModalVisible: false, evaluateData: null });
    };

    showModalEvaluate = dataItem => {
        this.setState({ evaluateModalVisible: true, evaluateData: dataItem });
    };

    render() {
        const { dataBody, rowActions, selected, refreshList, evaluateData, evaluateModalVisible } = this.state;

        let _dataBody = null;
        if (dataBody) {
            _dataBody = {
                ...dataBody,
                IsTaskEvaluation: true
            };
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {hreTaskEvaluation && hreTaskViewDetail && enumName && (
                    <View style={styleSheets.container}>
                        <VnrFilterCommon
                            style={styleContentFilterDesign}
                            screenName={hreTaskEvaluation}
                            onSubmitEditing={dataFilter => this.reload(dataFilter, true)}
                        />
                        <View style={[styleSheets.col_10]}>
                            {_dataBody && (
                                <HreTaskList
                                    isRefreshList={refreshList}
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: hreTaskViewDetail,
                                        screenName: hreTaskEvaluation
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    api={{
                                        urlApi: '[URI_HR]/Tas_GetData/GetListTaskMobile',
                                        type: enumName.E_POST,
                                        dataBody: _dataBody,
                                        pageSize: 20
                                    }}
                                    valueField="ID"
                                />
                            )}
                            {evaluateData && (
                                <HreModalEvaluation
                                    //   reload={this.refreshList}
                                    evaluateData={evaluateData}
                                    evaluateModalVisible={evaluateModalVisible}
                                    hideModalEvaluate={this.hideModalEvaluate}
                                />
                            )}
                        </View>
                    </View>
                )}
            </SafeAreaView>
        );
    }
}
