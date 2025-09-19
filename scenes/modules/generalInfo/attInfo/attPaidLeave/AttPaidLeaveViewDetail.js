import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import VnrText from '../../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import DrawerServices from '../../../../../utils/DrawerServices';

const configDefault = [
    {
        Name: 'MonthYear',
        DisplayKey: 'HRM_Attendance_AttendanceTable_MonthYear',
        DataType: 'DateTime',
        DataFormat: 'MM/YYYY'
    },
    {
        Name: 'ChildName',
        DisplayKey: 'HRM_Attendance_Pregnancy_ChildName',
        DataType: 'string'
    },
    {
        Name: 'ChildDOB',
        DisplayKey: 'HRM_Insurance_InsuranceRecord_DateSuckle',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'MonthReset',
        DisplayKey: 'RM_Attendance_PregnantLeaveDetail_UsedToMonthFrom',
        DataType: 'DateTime',
        DataFormat: 'MM/YYYY'
    },
    {
        Name: 'LeaveAvailableInMonth',
        DisplayKey: 'HRM_Attendance_AnnualDetail_LeaveAvailableInMonth',
        DataType: 'string'
    },
    {
        Name: 'LeaveInMonth',
        DisplayKey: 'HRM_Attendance_AnnualDetail_LeaveInMonth',
        DataType: 'string'
    },
    {
        Name: 'Available',
        DisplayKey: 'HRM_Attendance_AnnualDetail_Available',
        DataType: 'string'
    },
    {
        Name: 'TotalLeaveBef',
        DisplayKey: 'HRM_Attendance_AnnualDetail_TotalLeaveBef',
        DataType: 'string'
    },
    {
        Name: 'Remain',
        DisplayKey: 'HRM_Attendance_AnnualDetail_Remain',
        DataType: 'string'
    }
];

export default class AttPaidLeaveViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null
        };
    }

    getDataItem = async (isReload = false) => {
        try {
            const _params = this.props.navigation.state.params,
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail =
                    ConfigListDetail.value[screenName] != null ? ConfigListDetail.value[screenName] : configDefault;
            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                // Không cần làm gì trong trường hợp này
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
        //detail
        const { reloadScreenList } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');

        //nếu action = Delete => back về danh sách
        if (actionIsDelete) {
            DrawerServices.navigate('AttSubmitLeaveDay');
        } else {
            this.getDataItem(true);
        }
    };

    componentDidMount() {
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail } = this.state,
            { itemContent, containerItemDetail, textLableInfo } = styleScreenDetail;

        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={CustomStyleSheet.flexGrow(1)}>
                        <View style={containerItemDetail}>
                            {configListDetail.map((e) => {
                                return (
                                    <View key={e.Label} style={itemContent}>
                                        <View style={styleSheets.viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={e.DisplayKey}
                                                value={e.DisplayKey}
                                            />
                                        </View>
                                        <View style={styleSheets.viewControl}>
                                            {Vnr_Function.formatStringType(dataItem, e)}
                                        </View>
                                    </View>
                                );
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
