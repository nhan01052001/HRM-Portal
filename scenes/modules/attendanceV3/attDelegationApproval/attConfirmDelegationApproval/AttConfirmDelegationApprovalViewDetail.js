import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import {
    generateRowActionAndSelected,
    AttConfirmDelegationApprovalBusiness
} from './AttConfirmDelegationApprovalBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import { translate } from '../../../../../i18n/translate';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';

const configDefault = [
    {
        TypeView: 'E_GROUP_PROFILE',
        DisplayKey: 'HRM_PortalApp_AuthorizedPerson',
        DataType: 'string',
        isCollapse: true
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
        DisplayKey: 'HRM_PortalApp_AuthorizationDetails',
        DataType: 'string',
        isCollapse: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DataTypeDelegateView',
        DisplayKey: 'HRM_PortalApp_Expertise',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateFrom',
        NameSecond: 'DateTo',
        DisplayKey: 'HRM_PortalApp_Authorizationeriod',
        DataType: 'DateToFrom',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Note',
        DisplayKey: 'Note',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'FileAttachment',
        DisplayKey: '',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_HRE_Concurrent_ApproveHistory',
        DataType: 'string',
        isCollapse: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'UserName',
        DisplayKey: 'HRM_PortalApp_Requester',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ConfirmUserName',
        DisplayKey: 'HRM_PortalApp_PITFinalization_Confirmator',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'RejectUserName',
        DisplayKey: 'HRM_PortalApp_Rejecter',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CancelUserName',
        DisplayKey: 'HRM_PortalApp_Canceller',
        DataType: 'string'
    }
];

export default class AttConfirmDelegationApprovalViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: generateRowActionAndSelected(ScreenName.AttConfirmDelegationApproval),
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
                { dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[ScreenName.AttConfirmDelegationApproval]
                    ? ConfigListDetail.value[ScreenName.AttConfirmDelegationApproval]
                    : configDefault;

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;
            if (id) {
                const response = await HttpService.Post('[URI_HR]/Att_GetData/New_GetDelegateApproveList', {
                    SelectedIds: [id],
                    ValueFields: 'ID,UserDelegateName,StatusView,UserName,DataTypeDelegateView,Note,DateFrom,DateTo',
                    IsPortal: true,
                    sort: [{
                        field: 'DateUpdate',
                        dir: 'desc'
                    }],
                    UserDelegateIDs: '',
                    DataTypeDelegate: '',
                    page: 1,
                    pageSize: 20,
                    dataSourceRequestString: 'page=1&pageSize=20',
                    UserID: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.userid : null,
                    UserSubmit: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.ProfileID : null
                });
                if (response && Array.isArray(response.data) && response.data.length > 0) {
                    let data = { ...response.data[0] };
                    data.BusinessAllowAction = Vnr_Services.handleStatusApprove(data.Status, dataItem?.TypeApprove);
                    data.ProfileName = data?.UserName;
                    data.itemStatus = Vnr_Services.formatStyleStatusApp(data.Status);
                    const _listActions = await this.rowActionsHeaderRight(data);
                    this.setState({ configListDetail: _configListDetail, dataItem: data, listActions: _listActions });
                } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                    dataItem.itemStatus = Vnr_Services.formatStyleStatusApp(dataItem.Status);
                    dataItem.BusinessAllowAction = Vnr_Services.handleStatusApprove(dataItem.Status, dataItem?.TypeApprove);
                    dataItem.ProfileName = dataItem?.UserName;
                    this.setState({ configListDetail: _configListDetail, dataItem });
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
        AttConfirmDelegationApprovalBusiness.setThisForBusiness(this);
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, listActions } = this.state,
            { containerItemDetail, contentScroll, bottomActions } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            const updatedConfigListDetail = configListDetail.filter(item => {
                if (item.Name === 'ConfirmUserName' && !dataItem.ConfirmUserName) {
                    return false; // Loại bỏ phần tử nếu không có ConfirmUserName trong dataItem
                }
                if (item.Name === 'RejectUserName' && !dataItem.RejectUserName) {
                    return false; // Loại bỏ phần tử nếu không có RejectUserName trong dataItem
                }
                if (item.Name === 'CancelUserName' && !dataItem.CancelUserName) {
                    return false; // Loại bỏ phần tử nếu không có CancelUserName trong dataItem
                }
                return true; // Giữ lại phần tử nếu điều kiện trên không thỏa
            });
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={contentScroll} showsVerticalScrollIndicator={false}>
                        <View style={containerItemDetail}>
                            {updatedConfigListDetail.map((e) => {
                                if (e.TypeView != 'E_COMMON_PROFILE') {
                                    return Vnr_Function.formatStringTypeV3(dataItem, e, updatedConfigListDetail);
                                }

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
