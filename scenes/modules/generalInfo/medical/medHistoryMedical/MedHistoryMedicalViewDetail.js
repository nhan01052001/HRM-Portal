import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import { generateRowActionAndSelected, MedHistoryMedicalBusinessFunction } from './MedHistoryMedicalBusiness';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import DrawerServices from '../../../../../utils/DrawerServices';

const configDefault = [
    {
        Name: 'HRM_Medical_ImmunizationRecord_CodeEmp',
        DisplayKey: 'HRM_HR_Profile_CodeEmp',
        DataType: 'string'
    },
    {
        Name: 'ProfileName',
        DisplayKey: 'HRM_Medical_ImmunizationRecord_ProfileName',
        DataType: 'string'
    },
    {
        Name: 'Gender',
        DisplayKey: 'HRM_Medical_ImmunizationRecord_Gender',
        DataType: 'string'
    },
    {
        Name: 'OrgStructureName',
        DisplayKey: 'HRM_Medical_ImmunizationRecord_OrgStructureName',
        DataType: 'string'
    },
    {
        Name: 'InjectionDate',
        DisplayKey: 'HRM_Medical_ImmunizationRecord_InjectionDate',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'Vaccine',
        DisplayKey: 'HRM_Medical_ImmunizationRecord_MedicineName',
        DataType: 'string'
    },
    {
        Name: 'DiseaseName',
        DisplayKey: 'HRM_Medical_ImmunizationRecord_DiseaseName',
        DataType: 'string'
    },
    {
        Name: 'InjectionStatusView',
        DisplayKey: 'HRM_Medical_ImmunizationRecord_InjectionStatusView',
        DataType: 'string'
    },
    {
        Name: 'InjectionNo',
        DisplayKey: 'HRM_Medical_ImmunizationRecord_InjectionNo_Portal',
        DataType: 'string'
    },
    {
        Name: 'ImmunizationOrganization',
        DisplayKey: 'HRM_Medical_ImmunizationRecord_ImmunizationOrganization',
        DataType: 'string'
    },
    {
        Name: 'HealthNote1',
        DisplayKey: 'HealthNote1',
        DataType: 'string'
    },
    {
        Name: 'HealthNote2',
        DisplayKey: 'HealthNote2',
        DataType: 'string'
    },
    {
        Name: 'InjectionPlace',
        DisplayKey: 'HRM_Medical_ImmunizationRecord_InjectionPlace',
        DataType: 'string'
    }
];

export default class MedHistoryMedicalViewDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: generateRowActionAndSelected(),
            listActions: this.resultListActionHeader()
        };
    }

    resultListActionHeader = () => {
        const _params = this.props.navigation.state.params;
        if (_params && _params.listActions && Array.isArray(_params.listActions)) {
            return _params.listActions;
        }
        return [];
    };

    rowActionsHeaderRight = dataItem => {
        let _listActions = [];
        const { rowActions } = this.state.dataRowActionAndSelected;

        if (
            !Vnr_Function.CheckIsNullOrEmpty(rowActions) &&
            !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction)
        ) {
            _listActions = rowActions.filter(item => {
                return dataItem.BusinessAllowAction.indexOf(item.type) >= 0;
            });
        }
        return _listActions;
    };

    getDataItem = async (isReload = false) => {
        try {
            const _params = this.props.navigation.state.params,
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail =
                    ConfigListDetail.value[screenName] != null ? ConfigListDetail.value[screenName] : configDefault;
            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;
            if (id) {
                const response = await HttpService.Get(`[URI_HR]/api/Med_HistoryMedical?ID=${id}`);
                const _listActions = await this.rowActionsHeaderRight(response);
                if (!Vnr_Function.CheckIsNullOrEmpty(response)) {
                    this.setState({
                        configListDetail: _configListDetail,
                        dataItem: response,
                        listActions: _listActions
                    });
                } else {
                    this.setState({ dataItem: 'EmptyData' });
                }
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                this.setState({ configListDetail: _configListDetail, dataItem });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    reload = (E_KEEP_FILTER, actionIsDelete) => {
        const { reloadScreenList } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');
        //nếu action = Delete => back về danh sách
        if (actionIsDelete) {
            DrawerServices.navigate('MedHistoryMedical');
        } else {
            this.getDataItem(true);
        }
    };

    componentDidMount() {
        MedHistoryMedicalBusinessFunction.setThisForBusiness(this, true);
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, listActions } = this.state,
            { itemContent, containerItemDetail, textLableInfo, bottomActions } = styleScreenDetail;

        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={{ flexGrow: 1 }}>
                        <View style={containerItemDetail}>
                            {configListDetail.map(e => {
                                return Vnr_Function.formatStringTypeV2(dataItem, e);
                            })}
                        </View>
                    </ScrollView>
                    {Array.isArray(listActions) && listActions.length > 0 && (
                        <View style={bottomActions}>
                            <ListButtonMenuRight listActions={listActions} dataItem={dataItem} />
                        </View>
                    )}
                </View>
            );
        } else if (dataItem == 'EmptyData') {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaView>
        );
    }
}
