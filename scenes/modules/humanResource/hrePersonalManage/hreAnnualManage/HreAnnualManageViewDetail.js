import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import { ScreenName } from '../../../../../assets/constant';

const configDefault = [
    {
        TypeView: 'E_GROUP_PROFILE',
        DisplayKey: 'ProfileNameViewNew',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'CodeEmp',
        DisplayKey: 'HRM_HR_Profile_CodeEmp',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'ProfileName',
        DisplayKey: 'HRM_HR_Profile_ProfileName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_COMPANY',
        DisplayKey: 'HRM_Hre_SignatureRegister_E_COMPANY',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_BRANCH',
        DisplayKey: 'HRM_Hre_SignatureRegister_E_BRANCH',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_UNIT',
        DisplayKey: 'HRM_Hre_SignatureRegister_E_UNIT',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_DIVISION',
        DisplayKey: 'HRM_Hre_SignatureRegister_E_DIVISION',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_DEPARTMENT',
        DisplayKey: 'HRM_Hre_SignatureRegister_E_DEPARTMENT',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_TEAM',
        DisplayKey: 'Group',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_SECTION',
        DisplayKey: 'HRM_HR_ReportProfileWaitingStopWorking_TeamName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'PositionName',
        DisplayKey: 'HRM_HR_Profile_PositionName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'JobTitleName',
        DisplayKey: 'HRM_HR_Profile_JobTitleName',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_HreAnnualManage_InfoDetail',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'MonthStartProfile',
        DisplayKey: 'HRM_Attendance_AnnualLeave_MonthStart',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'MonthYear',
        DisplayKey: 'HRM_Attendance_AnnualLeaveMonthByType_MonthYear',
        DataType: 'DateTime',
        DataFormat: 'MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'InitAvailable',
        DisplayKey: 'HRM_PortalApp_Total_RemainAnlBegining',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'RemainAnlBegining',
        DisplayKey: 'HRM_Att_ManageLeave_RemainAnlBegining',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'MonthResetInitAvailable',
        DisplayKey: 'HRM_Att_ManageLeave_MonthResetInitAvailable',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'InitSaveSickValue',
        DisplayKey: 'HRM_Att_ManageLeave_InitSaveSickValue',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SeniorBonus',
        DisplayKey: 'Hrm_AnnualLeave_SeniorBonus',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'LeaveInMonth',
        DisplayKey: 'HRM_Attendance_CompensationDetail_AvailbleInMonth',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalLeaveBef',
        DisplayKey: 'HRM_Attendance_CompensationDetail_TotalLeaveBef',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'AvailableInMonth',
        DisplayKey: 'HRM_Att_ManageLeave_AvailableInMonth',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Available',
        DisplayKey: 'HRM_PortalApp_Total_Leave',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Remain',
        DisplayKey: 'HRM_PortalApp_Remaining_Leave',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_HreAnnualManage_LeaveInMonth',
        DataType: 'string'
    }
];

export default class HreAnnualManageViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null
        };
    }

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail =
                    ConfigListDetail.value[ScreenName.HreAnnualManageViewDetail] != null
                        ? ConfigListDetail.value[ScreenName.HreAnnualManageViewDetail]
                        : configDefault;
            //let id = dataItem.ProfileID ? dataItem.ProfileID : dataItem.ID;
            if (dataItem) {
                this.setState({ configListDetail: _configListDetail, dataItem: dataItem });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    reload = () => {
        const { reloadScreenList } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');
        this.setState({ dataItem: null }, () => {
            this.getDataItem(true);
        });
    };

    componentDidMount() {
        this.getDataItem();
    }

    renderLeaveInMonth = () => {
        const { dataItem, configListDetail } = this.state;
        const arr = Array.apply(null, Array(12));
        return (
            <View>
                {arr.map((value, index) => {
                    let month = index + 1;
                    let col = {
                        TypeView: 'E_COMMON',
                        Name: 'Month' + month,
                        DisplayKey: 'Month' + month,
                        DataType: 'Double',
                        DataFormat: '#.###,##'
                    };
                    return Vnr_Function.formatStringTypeV3(dataItem, col, configListDetail);
                })}
            </View>
        );
    };

    render() {
        const { dataItem, configListDetail } = this.state,
            { containerItemDetail, contentScroll } = styleScreenDetail;

        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={contentScroll} showsVerticalScrollIndicator={false}>
                        <View style={containerItemDetail}>
                            {configListDetail.map(e => {
                                if (e.TypeView != 'E_COMMON_PROFILE')
                                    return Vnr_Function.formatStringTypeV3(dataItem, e, configListDetail);
                            })}

                            {this.renderLeaveInMonth()}
                        </View>
                    </ScrollView>
                </View>
            );
        } else if (dataItem == 'EmptyData') {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaViewDetail>
        );
    }
}
