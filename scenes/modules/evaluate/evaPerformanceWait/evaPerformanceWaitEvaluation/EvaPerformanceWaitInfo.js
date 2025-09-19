import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import { EvaPerformanceWaitBusinessFunction } from '../EvaPerformanceWaitBusiness';
export default class EvaPerformanceWaitInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null
        };
    }

    getDataItem = (isReload = false) => {
        try {
            const _params = this.props.navigation.state.params,
                { dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = [
                    {
                        Name: 'ProfileName',
                        DisplayKey: 'ProfileName',
                        DataType: 'string'
                    },
                    {
                        Name: 'JobTitleNameOfProfile',
                        DisplayKey: 'HRM_HR_Profile_JobTitleName',
                        DataType: 'string'
                    },
                    {
                        Name: 'OrgStructureNameOfProfile',
                        DisplayKey: 'HRM_HR_Profile_OrgStructureName',
                        DataType: 'string'
                    },

                    {
                        Name: 'PerformanceTypeName',
                        DisplayKey: 'PerformanceTypeName',
                        DataType: 'string'
                    },
                    {
                        Name: 'PerformancePlanName',
                        DisplayKey: 'PerformancePlanName',
                        DataType: 'string'
                    },
                    {
                        Name: 'TemplateName',
                        DisplayKey: 'PerformanceTemplateName',
                        DataType: 'string'
                    },
                    {
                        Name: 'DatePerformOfProfile',
                        DisplayKey: 'HRM_Tas_Task_Evaluationdate',
                        DataType: 'datetime',
                        DataFormat: 'DD/MM/YYYY'
                    },
                    {
                        Name: 'DateCompletedAppraisal',
                        DisplayKey: 'DateCompletedAppraisal',
                        DataType: 'datetime',
                        DataFormat: 'DD/MM/YYYY'
                    },

                    {
                        Name: 'PerformancePlanName',
                        DisplayKey: 'PerformancePlanName',
                        DataType: 'string'
                    },
                    {
                        Name: 'TemplateName',
                        DisplayKey: 'PerformanceTemplateName',
                        DataType: 'string'
                    },

                    {
                        Name: 'TotalMark',
                        DisplayKey: 'E_Result',
                        DataType: 'string'
                    }
                ]; ///ConfigListDetail.value[screenName];

            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                HttpService.Get('[URI_POR]/New_PersonalWaitingEvaluation/GetById?ID=' + dataItem.ID).then((res) => {
                    EvaPerformanceWaitBusinessFunction.checkForLoadEditDelete.EvaPerformanceWaitEvaluation = false;
                    if (!Vnr_Function.CheckIsNullOrEmpty(res)) {
                        this.setState({ configListDetail: _configListDetail, dataItem: res });
                    } else {
                        this.setState({ dataItem: 'EmptyData' });
                    }
                });
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                this.setState({ configListDetail: _configListDetail, dataItem });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    componentDidMount() {
        this.getDataItem(true);
    }

    render() {
        const { dataItem, configListDetail } = this.state,
            { containerItemDetail } = styleScreenDetail;

        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={[styleSheets.col_10]}>
                    <ScrollView>
                        <View style={containerItemDetail}>
                            {configListDetail.map((e) => {
                                return Vnr_Function.formatStringTypeV2(dataItem, e);
                            })}
                        </View>
                    </ScrollView>
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
