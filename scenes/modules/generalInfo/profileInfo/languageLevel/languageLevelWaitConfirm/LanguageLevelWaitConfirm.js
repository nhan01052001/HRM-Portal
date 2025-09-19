import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import LanguageLevelList from '../languageLevelList/LanguageLevelList';
import {
    styleSheets,
    styleSafeAreaView
} from '../../../../../../constants/styleConfig';
import { ConfigList } from '../../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName } from '../../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../../assets/auth/authentication';
import { generateRowActionAndSelected, LanguageLevelBusinessFunction } from '../LanguageLevelBusinessFunction';
import { PermissionForAppMobile } from '../../../../../../assets/configProject/PermissionForAppMobile';
let configList = null,
    enumName = null,
    screenName = null,
    screenViewDetail = null;

export default class LanguageLevelWaitConfirm extends Component {
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
            if (LanguageLevelBusinessFunction.checkForLoadEditDelete[ScreenName.LanguageLevelWaitConfirm]) {
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
        LanguageLevelBusinessFunction.checkForLoadEditDelete[ScreenName.LanguageLevelWaitConfirm] = false;
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
        ConfigList.value[ScreenName.LanguageLevelWaitConfirm] = {
            Api: {
                urlApi: '[URI_HR]/Hre_GetData/GetHre_ProfileProfileLanguageLevelByDataStatus_Add',
                type: 'POST',
                pageSize: 20
            },
            Order: [
                {
                    field: 'DateUpdate',
                    dir: 'desc'
                }
            ],
            BusinessAction: [
                {
                    Type: 'E_MODIFY',
                    Resource: {
                        Name: 'HRM_HR_ProfileLanguageLevel_Portal_Create_WaitingGrid_btnEdit',
                        Rule: 'View'
                    },
                    Confirm: {
                        isInputText: false,
                        isValidInputText: false
                    }
                },
                {
                    Type: 'E_DELETE',
                    Resource: {
                        Name: 'HRM_HR_ProfileLanguageLevel_Portal_Create_WaitingGrid_btnDel',
                        Rule: 'View'
                    },
                    Confirm: {
                        isInputText: false,
                        isValidInputText: false
                    }
                }
            ]
        };

        PermissionForAppMobile.value = {
            ...PermissionForAppMobile.value,
            HRM_HR_ProfileLanguageLevel_Portal_Create_WaitingGrid_btnEdit: {
                View: true
            },
            HRM_HR_ProfileLanguageLevel_Portal_Create_WaitingGrid_btnDel: {
                View: true
            }
        };
        configList = ConfigList.value;
        enumName = EnumName;
        screenName = ScreenName.LanguageLevelWaitConfirm;
        screenViewDetail = ScreenName.LanguageLevelWaitConfirmViewDetail;
        // const _configList = configList && configList['GeneralInfoAttendanceGrade'],
        //     renderRow = _configList && _configList[enumName.E_Row];

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
                                urlApi: '[URI_HR]/Hre_GetData/GetHre_ProfileProfileLanguageLevelByDataStatus_Add',
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
