import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import HreTaskList from './hreTaskList/HreTaskList';
import { styleSheets, styleSafeAreaView, styleContentFilterDesign } from '../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName } from '../../../../assets/constant';
import { generateRowActionAndSelected, TaskBusinessBusinessFunction } from './HreTaskBusiness';

let enumName = null,
    configList = null,
    hreTaskAssign = null,
    hreTaskViewDetail = null;

export default class HreTaskAssign extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataBody: null,
            rowActions: [],
            selected: [],
            refreshList: true
        };

        this.storeParamsDefault = null;

        //biến lưu lại object filter
        this.paramsFilter = null;

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            const { params } = this.props.navigation.state;
            if (params && params.refreshListTaskAssign) {
                params.refreshListTaskAssign = false;
                this.reload();
            }
            // reload danh sách khi có edit hoặc delete dữ liệu
            if (TaskBusinessBusinessFunction.checkForLoadEditDelete[ScreenName.HreTaskAssign]) {
                this.reload();
            }
        });
    }

    reload = paramsFilter => {
        if (paramsFilter === 'E_KEEP_FILTER') {
            paramsFilter = { ...this.paramsFilter };
        } else {
            this.paramsFilter = { ...paramsFilter };
        }
        // set lại biến khi đã reload
        TaskBusinessBusinessFunction.checkForLoadEditDelete[ScreenName.HreTaskAssign] = false;

        let _paramsDefault = this.storeParamsDefault;
        _paramsDefault = {
            ..._paramsDefault,
            dataBody: { ..._paramsDefault.dataBody, ...paramsFilter },
            refreshList: !this.state.refreshList
        };
        this.setState(_paramsDefault);
    };

    paramsDefault = screenName => {
        const _configList = configList[screenName],
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
        configList = ConfigList.value;
        enumName = EnumName;

        hreTaskAssign = ScreenName.HreTaskAssign;
        hreTaskViewDetail = ScreenName.HreTaskViewDetail;
        TaskBusinessBusinessFunction.setThisForBusiness(this, this.props.navigation, hreTaskAssign);
        let _paramsDefault = this.paramsDefault(hreTaskAssign);
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    render() {
        const { dataBody, rowActions, selected, refreshList } = this.state;
        let _dataBody = null;
        if (dataBody) {
            _dataBody = {
                ...dataBody,
                IsAssignTask: true
            };
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {hreTaskAssign && hreTaskViewDetail && enumName && (
                    <View style={styleSheets.container}>
                        <VnrFilterCommon
                            style={styleContentFilterDesign}
                            screenName={hreTaskAssign}
                            onSubmitEditing={dataFilter => this.reload(dataFilter, true)}
                        />
                        <View style={[styleSheets.col_10]}>
                            {_dataBody && (
                                <HreTaskList
                                    isRefreshList={refreshList}
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: hreTaskViewDetail,
                                        screenName: hreTaskAssign
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
                        </View>
                    </View>
                )}
            </SafeAreaView>
        );
    }
}
