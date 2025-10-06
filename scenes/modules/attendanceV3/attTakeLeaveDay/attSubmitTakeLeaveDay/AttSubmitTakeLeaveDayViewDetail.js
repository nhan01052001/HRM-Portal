import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Clipboard } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView, CustomStyleSheet, Size, Colors } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { generateRowActionAndSelected, AttSubmitTakeLeaveDayBusinessFunction } from './AttSubmitTakeLeaveDayBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import AttSubmitTakeLeaveDayAddOrEdit from './AttSubmitTakeLeaveDayAddOrEdit';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import { IconCopy } from '../../../../../constants/Icons';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';

const configDefault = [
    {
        'TypeView': 'E_STATUS',
        'Name': 'StatusView',
        'DisplayKey': 'HRM_Attendance_Overtime_OvertimeList_Status',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_GROUP_PROFILE',
        'DisplayKey': 'HRM_PortalApp_Subscribers',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON_PROFILE',
        'Name': 'E_COMPANY',
        'DisplayKey': 'E_COMPANY',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON_PROFILE',
        'Name': 'E_BRANCH',
        'DisplayKey': 'E_BRANCH',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON_PROFILE',
        'Name': 'E_UNIT',
        'DisplayKey': 'HRM_Hre_SignatureRegister_E_UNIT',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON_PROFILE',
        'Name': 'E_DIVISION',
        'DisplayKey': 'HRM_Hre_SignatureRegister_E_DIVISION',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON_PROFILE',
        'Name': 'E_DEPARTMENT',
        'DisplayKey': 'HRM_HR_Profile_OrgStructureName',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON_PROFILE',
        'Name': 'E_TEAM',
        'DisplayKey': 'Group',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON_PROFILE',
        'Name': 'E_SECTION',
        'DisplayKey': 'E_SECTION',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON_PROFILE',
        'Name': 'JobTitleName',
        'DisplayKey': 'HRM_HR_Profile_JobTitleName',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON_PROFILE',
        'Name': 'PositionName',
        'DisplayKey': 'HRM_HR_Profile_PositionName',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_GROUP',
        'DisplayKey': 'HRM_PortalApp_Leaveinformation',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'LeaveDayTypeName',
        'DisplayKey': 'HRM_Category_LeaveDayType_LeaveDayTypeName',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'RegisterDate',
        'DisplayKey': 'HRM_Attendance_Leaveday_DateFromTo',
        'DataType': 'DateToFrom',
        'DataFormat': 'DD/MM/YYYY'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'DurationTypeView',
        'DisplayKey': 'HRM_PortalApp_TakeLeave_DurationType',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'LeaveHours',
        'DisplayKey': 'HRM_PortalApp_TotalTimeLeaveDay',
        'DataType': 'string',
        'Unit': 'HRM_PortalApp_TSLRegister_Hours'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'HoursFrom',
        'NameSecond': 'HoursTo',
        'DisplayKey': 'HRM_PortalApp_Break',
        'DataType': 'DateToFrom',
        'DataFormat': 'HH:mm'
    },
    {
        'TypeView': 'E_FILEATTACH',
        'Name': 'FileAttachment',
        'DisplayKey': 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        'DataType': 'FileAttach'
    },
    {
        'TypeView': 'E_FILEATTACH',
        'Name': 'lstDocumentToSubmit',
        'DisplayKey': 'HRM_PortalApp_DocumentToSubmit',
        'DataType': 'FileAttach'
    },
    {
        'TypeView': 'E_GROUP_APPROVE',
        'DisplayKey': 'HRM_HRE_Concurrent_ApproveHistory',
        'DataType': 'string'
    }
];
export default class AttSubmitTakeLeaveDayViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: generateRowActionAndSelected(this.props.navigation.state.params?.screenName ?? ScreenName.AttSubmitTakeLeaveDay),
            listActions: this.resultListActionHeader()
        };

        this.AttSubmitTakeLeaveDayAddOrEdit = null;

        props.navigation.setParams({
            headerRight: (
                <View style={CustomStyleSheet.marginRight(16)}>
                    <TouchableOpacity
                        onPress={this.copyLink}
                    >
                        <IconCopy size={Size.iconSize} color={Colors.black} />
                    </TouchableOpacity>
                </View>
            )
        });
    }

    copyLink = async () => {
        if (this.state?.dataItem?.ID) {
            let link = `portal4hrm://main/AttSubmitTakeLeaveDayViewDetail?encoding=true&dataId=${Vnr_Services.encryptCode(this.state?.dataItem?.ID, [0, 1, 2, 3])}&screenName=${ScreenName.AttSubmitTakeLeaveDay}`;

            if (this.state?.dataItem?.ProcessApproval?.length > 0) {
                this.state?.dataItem?.ProcessApproval?.map((item) => {
                    if (item?.StatusProcess === 'process' && item?.UserApproveID) {
                        link += `&current=${Vnr_Services.encryptCode(item?.UserApproveID, [0, 1, 2, 3])}`;
                    }
                });
            }

            Clipboard.setString(link);
            // verify
            VnrLoadingSevices.show();
            const copied = await Clipboard.getString();
            VnrLoadingSevices.hide();
            if (copied === link) {
                ToasterSevice.showSuccess('HRM_PortalApp_CopySuccess');
            } else {
                ToasterSevice.showError('HRM_PortalApp_CopyFailed!');
            }
        } else {
            ToasterSevice.showWarning('HRM_PortalApp_DataLoading');
        }
    };

    onEdit = (item) => {
        if (item) {
            if (this.AttSubmitTakeLeaveDayAddOrEdit && this.AttSubmitTakeLeaveDayAddOrEdit.onShow) {
                this.AttSubmitTakeLeaveDayAddOrEdit.onShow({
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
                _configListDetail =
                    ConfigListDetail.value[screenName] !== null ? ConfigListDetail.value[screenName] : configDefault;
console.log(_params, '_params');

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;
            if (id) {
                const response = await HttpService.Get(`[URI_CENTER]/api/Att_LeaveDay/GetDetailLeaveDayByID?ID=${id}`);
                const getDetailConfig = await Vnr_Function.HandleConfigListDetailATT(_configListDetail, 'Detail_List_LeaveDay');
                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = response.Data;
                    data = { ...dataItem, ...data, ...data.SingleWordDetail[0] };

                    data.BusinessAllowAction = Vnr_Services.handleStatus(
                        data.Status,
                        dataItem?.SendEmailStatus ? dataItem?.SendEmailStatus : false,
                        dataItem?.TypeApprove
                    );
                    data.itemStatus = Vnr_Services.formatStyleStatusApp(data.Status);
                    data.FileAttachment = ManageFileSevice.setFileAttachApp(data.FileAttachment);
                    data.lstDocumentToSubmit = ManageFileSevice.setFileAttachApp(data.FileAttach);
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
            DrawerServices.navigate('AttSubmitTakeLeaveDay');
        } else {
            this.setState({ dataItem: null }, () => {
                this.getDataItem(true);
            });
        }
    };

    componentDidMount() {
        AttSubmitTakeLeaveDayBusinessFunction.setThisForBusiness(this);
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, listActions } = this.state,
            { containerItemDetail, contentScroll, bottomActions } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <AttSubmitTakeLeaveDayAddOrEdit ref={(refs) => (this.AttSubmitTakeLeaveDayAddOrEdit = refs)} />
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