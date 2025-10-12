import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../utils/Vnr_Function';
// import {
//     generateRowActionAndSelected,
//     AttSubmitWorkingOvertimeBusinessFunction
// } from './AttSubmitWorkingOvertimeBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';


export default class HreRecruitmentProposal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: [], //generateRowActionAndSelected(this.props.navigation.state.params?.screenName),
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

    rowActionsHeaderRight = (dataItem) => {
        let _listActions = [];
        const { rowActions } = this.state.dataRowActionAndSelected;

        if (
            !Vnr_Function.CheckIsNullOrEmpty(rowActions) &&
            !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction)
        ) {
            _listActions = rowActions.filter((item) => {
                return dataItem.BusinessAllowAction.indexOf(item.type) >= 0;
            });
        }
        return _listActions;
    };

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;
            if (id) {
                const response = [
                    {
                        'RoundInterviewView': 'Vòng phỏng vấn 1 (Đạt phỏng vấn)',
                        'InterviewSchedule': '06:04 - 09:00, 26/07/2024',
                        'Status': 'Trạng thái của vòng (E_PASS, E_WAITCONFIRMSCHEDULE, E_WAITINTERVIEW)',
                        'ListInterviewer': [
                            {
                                'ImagePath': 'Profile_ab3b9c3d-9723-4187-b355-c53e83c89f1c.png',
                                'ProfileName': 'NGUYỄN THỊ MỸ LINH',
                                'CodeEmp': '21110039',
                                'PositionName': 'Công Nhân',
                                'ID': '3eedac3a-7064-46e6-ae68-bfc8329cb1d6'
                            }
                        ],
                        'ListInterviewResultDetail': [
                            {
                                'ID': 'e76455bc-8f0d-43cf-a602-4de151bcbfe0',
                                'InterviewerID': '3eedac3a-7064-46e6-ae68-bfc8329cb1d6', //(Kết quả chung thì không có dữ liệu này)
                                'InterviewerName': 'NGUYỄN THỊ MỸ LINH', //(Kết quả chung thì không có dữ liệu này)
                                'ImagePath': 'Profile_ab3b9c3d-9723-4187-b355-c53e83c89f1c.png', //(Kết quả chung thì không có dữ liệu này)
                                'ResultInterviewView': 'Đạt',
                                'RatingAchievedView': 'Tốt',
                                'Knowledge': 'Kiến thức',
                                'Skill': 'Kỹ năng',
                                'WorkAttitude': 'Thái độ',
                                'Competency': 'Năng lực',
                                'LeaderShip': 'Lãnh đạo',
                                'Management': 'Quản trị',
                                'Professional': 'Chuyên môn',
                                'CareerObjective': 'Mục tiêu nghề nghiệp',
                                'HealthStatus': 'Sức khỏe',
                                'Strengths': 'Điểm mạnh',
                                'Weaknesses': 'Điểm yếu',
                                'ResultNote': 'Nhận xét chung',
                                'TypeSalaryView': 'Gross',
                                'ProposedSalary': 12315454,
                                'CurrencyName': 'VND',
                                'EnteringDate': '2024-07-25T17:00:00Z',
                                'FileAttachment': 'API_QuyetToanThue1721993371287.xlsx',
                                'IsInputResult': false //(Có hiện nút nhập kết quả hay không)
                            }
                        ]
                    }
                ];
                // await HttpService.Post(
                //     '[URI_CENTER]Rec_Interview/GetInfoInterviewDetail',
                //     {
                //         CandidateID: id,
                //         IsGeneral: false
                //     }
                // );

                if (response && response.length > 0) {
                    //let data = { ...response.Data, ...response.Data.SingleWordDetail[0] };
                    // data.BusinessAllowAction = Vnr_Services.handleStatus(
                    //     data.Status,
                    //     dataItem?.SendEmailStatus ? dataItem?.SendEmailStatus : false
                    // );

                    const _listActions = await this.rowActionsHeaderRight(dataItem);
                    this.setState({ dataItem: response, listActions: _listActions });
                } else {
                    this.setState({ dataItem: 'EmptyData' });
                }
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    componentDidMount() {
        // AttSubmitWorkingOvertimeBusinessFunction.setThisForBusiness(this);
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, listActions } = this.state,
            { containerItemDetail, contentScroll, bottomActions } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={contentScroll} showsVerticalScrollIndicator={false}>
                        <View style={containerItemDetail}>

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
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaViewDetail>
        );
    }
}
