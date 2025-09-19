import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import HreTaskList from './hreTaskList/HreTaskList';
import {
    styleSheets,
    styleSafeAreaView,
    styleContentFilterDesign
} from '../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName } from '../../../../assets/constant';
import { generateRowActionAndSelectedForTaskAssigned, TaskBusinessBusinessFunction } from './HreTaskBusiness';
import HreModalUpdateStatus from './HreModalUpdateStatus';
let enumName = null,
    hreTaskAssigned = null,
    hreTaskViewDetail = null;

export default class HreTaskAssigned extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataBody: null,
            rowActions: [],
            selected: [],
            updateStatusVisible: false,
            updateStatusData: [],
            refreshList: true
            //isvisibleModalRefer: false,

            // filter header
        };

        this.storeParamsDefault = null;

        //biến lưu lại object filter
        this.paramsFilter = null;
        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // reload danh sách khi có edit hoặc delete dữ liệu
            if (TaskBusinessBusinessFunction.checkForLoadEditDelete[ScreenName.HreTaskAssigned]) {
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

        let _paramsDefault = this.storeParamsDefault;
        _paramsDefault = {
            ..._paramsDefault,
            dataBody: { ..._paramsDefault.dataBody, ...paramsFilter },
            refreshList: !this.state.refreshList
        };
        // set lại biến khi đã reload
        TaskBusinessBusinessFunction.checkForLoadEditDelete[ScreenName.HreTaskAssigned] = false;
        this.setState(_paramsDefault);
    };

    paramsDefault = screenName => {
        const _configList = ConfigList[screenName],
            orderBy = _configList[enumName.E_Order];

        const dataRowActionAndSelected = generateRowActionAndSelectedForTaskAssigned(screenName);
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
        //set by config
        enumName = EnumName;

        hreTaskAssigned = ScreenName.HreTaskAssigned;
        hreTaskViewDetail = ScreenName.HreTaskViewDetail;
        TaskBusinessBusinessFunction.setThisForBusiness(this, this.props.navigation, hreTaskAssigned);
        let _paramsDefault = this.paramsDefault(hreTaskAssigned);
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    hideModalUpdateStatus = () => {
        this.setState({ updateStatusVisible: false, updateStatusData: null });
    };

    render() {
        const { dataBody, rowActions, selected, refreshList, updateStatusData, updateStatusVisible } = this.state;

        let _dataBody = null;
        if (dataBody) {
            _dataBody = {
                ...dataBody,
                IsAssignedTask: true
            };
        }


        return (
            <SafeAreaView {...styleSafeAreaView}>
                {hreTaskAssigned && hreTaskViewDetail && enumName && (
                    <View style={styleSheets.container}>
                        <VnrFilterCommon
                            style={styleContentFilterDesign}
                            screenName={hreTaskAssigned}
                            onSubmitEditing={dataFilter => this.reload(dataFilter, true)}
                        />
                        <View style={[styleSheets.col_10]}>
                            {_dataBody && (
                                <HreTaskList
                                    isRefreshList={refreshList}
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: hreTaskViewDetail,
                                        screenName: hreTaskAssigned
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

                        {updateStatusData && (
                            <HreModalUpdateStatus
                                //   reload={this.refreshList}
                                updateStatusData={updateStatusData}
                                updateStatusVisible={updateStatusVisible}
                                hideModalUpdateStatus={this.hideModalUpdateStatus}
                            />
                        )}
                    </View>
                )}
            </SafeAreaView>
        );
    }
}
