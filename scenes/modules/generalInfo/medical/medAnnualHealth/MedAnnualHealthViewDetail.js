import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import { generateRowActionAndSelected, MedAnnualHealthBusinessFunction } from './MedAnnualHealthBusiness';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import DrawerServices from '../../../../../utils/DrawerServices';

const configDefault = [
    {
        Name: 'CodeEmp',
        DisplayKey: 'HRM_Medical_AnnualHealth_CodeEmp',
        DataType: 'string'
    },
    {
        Name: 'ProfileName',
        DisplayKey: 'HRM_Medical_AnnualHealth_ProfileName',
        DataType: 'string'
    },
    {
        Name: 'OrgStructureName',
        DisplayKey: 'HRM_Medical_AnnualHealth_OrgStructureName',
        DataType: 'string'
    },
    {
        Name: 'DateReceived',
        DisplayKey: 'HRM_Medical_AnnualHealth_DateReceived',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'AnnualHealthTimeName',
        DisplayKey: 'HRM_Medical_AnnualHealthForDetail_TimeTitle',
        DataType: 'string'
    },
    {
        Name: 'TypeResultHealthName',
        DisplayKey: 'HRM_Medical_AnnualHealth_TypeResultHealthName',
        DataType: 'string'
    },
    {
        Name: 'Result',
        DisplayKey: 'HRM_Medical_AnnualHealth_Result',
        DataType: 'string'
    },
    {
        Name: 'CutOffDurationName',
        DisplayKey: 'HRM_Medical_AnnualHealth_CutOffDurationName',
        DataType: 'string'
    },
    {
        Name: 'DiseaseName',
        DisplayKey: 'HRM_Medical_ImmunizationRecord_DiseaseName',
        DataType: 'string'
    },
    {
        Name: 'Cost',
        DisplayKey: 'HRM_Medical_AnnualHealth_Cost',
        DataType: 'string'
    },
    {
        Name: 'CurrencyName',
        DisplayKey: 'CurrencyName',
        DataType: 'string'
    },
    {
        Name: 'Height',
        DisplayKey: 'HRM_Medical_AnnualHealth_Height',
        DataType: 'string'
    },
    {
        Name: 'Weight',
        DisplayKey: 'HRM_Medical_AnnualHealth_Weight',
        DataType: 'string'
    },
    {
        Name: 'BloodType',
        DisplayKey: 'AnnualHealthBloodType',
        DataType: 'string'
    },
    {
        Name: 'BMI',
        DisplayKey: 'HRM_Medical_AnnualHealthSearch_BMI',
        DataType: 'string'
    },
    {
        Name: 'StatusView',
        DisplayKey: 'HRM_Medical_AnnualHealth_Status',
        DataType: 'string'
    },
    {
        Name: 'Note',
        DisplayKey: 'HRM_Medical_AnnualHealth_Note',
        DataType: 'string'
    },
    {
        Name: 'Diagnostic',
        DisplayKey: 'HRM_Medical_AnnualHealth_Diagnostic',
        DataType: 'string'
    },
    {
        Name: 'MedicalAdvice',
        DisplayKey: 'HRM_Medical_AnnualHealth_MedicalAdvice',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttach',
        DisplayKey: 'HRM_Medical_AnnualHealth_Attachment',
        DataType: 'FileAttach'
    }
];

export default class MedAnnualHealthViewDetail extends Component {
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
                const response = await HttpService.Get(`[URI_HR]/api/Med_AnnualHealth?ID=${id}`);
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
            DrawerServices.navigate('MedAnnualHealth');
        } else {
            this.getDataItem(true);
        }
    };

    componentDidMount() {
        MedAnnualHealthBusinessFunction.setThisForBusiness(this, true);
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
