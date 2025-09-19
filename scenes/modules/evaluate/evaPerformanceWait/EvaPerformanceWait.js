import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import EvaPerformanceWaitList from './evaPerformanceWaitList/EvaPerformanceWaitList';
import { styleSheets, styleSafeAreaView, styleContentFilterDesign } from '../../../../constants/styleConfig';
import { ConfigList } from '../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName } from '../../../../assets/constant';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import VnrFilterCommon from '../../../../components/VnrFilter/VnrFilterCommon';
import { generateRowActionAndSelected, EvaPerformanceWaitBusinessFunction } from './EvaPerformanceWaitBusiness';
let configList = null,
    enumName = null,
    screenName = null,
    screenViewDetail = null;

export default class EvaPerformanceWait extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            dataBody: null,
            refreshList: true,
            renderRow: [],
            selected: []
        };

        this.storeParamsDefault = null;
        //biến lưu lại object filter
        this.paramsFilter = null;
    }

    reload = (paramsFilter) => {
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
        const _configList = configList[screenName],
            orderBy = _configList[enumName.E_Order],
            dataRowActionAndSelected = generateRowActionAndSelected();
        let _params = {
            IsPortal: true,
            sort: orderBy,
            EvaluatorID: dataVnrStorage.currentUser.info.ProfileID
        };

        return {
            refreshList: !this.state.refreshList,
            dataBody: _params,
            rowActions: dataRowActionAndSelected.rowActions,
            selected: dataRowActionAndSelected.selected
        };
    };

    generaRender = () => {
        configList = ConfigList.value;
        enumName = EnumName;
        screenName = ScreenName.EvaPerformanceWait;
        screenViewDetail = ScreenName.EvaPerformanceWaitViewDetail;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);
    };

    componentDidMount() {
        this.generaRender();
        EvaPerformanceWaitBusinessFunction.setThisForBusiness(this);
    }

    render() {
        const { dataBody, refreshList, selected, rowActions } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {screenName && screenViewDetail && (
                    <VnrFilterCommon
                        style={styleContentFilterDesign}
                        screenName={screenName}
                        onSubmitEditing={this.reload}
                    />
                )}
                {dataBody != null && (
                    <View style={[styleSheets.container]}>
                        <EvaPerformanceWaitList
                            isRefreshList={refreshList}
                            rowActions={rowActions}
                            selected={selected}
                            reloadScreenList={this.reload.bind(this)}
                            detail={{
                                dataLocal: false,
                                screenDetail: screenViewDetail,
                                screenName: screenName
                            }}
                            api={{
                                urlApi: '[URI_HR]/Eva_GetData/GetPerformanceEvaWaitEvaListPortal',
                                type: enumName.E_POST,
                                dataBody: dataBody,
                                pageSize: 20
                            }}
                            valueField="ID"
                        />
                    </View>
                )}
            </SafeAreaView>
        );
    }
}
