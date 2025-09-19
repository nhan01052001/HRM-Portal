import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import RelativeList from '../relativeList/RelativeList';
import {
    styleSheets,
    styleSafeAreaView
} from '../../../../../../constants/styleConfig';
import { ConfigList } from '../../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName } from '../../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../../assets/auth/authentication';
import {
    generateRowActionAndSelected,
    RelativeWaitConfirmBusinessFunction
} from '../relativeWaitConfirm/RelativeWaitConfirmBusinessFunction';
let configList = null,
    enumName = null,
    screenName = null,
    screenViewDetail = null;

export default class RelativeEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataBody: null,
            rowActions: [],
            selected: [],
            refreshList: true
        };

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            RelativeWaitConfirmBusinessFunction.setThisForBusiness(this, false);
            if (RelativeWaitConfirmBusinessFunction.checkForLoadEditDelete[ScreenName.RelativeEdit]) {
                this.reload();
            }
        });
        this.storeParamsDefault = null;
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    reload = paramsFilter => {
        RelativeWaitConfirmBusinessFunction.checkForLoadEditDelete[ScreenName.RelativeEdit] = false;
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
            //renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order];

        const dataRowActionAndSelected = generateRowActionAndSelected(screenName);
        let _params = {
            IsPortal: true,
            sort: orderBy,
            profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
        };
        return {
            rowActions: dataRowActionAndSelected.rowActions,
            selected: dataRowActionAndSelected.selected,
            //renderRow: renderRow,
            dataBody: _params
        };
    };

    generaRender = () => {
        configList = ConfigList.value;
        enumName = EnumName;
        screenName = ScreenName.RelativeEdit;
        screenViewDetail = ScreenName.RelativeEditViewDetail;

        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);
    };

    componentDidMount() {
        this.generaRender();
    }

    render() {
        const { dataBody, rowActions, selected, refreshList } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {dataBody && (
                    <View style={[styleSheets.container]}>
                        <RelativeList
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
                                urlApi: '[URI_HR]/Hre_GetData/GetHre_RelativesByDataStatus_Edit',
                                type: 'E_POST',
                                dataBody: dataBody
                            }}
                            valueField="ID"
                            // renderConfig={renderRow}
                        />
                    </View>
                )}
            </SafeAreaView>
        );
    }
}
