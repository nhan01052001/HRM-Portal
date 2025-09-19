import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleSafeAreaView
} from '../../../../../../constants/styleConfig';
import { ConfigList } from '../../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName } from '../../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../../assets/auth/authentication';
import { generateRowActionAndSelected, LanguageLevelBusinessFunction } from '../LanguageLevelBusinessFunction';
import { PermissionForAppMobile } from '../../../../../../assets/configProject/PermissionForAppMobile';
import LanguageLevelList from '../languageLevelList/LanguageLevelList';
import { VnrBtnCreate } from '../../../../../../componentsV3/VnrBtnCreate/VnrBtnCreate';
let configList = null,
    enumName = null,
    screenName = null,
    screenViewDetail = null;

export default class LanguageLevelConfirmed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataBody: null,
            rowActions: [],
            selected: [],
            refreshList: true
        };

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            LanguageLevelBusinessFunction.setThisForBusiness(this, false);
        });
        this.storeParamsDefault = null;
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

    paramsDefault = () => {
        const _configList = configList[screenName],
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
        screenName = ScreenName.LanguageLevelConfirmed;
        screenViewDetail = ScreenName.LanguageLevelConfirmedViewDetail;

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
                        <LanguageLevelList
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
                                urlApi: '[URI_HR]/Hre_GetData/GetListProfileLanguageLevelByProfileID',
                                type: 'E_POST',
                                dataBody: dataBody
                            }}
                            valueField="ID"
                            // renderConfig={renderRow}
                        />
                        {PermissionForAppMobile &&
                            PermissionForAppMobile.value['HRM_HR_ProfileLanguageLevel_Portal_Grid'] &&
                            PermissionForAppMobile.value['HRM_HR_ProfileLanguageLevel_Portal_Grid']['Create'] && (
                            <VnrBtnCreate
                                onAction={() => {
                                    this.props.navigation.navigate('LanguageLevelAddOrEdit', {
                                        reload: () => this.reload(),
                                        screenName: ScreenName.LanguageLevelConfirmed
                                    });
                                }}
                            />
                        )}
                    </View>
                )}
            </SafeAreaView>
        );
    }
}
