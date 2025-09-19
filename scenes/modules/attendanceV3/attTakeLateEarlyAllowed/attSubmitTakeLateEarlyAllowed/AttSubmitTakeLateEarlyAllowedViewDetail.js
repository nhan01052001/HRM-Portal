import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import {
    generateRowActionAndSelected,
    AttSubmitTakeLateEarlyAllowedBusinessFunction
} from './AttSubmitTakeLateEarlyAllowedBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { EnumName } from '../../../../../assets/constant';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import AttSubmitTakeLateEarlyAllowedAddOrEdit from './AttSubmitTakeLateEarlyAllowedAddOrEdit';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';

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
        DisplayKey: 'HRM_Detail_Process_Info_Common',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'WorkDate',
        DisplayKey: 'HRM_Attendance_InOut_WorkDate',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'LateEarlyTypeView',
        DisplayKey: 'LateEarlyTypeView',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'LateEarlyMinutes',
        DisplayKey: 'LateEarlyMinutes',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'OvertimeResonName',
        DisplayKey: 'HRM_Attendance_LateEarlyAllowed_OvertimeResonName',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'Attachment',
        DisplayKey: 'HRM_Attendance_LateEarlyAllowed_Attachment',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_GROUP_APPROVE',
        DisplayKey: 'HRM_Detail_Approve_Info_Common',
        DataType: 'string'
    }
];

export default class AttSubmitTakeLateEarlyAllowedViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: generateRowActionAndSelected(this.props.navigation.state.params?.screenName),
            listActions: this.resultListActionHeader()
        };

        this.AttSubmitTakeLateEarlyAllowedAddOrEdit = null;
    }

    onEdit = (item) => {
        if (item) {
            if (this.AttSubmitTakeLateEarlyAllowedAddOrEdit && this.AttSubmitTakeLateEarlyAllowedAddOrEdit.onShow) {
                this.AttSubmitTakeLateEarlyAllowedAddOrEdit.onShow({
                    reload: this.reload,
                    record: item
                });
            }
        }
    };

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
                    `[URI_CENTER]/api/Att_LateEarlyAllowed/GetLateEarlyAllowedById?ID=${id}`
                );
                const getDetailConfig = await Vnr_Function.HandleConfigListDetailATT(
                    _configListDetail,
                    'Detail_List_LateEarly'
                );
                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = response.Data;
                    data = { ...data, ...data.SingleWordDetail[0] };

                    data.BusinessAllowAction = Vnr_Services.handleStatus(
                        data.Status,
                        dataItem?.SendEmailStatus ? dataItem?.SendEmailStatus : false
                    );
                    data.itemStatus = Vnr_Services.formatStyleStatusApp(data.Status);
                    data.Attachment = ManageFileSevice.setFileAttachApp(data.Attachment);
                    data.ImagePath = data?.AvatarUserRegister
                        ? data.AvatarUserRegister
                        : dataItem?.ProfileInfo?.ImagePath;
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

    reload = (E_KEEP_FILTER, actionIsDelete) => {
        const { reloadScreenList } = this.props.navigation.state.params;

        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');

        //nếu action = Delete => back về danh sách
        if (actionIsDelete) {
            DrawerServices.navigate('AttSubmitTakeLateEarlyAllowed');
        } else {
            this.setState({ dataItem: null }, () => {
                this.getDataItem(true);
            });
        }
    };

    componentDidMount() {
        AttSubmitTakeLateEarlyAllowedBusinessFunction.setThisForBusiness(this);
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, listActions } = this.state,
            { containerItemDetail, contentScroll, bottomActions } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <AttSubmitTakeLateEarlyAllowedAddOrEdit
                        ref={(refs) => (this.AttSubmitTakeLateEarlyAllowedAddOrEdit = refs)}
                    />
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
