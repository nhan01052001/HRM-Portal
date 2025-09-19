import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleSafeAreaView, styleContentFilterDesign } from '../../../../../constants/styleConfig';
import HreStopWorkingList from '../hreStopWorkingList/HreStopWorkingList';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName } from '../../../../../assets/constant';
import { generateRowActionAndSelected, HreSubmitStopWorkingBusinessFunction } from './HreSubmitStopWorkingBusiness';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import HttpService from '../../../../../utils/HttpService';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { VnrBtnCreate } from '../../../../../componentsV3/VnrBtnCreate/VnrBtnCreate';

let configList = null,
    enumName = null,
    hreSubmitStopWorking = null,
    hreSubmitStopWorkingViewDetail = null;

export default class HreSubmitStopWorking extends Component {
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

    onCreate = () => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Hre_GetData/GetMultiProfileActiveStopWorking', { text: '' }).then((data) => {
            VnrLoadingSevices.hide();

            const { ProfileID } = dataVnrStorage.currentUser.info;
            if (data) {
                let itemProfile = data.find((item) => item.ID == ProfileID);

                if (itemProfile) {
                    this.props.navigation.navigate('HreSubmitStopWorkingAddOrEdit', { reload: () => this.reload() });
                } else {
                    ToasterSevice.showWarning('HRM_HR_Profile_Has_Register_StopWorking');
                }
            } else {
                this.props.navigation.navigate('HreSubmitStopWorkingAddOrEdit', { reload: () => this.reload() });
            }
        });
    };

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
        const _configList = configList[hreSubmitStopWorking],
            //renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order];

        const dataRowActionAndSelected = generateRowActionAndSelected();
        let _params = {
            IsPortal: true,
            sort: orderBy
            //ProfileID: dataVnrStorage.currentUser.info.ProfileID
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
        hreSubmitStopWorking = ScreenName.HreSubmitStopWorking;
        hreSubmitStopWorkingViewDetail = ScreenName.HreSubmitStopWorkingViewDetail;

        HreSubmitStopWorkingBusinessFunction.setThisForBusiness(this, false);

        let _paramsDefault = this.paramsDefault();

        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);
    }

    render() {
        const { dataBody, rowActions, selected } = this.state;
        return (
            <SafeAreaView {...styleSafeAreaView} forceInset={{ top: 'never' }}>
                {hreSubmitStopWorking && hreSubmitStopWorkingViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <VnrFilterCommon
                            style={styleContentFilterDesign}
                            screenName={hreSubmitStopWorking}
                            onSubmitEditing={this.reload}
                        />

                        <View style={[styleSheets.col_10]}>
                            {dataBody && (
                                <HreStopWorkingList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: hreSubmitStopWorkingViewDetail,
                                        screenName: hreSubmitStopWorking
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    api={{
                                        urlApi: '[URI_HR]/Hre_GetData/NewPortalGetStopWorkingPersonal',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: 20
                                    }}
                                    valueField="ID"
                                />
                            )}
                        </View>

                        {PermissionForAppMobile &&
                            PermissionForAppMobile.value['New_Hre_PersonalSubmitStopWorking_New_Index_Portal'] &&
                            PermissionForAppMobile.value['New_Hre_PersonalSubmitStopWorking_New_Index_Portal'][
                                'Create'
                            ] && <VnrBtnCreate onAction={() => this.onCreate()} />}
                    </View>
                )}
            </SafeAreaView>
        );
    }
}
