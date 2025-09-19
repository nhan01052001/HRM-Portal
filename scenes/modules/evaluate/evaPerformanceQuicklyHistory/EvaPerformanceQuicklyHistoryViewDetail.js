import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../constants/styleConfig';
import Vnr_Function from '../../../../utils/Vnr_Function';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../components/EmptyData/EmptyData';
export default class EvaPerformanceQuicklyHistoryViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null
        };
    }
    //CodeEmp,ProfileName,
    //dot danh gia PerformancePlanName,
    //TemplateName - Bang dnah gia
    // loai danh gia - PerformanceTypeNameView
    // ngay danh gia - DateEvaluation
    // tieu chi - KPINameView
    // chi tieu Target
    // thuc dat - Actual
    // Score
    // Comment
    // EvaluatorName - nguoi danh gia
    // FileAttachView - file dinh kem
    getDataItem = (isReload = false) => {
        try {
            const _params = this.props.navigation.state.params,
                { dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = [
                    {
                        Name: 'CodeEmp',
                        DisplayKey: 'HRM_HR_Profile_CodeEmp',
                        DataType: 'string'
                    },
                    {
                        Name: 'ProfileName',
                        DisplayKey: 'HRM_HR_Profile_ProfileName',
                        DataType: 'string'
                    },
                    {
                        Name: 'PerformancePlanName',
                        DisplayKey: 'TemplateName',
                        DataType: 'string'
                    },
                    {
                        Name: 'PerformanceTypeNameView',
                        DisplayKey: 'HRM_HR_Contract_ContractEvaType',
                        DataType: 'string'
                    },
                    {
                        Name: 'DateEvaluation',
                        DisplayKey: 'HRM_Tas_Task_Evaluationdate',
                        DataType: 'datetime',
                        DataFormat: 'DD/MM/YYYY'
                    },
                    {
                        Name: 'KPINameView',
                        DisplayKey: 'Hrm_Sal_EvaluationOfSalaryApprove_Criteria',
                        DataType: 'string'
                    },
                    {
                        Name: 'Target',
                        DisplayKey: 'TagetNumber',
                        DataType: 'string'
                    },
                    {
                        Name: 'Actual',
                        DisplayKey: 'ResultNumber',
                        DataType: 'string'
                    },
                    {
                        Name: 'Score',
                        DisplayKey: 'TotalMark',
                        DataType: 'string'
                    },
                    {
                        Name: 'Times',
                        DisplayKey: 'FormOfCalculation__E_TIMES',
                        DataType: 'string'
                    },
                    {
                        Name: 'Comment',
                        DisplayKey: 'HRM_Category_EmployeeType_Notes',
                        DataType: 'string'
                    },
                    {
                        Name: 'EvaluatorName',
                        DisplayKey: 'HRM_Tas_Task_Evaluator',
                        DataType: 'string'
                    }
                ]; //ConfigListDetail.value[screenName];

            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                // HttpService.Post(`[URI_HR]/Att_GetData/GetTamScanLogRegisterById`, {
                //     id: !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID,
                //     screenName: screenName,
                //     uri: dataVnrStorage.apiConfig.uriHr
                // })
                //     .then(res => {
                //         console.log(res);
                //         if (!Vnr_Function.CheckIsNullOrEmpty(res)) {
                //             this.setState({ configListDetail: _configListDetail, dataItem: res });
                //         }
                //         else {
                //             this.setState({ dataItem: 'EmptyData' });
                //         }
                //     });
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
        this.getDataItem();
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
