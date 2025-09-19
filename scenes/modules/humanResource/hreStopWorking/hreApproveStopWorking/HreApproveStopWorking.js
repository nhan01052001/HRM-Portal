import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleSafeAreaView, styleContentFilterDesign } from '../../../../../constants/styleConfig';
import HreStopWorkingList from '../hreStopWorkingList/HreStopWorkingList';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName } from '../../../../../assets/constant';
import { generateRowActionAndSelected, HreApproveStopWorkingBusinessFunction } from './HreApproveStopWorkingBusiness';

let configList = null,
    enumName = null,
    hreApproveStopWorking = null,
    hreApproveStopWorkingViewDetail = null;

export default class HreApproveStopWorking extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataBody: null,
            rowActions: [],
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
        _paramsDefault = { ..._paramsDefault, dataBody: { ..._paramsDefault.dataBody, ...paramsFilter } };
        this.setState(_paramsDefault);
    };

    paramsDefault = () => {
        const _configList = configList[hreApproveStopWorking],
            //renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order];

        const dataRowActionAndSelected = generateRowActionAndSelected();
        let _params = {
            IsPortal: true,
            sort: orderBy
            //UserID: dataVnrStorage.currentUser.info.userid
        };
        return {
            rowActions: dataRowActionAndSelected.rowActions,
            selected: dataRowActionAndSelected.selected,
            //renderRow: renderRow,
            dataBody: _params
        };
    };

    componentDidMount() {
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        hreApproveStopWorking = ScreenName.HreApproveStopWorking;
        // hreApproveStopWorkingAddOrEdit = ScreenName.HreApproveStopWorking;
        hreApproveStopWorkingViewDetail = ScreenName.HreApproveStopWorkingViewDetail;

        HreApproveStopWorkingBusinessFunction.setThisForBusiness(this, false);

        let _paramsDefault = this.paramsDefault();

        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);
    }

    render() {
        const { dataBody, rowActions, selected } = this.state;
        return (
            <SafeAreaView {...styleSafeAreaView} forceInset={{ top: 'never' }}>
                {hreApproveStopWorking && hreApproveStopWorkingViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <VnrFilterCommon
                            style={styleContentFilterDesign}
                            screenName={hreApproveStopWorking}
                            onSubmitEditing={this.reload}
                        />

                        <View style={[styleSheets.col_10]}>
                            {dataBody && (
                                <HreStopWorkingList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: hreApproveStopWorkingViewDetail,
                                        screenName: hreApproveStopWorking
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    api={{
                                        //urlApi: '[URI_HR]/Att_GetData/New_GetPersonalSubmitRegistedTamScanLog',
                                        urlApi: '[URI_HR]/Hre_GetData/NewPortalGetStopWorkingWaitingApprovedList',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: 20
                                    }}
                                    valueField="ID"
                                    // renderConfig={renderRow}
                                />
                            )}
                        </View>
                    </View>
                )}
            </SafeAreaView>
        );
    }
}
