import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import {
    generateRowActionAndSelected,
    AttApproveBackWorkBeforeMaternityBusinessFunction
} from './AttApproveBackWorkBeforeMaternityBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { EnumName } from '../../../../../assets/constant';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import { ScreenName } from '../../../../../assets/constant';

const configDefault = [
    {
        TypeView: 'E_STATUS',
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP_PROFILE',
        DisplayKey: 'HRM_PortalApp_Subscribers',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_COMPANY',
        DisplayKey: 'E_COMPANY',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_BRANCH',
        DisplayKey: 'E_BRANCH',
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
        DisplayKey: 'HRM_HR_Profile_OrgStructureName',
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
        DisplayKey: 'E_SECTION',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'JobTitleName',
        DisplayKey: 'HRM_HR_Profile_JobTitleName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'PositionName',
        DisplayKey: 'HRM_HR_Profile_PositionName',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_BackWorkBeforeMaternity_Leaveinformation',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'RegisterDate',
        DisplayKey: 'HRM_PortalApp_BackWorkBeforeMaternity_WorkDate',
        DataType: 'DateToFrom',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'BackWorkReasonName',
        DisplayKey: 'HRM_PortalApp_BackWorkBeforeMaternity_Reason',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Note',
        DisplayKey: 'HRM_PortalApp_BackWorkBeforeMaternity_Note',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_BackWorkBeforeMaternity_Attachments',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'FileAttachment',
        DisplayKey: '',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_GROUP_APPROVE',
        DisplayKey: 'HRM_HRE_Concurrent_ApproveHistory',
        DataType: 'string'
    }
];

export default class AttApproveBackWorkBeforeMaternityViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: generateRowActionAndSelected(ScreenName.AttApproveBackWorkBeforeMaternity),
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

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = configDefault;//ConfigListDetail.value[screenName] != null ? ConfigListDetail.value[screenName] : configDefault;

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;

            if (id) {
                const response = await HttpService.Get(
                    `[URI_CENTER]/api/Att_BackWorkBeforeMaternity/GetDetailBackWorkBeforeMaternityById?ID=${id}`
                );

                const getDetailConfig = await Vnr_Function.HandleConfigListDetailATT(
                    _configListDetail,
                    'Detail_Approve_BackWorkBeforeMaternity'
                );

                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = response.Data;
                    data = { ...data, ...data.SingleWordDetail[0] };
                    data.BusinessAllowAction = Vnr_Services.handleStatusApprove(data.Status, data?.TypeApprove);
                    data.itemStatus = Vnr_Services.formatStyleStatusApp(data.Status);
                    data.FileAttachment = ManageFileSevice.setFileAttachApp(data.FileAttachment);

                    const _listActions = await this.rowActionsHeaderRight(data);
                    this.setState({ configListDetail: getDetailConfig, dataItem: data, listActions: _listActions });
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

    reload = () => {
        const { reloadScreenList } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');
        //this.getDataItem(true);
    };

    componentDidMount() {
        AttApproveBackWorkBeforeMaternityBusinessFunction.setThisForBusiness(this);
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, listActions } = this.state,
            { containerItemDetail, bottomActions } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={CustomStyleSheet.flexGrow(1)}>
                        <View style={containerItemDetail}>
                            {configListDetail.map(e => {
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
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaView>
        );
    }
}


