import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import { styleSafeAreaView } from '../../../../constants/styleConfig';
import VnrChartGroup from '../../../../components/VnrChartGroup/VnrChartGroup';
import { ConfigChart } from '../../../../assets/configProject/ConfigChart';

export default class ChReportDynamic extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //New_ChartsReportDynamic_New_Index_Portal

    render() {
        // eslint-disable-next-line no-unused-vars
        const configEmployeeAge = ConfigChart.value['ChQualificationTrainee'],
            api = {
                url: 'https://pehn.vnresource.net:8804/Sys_GetData/GetReportContentReportDynamicSQL',
                data: {
                    PivotTableID: 'db0bd93e-7f58-404b-90a1-2a372976b70b'
                }
            };
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <VnrChartGroup api={api} groupFeild={'E_DIVISION'} categoryFeild={'Status'} />
            </SafeAreaView>
        );
    }
}
