import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import { styleSafeAreaView } from '../../../../constants/styleConfig';
import VnrChartGroup from '../../../../components/VnrChartGroup/VnrChartGroup';
import { ConfigChart } from '../../../../assets/configProject/ConfigChart';

export default class ChQualificationTrainee extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const configEmployeeAge = ConfigChart.value['ChQualificationTrainee'],
            { api } = configEmployeeAge;
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <VnrChartGroup api={api} groupFeild={'QualificationName'} categoryFeild={'E_BRANCH_CODE'} />
            </SafeAreaView>
        );
    }
}
