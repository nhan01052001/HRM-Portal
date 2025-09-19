import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import EvaPerformanceEvaDataResultV3List from './evaPerformanceEvaDataResultV3List/EvaPerformanceEvaDataResultV3List';
import VnrFilterCommon from '../../../../components/VnrFilter/VnrFilterCommon';
import { styleSheets, styleSafeAreaView } from '../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import { ScreenName, EnumName } from '../../../../assets/constant';
import { translate } from '../../../../i18n/translate';
import DrawerServices from '../../../../utils/DrawerServices';

export default class EvaPerformanceEvaDataResultV3 extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            dataBody: null
        };
        this.storeParamsDefault = null;
        //biến lưu lại object filter
        this.paramsFilter = null;
    }

    paramsDefault = () => {
        let _params = {
            UserSubmit: dataVnrStorage.currentUser.info.ProfileID,
            IsPortal: true,
            sort: [
                {
                    dir: 'desc',
                    field: 'DateUpdate'
                }
            ],
            strEvaluatorID: dataVnrStorage.currentUser.info.ProfileID
        };
        return {
            dataBody: _params
        };
    };

    reload = (paramsFilter) => {
        if (paramsFilter === 'E_KEEP_FILTER') {
            paramsFilter = { ...this.paramsFilter };
        } else {
            this.paramsFilter = { ...paramsFilter };
        }

        let _paramsDefault = this.storeParamsDefault;
        _paramsDefault = {
            ..._paramsDefault,
            dataBody: { ..._paramsDefault.dataBody, ...paramsFilter }
        };
        this.setState(_paramsDefault);
    };

    componentDidMount() {
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);
    }

    businessEdit = (items) => {
        if (Array.isArray(items) && items.length > 0) {
            DrawerServices.navigate('EvaPerformanceEvaDataResultV3Edit', {
                listDataEdit: items,
                reloadList: this.reload
            });
        }
    };

    render() {
        const { dataBody } = this.state,
            _rowActions = [
                {
                    title: translate('HRM_System_Resource_Sys_Edit'),
                    type: EnumName.E_MODIFY,
                    onPress: (item, dataBody) => this.businessEdit([{ ...item }], dataBody)
                }
            ],
            _selected = [
                {
                    title: translate('HRM_System_Resource_Sys_Edit'),
                    type: EnumName.E_MODIFY,
                    onPress: (items, dataBody) => this.businessEdit(items, dataBody)
                }
            ];
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>
                    <VnrFilterCommon
                        screenName={ScreenName.EvaPerformanceEvaDataResultV3}
                        //screenName={ScreenName.EvaPerformanceQuicklyHistory}
                        onSubmitEditing={this.reload}
                    />
                    <View style={[styleSheets.col_10]}>
                        {dataBody && (
                            <EvaPerformanceEvaDataResultV3List
                                api={{
                                    urlApi: '[URI_HR]/Eva_GetData/GetDataPerformanceEvaDataResultV3_Portal',
                                    type: 'E_POST',
                                    dataBody: dataBody
                                }}
                                detail={{
                                    dataLocal: false,
                                    screenName: ScreenName.EvaPerformanceEvaDataResultV3,
                                    screenDetail: ScreenName.EvaPerformanceEvaDataResultV3Detail
                                }}
                                valueField="ID"
                                rowActions={_rowActions}
                                selected={_selected}
                            />
                        )}
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
