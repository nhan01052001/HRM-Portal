import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { generateRowActionAndSelected, HreProcessingPostingPlanBusiness } from './HreProcessingPostingPlanBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';

const configDefault = [
    {
        'TypeView': 'E_GROUP',
        'DisplayKey': 'HRM_PortalApp_HreInfomationPlan',
        'DataType': 'string',
        'isCollapse': true
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'StatusView',
        'DisplayKey': 'HRM_Attendance_Overtime_OvertimeList_Status',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'TitlePosting',
        'DisplayKey': 'HRM_PortalApp_PostingPlan_JobPostingTitle',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'JobVacancyNameList',
        'DisplayKey': 'HRM_PortalApp_HreProcessingPostingPlan_EmployeeTypeName',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'NumberOfRecruitment',
        'DisplayKey': 'HRM_PortalApp_HreProcessingPostingPlan_QuantityRecruitment',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'EffectiveDateFrom',
        'NameSecond': 'EffectiveDateTo',
        'DisplayKey': 'HRM_PortalApp_HreProcessingPostingPlan_ExpectedDate',
        'DataType': 'DateToFrom',
        'DataFormat': 'DD/MM/YYYY'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'PostingDateFrom',
        'NameSecond': 'PostingDateTo',
        'DisplayKey': 'HRM_PortalApp_HreProcessingPostingPlan_EffectiveDate',
        'DataType': 'DateToFrom',
        'DataFormat': 'DD/MM/YYYY'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'SourceAdsNameList',
        'DisplayKey': 'HRM_PortalApp_HreProcessingPostingPlan_ChannelRecruiment',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_GROUP',
        'DisplayKey': 'HRM_PortalApp_HreRecruitmentProposalProcessing_General',
        'DataType': 'string',
        'isCollapse': true
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'EmploymentTypeView',
        'DisplayKey': 'HRM_PortalApp_HreProcessingPostingPlan_EmploymentTypeView',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'SubMajorNameList',
        'DisplayKey': 'HRM_PortalApp_HreProcessingPostingPlan_SubMajorNameList',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'Age',
        'DisplayKey': 'HRM_PortalApp_HreProcessingJobPosting_Age',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'GenderViewList',
        'DisplayKey': 'HRM_PortalApp_HreRecruitmentProposalProcessing_GenderView',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'Experience',
        'DisplayKey': 'HRM_PortalApp_HreProcessingPostingPlan_Experience',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'EmployeeTypeNameOnly',
        'DisplayKey': 'HRM_PortalApp_HreProcessingPostingPlan_EmployeeTypeNameOnly',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'IndustryNameList',
        'DisplayKey': 'HRM_PortalApp_HreProcessingPostingPlan_IndustryNameList',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'LocationNameList',
        'DisplayKey': 'HRM_PortalApp_HreRecruitment_Workplace',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_GROUP',
        'Name': 'Description',
        'DisplayKey': 'HRM_PortalApp_Description_Infomation',
        'DataType': 'E_HTML'
    },
    {
        'TypeView': 'E_GROUP_APPROVE',
        'DisplayKey': 'HRM_PortalApp_Approval_Process',
        'DataType': 'string',
        'isCollapse': true
    }
];

export default class HreProcessingPostingPlanViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            configJobVacancy: null,
            dataRowActionAndSelected: generateRowActionAndSelected(ScreenName.HreWaitProcessingPostingPlan),
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
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[screenName]
                    ? ConfigListDetail.value[screenName]
                    : configDefault;

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;
            if (id) {
                const response = await HttpService.Get(
                    `[URI_CENTER]/api/Rec_JobPostingPlan/GetJobPostingPlanDetailByID?ID=${id}`
                );

                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = { ...response.Data, ...response.Data?.DataJobPostingPlan[0], ...response.Data?.GeneralJobPostingPlan[0] };

                    data.itemStatus = Vnr_Services.formatStyleStatusApp(data.Status);
                    data.BusinessAllowAction = Vnr_Services.handleStatusApprove(data.Status, dataItem?.TypeApprove);
                    if (data.Status === 'E_WAIT_APPROVED') {
                        let arr = data.BusinessAllowAction.split(',');
                        arr.push('E_REQUEST_CHANGE');
                        data.BusinessAllowAction = arr.join(',');
                    }

                    const _listActions = await this.rowActionsHeaderRight(data);
                    this.setState({
                        configListDetail: _configListDetail,
                        dataItem: data,
                        listActions: _listActions
                    });
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

    reload = (E_KEEP_FILTER, actionIsDelete) => {
        const { reloadScreenList } = this.props.navigation.state.params;

        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');

        //nếu action = Delete => back về danh sách
        if (actionIsDelete) {
            DrawerServices.navigate('AttSubmitTakeLeaveDay');
        } else {
            this.setState({ dataItem: null }, () => {
                this.getDataItem(true);
            });
        }
    };

    componentDidMount() {
        HreProcessingPostingPlanBusiness.setThisForBusiness(this);
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
                            {configListDetail.map((e) => {
                                if (e.TypeView != 'E_COMMON_PROFILE')
                                    return Vnr_Function.formatStringTypeV3(dataItem, e, configListDetail);
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
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaViewDetail>
        );
    }
}
