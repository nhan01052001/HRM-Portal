import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { generateRowActionAndSelected, AttSubmitDelegationApprovalBusiness } from './AttSubmitDelegationApprovalBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';

const configDefault = [
    {
        TypeView: 'E_GROUP_PROFILE',
        DisplayKey: 'HRM_PortalApp_AuthorizedPerson',
        DataType: 'string',
        isCollapse: true
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_DEPARTMENT',
        DisplayKey: 'OrgStructureName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'JobTitleName',
        DisplayKey: 'JobTitleName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'PositionName',
        DisplayKey: 'PositionName',
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
        Name: 'OrgStructureName',
        DisplayKey: 'HRM_HR_Profile_OrgStructureName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'WorkPlaceName',
        DisplayKey: 'HRM_PortalApp_WorkHistory_Workplace',
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
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_HRE_Concurrent_ApproveHistory',
        DataType: 'string',
        isCollapse: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'UserDelegateName',
        DisplayKey: 'HRM_PortalApp_Requester',
        DataType: 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'ConfirmUserName',
        'DisplayKey': 'HRM_PortalApp_PITFinalization_Confirmator',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'RejectUserName',
        'DisplayKey': 'HRM_PortalApp_Rejecter',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'CancelUserName',
        'DisplayKey': 'HRM_PortalApp_Canceller',
        'DataType': 'string'
    }
];

export default class AttSubmitDelegationApprovalViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: generateRowActionAndSelected(this.props.navigation.state.params?.screenName),
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
                    ?? configDefault;

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;
            if (id) {
                const _listActions = await this.rowActionsHeaderRight(dataItem);
                dataItem.ProfileName = dataItem?.UserDelegateName;
                this.setState({ configListDetail: _configListDetail, dataItem: dataItem, listActions: _listActions });
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
        AttSubmitDelegationApprovalBusiness.setThisForBusiness(this);
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
                                if (e.TypeView != 'E_COMMON_PROFILE')
                                    return Vnr_Function.formatStringTypeV3(dataItem, e, updatedConfigListDetail);
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
