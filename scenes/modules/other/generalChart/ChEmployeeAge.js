import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import { styleSafeAreaView } from '../../../../constants/styleConfig';
import VnrChartPie from '.././../../../components/VnrChartPie/VnrChartPie';
import { ConfigChart } from '../../../../assets/configProject/ConfigChart';

export default class ChEmployeeAge extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const configEmployeeAge = ConfigChart.value['ChEmployeeAge'],
            { api } = configEmployeeAge;
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <VnrChartPie api={api} groupFeild={'DoTuoi'} />
            </SafeAreaView>
        );
    }
}
