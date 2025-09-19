import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleSafeAreaView, styleContentFilterDesign } from '../../../../../constants/styleConfig';
import HreStopWorkingList from '../hreStopWorkingList/HreStopWorkingList';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName } from '../../../../../assets/constant';
import { generateRowActionAndSelected, HreApprovedStopWorkingBusinessFunction } from './HreApprovedStopWorkingBusiness';
import { HreApproveStopWorkingBusinessFunction } from '../hreApproveStopWorking/HreApproveStopWorkingBusiness';

let configList = null,
    enumName = null,
    hreApprovedStopWorking = null,
    hreApprovedStopWorkingViewDetail = null;

export default class HreApprovedStopWorking extends Component {
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
        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // reload danh sách khi có approve hoặc reject dữ liệu
            if (HreApproveStopWorkingBusinessFunction.checkForReLoadScreen[ScreenName.HreApprovedStopWorking]) {
                this.reload();
            }
        });
    }

    reload = (paramsFilter) => {
        if (paramsFilter === 'E_KEEP_FILTER') {
            paramsFilter = { ...this.paramsFilter };
        } else {
            this.paramsFilter = { ...paramsFilter };
        }

        // set false khi đã reload.
        HreApproveStopWorkingBusinessFunction.checkForReLoadScreen[ScreenName.HreApprovedStopWorking] = false;

        let _paramsDefault = this.storeParamsDefault;
        _paramsDefault = { ..._paramsDefault, dataBody: { ..._paramsDefault.dataBody, ...paramsFilter } };
        this.setState(_paramsDefault);
    };

    paramsDefault = () => {
        const _configList = configList[hreApprovedStopWorking],
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

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    componentDidMount() {
        HreApproveStopWorkingBusinessFunction.checkForReLoadScreen[ScreenName.HreApprovedStopWorking] = false;

        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        hreApprovedStopWorking = ScreenName.HreApprovedStopWorking;
        // hreApprovedStopWorkingAddOrEdit = ScreenName.HreApproveStopWorking;
        hreApprovedStopWorkingViewDetail = ScreenName.HreApprovedStopWorkingViewDetail;

        HreApprovedStopWorkingBusinessFunction.setThisForBusiness(this, false);

        let _paramsDefault = this.paramsDefault();

        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);
    }

    render() {
        const { dataBody, rowActions, selected } = this.state;
        return (
            <SafeAreaView {...styleSafeAreaView} forceInset={{ top: 'never' }}>
                {hreApprovedStopWorking && hreApprovedStopWorkingViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <VnrFilterCommon
                            style={styleContentFilterDesign}
                            screenName={hreApprovedStopWorking}
                            onSubmitEditing={this.reload}
                        />

                        <View style={[styleSheets.col_10]}>
                            {dataBody && (
                                <HreStopWorkingList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: hreApprovedStopWorkingViewDetail,
                                        screenName: hreApprovedStopWorking
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    api={{
                                        urlApi: '[URI_HR]/Hre_GetData/NewPortalGetStopWorkingApprovedList',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
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
