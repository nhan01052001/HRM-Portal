import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import {
    generateRowActionAndSelected,
    AttSubmitTamScanLogRegisterBusinessFunction
} from './AttSubmitTamScanLogRegisterBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { EnumName } from '../../../../../assets/constant';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import AttSubmitTamScanLogRegisterAddOrEdit from './AttSubmitTamScanLogRegisterAddOrEdit';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';

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
        'Name': 'TimeLog',
        'DisplayKey': 'HRM_PortalApp_ForgottenTimekeepingDate',
        'DataType': 'DateToFrom',
        'DataFormat': 'DD/MM/YYYY'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'OrgStructureTransName',
        'DisplayKey': 'HRM_PortalApp_TransferDepartment',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'WorkPlaceName',
        'DisplayKey': 'HRM_PortalApp_TSLRegister_PlaceID',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'TimeLog',
        'DisplayKey': 'HRM_Attendance_CheckIn_GPS_DateTime',
        'DataType': 'DateToFrom',
        'DataFormat': 'HH:mm'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'TAMScanReasonMissName',
        'DisplayKey': 'HRM_PortalApp_TSLRegister_MissInOutReason',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_FILEATTACH',
        'Name': 'FileAttachment',
        'DisplayKey': 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        'DataType': 'FileAttach'
    },
    {
        'TypeView': 'E_FILEATTACH',
        'Name': 'ImageTimeKeeping',
        'DisplayKey': '',
        'DataType': 'FileAttach'
    },
    {
        'TypeView': 'E_GROUP_APPROVE',
        'DisplayKey': 'HRM_HRE_Concurrent_ApproveHistory',
        'DataType': 'string'
    }
];

export default class AttSubmitTamScanLogRegisterViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: generateRowActionAndSelected(this.props.navigation.state.params?.screenName),
            listActions: this.resultListActionHeader()
        };

        this.AttSubmitTamScanLogRegisterAddOrEdit = null;
    }

    onEdit = item => {
        if (item) {
            if (this.AttSubmitTamScanLogRegisterAddOrEdit && this.AttSubmitTamScanLogRegisterAddOrEdit.onShow) {
                this.AttSubmitTamScanLogRegisterAddOrEdit.onShow({
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
                _configListDetail = ConfigListDetail.value[screenName] ? ConfigListDetail.value[screenName] :
                    configDefault;

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;
            if (id) {
                const response = await HttpService.Get(`[URI_CENTER]/api/Att_TAMScanLogRegister/GetTamScanLogRegisterByID?ID=${id}`);
                const getDetailConfig = await Vnr_Function.HandleConfigListDetailATT(_configListDetail, 'Detail_List_Tamscanlog');
                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = response.Data;
                    data.BusinessAllowAction = Vnr_Services.handleStatus(data.Status, data?.SendEmailStatus, dataItem.TypeApprove);
                    data.itemStatus = Vnr_Services.formatStyleStatusApp(data.Status);
                    data.FileAttachment = ManageFileSevice.setFileAttachApp(data.FileAttachment);
                    if (data.SingleWordDetail[0]?.FileAttachment) {
                        data.ImageTimeKeeping = ManageFileSevice.setFileAttachApp(data.SingleWordDetail[0]?.FileAttachment);
                    }
                    data.ImagePath = data?.AvatarUserRegister
                        ? data.AvatarUserRegister
                        : dataItem?.ProfileInfo?.ImagePath;

                    // handle synchronized field for app
                    if (!data?.UserProcessApproveID && data?.UserProcessID) {
                        data.UserProcessApproveID = data?.UserProcessID;
                    }

                    if (!data?.UserProcessApproveID2 && data?.UserProcessID2) {
                        data.UserProcessApproveID2 = data?.UserProcessID2;
                    }

                    if (!data?.UserProcessApproveID3 && data?.UserProcessID3) {
                        data.UserProcessApproveID3 = data?.UserProcessID3;
                    }

                    if (!data?.UserProcessApproveID4 && data?.UserProcessID4) {
                        data.UserProcessApproveID4 = data?.UserProcessID4;
                    }

                    // 0186607: Điều chỉnh view vùng lịch sử phê duyệt trên app (KHOT, Quên chấm công)
                    if (Array.isArray(data.FileAttachment)) {
                        let FileAttachmentRequestCancel = ManageFileSevice.setFileAttachApp(data.FileAttachmentRequestCancel);
                        if (Array.isArray(FileAttachmentRequestCancel) && FileAttachmentRequestCancel.length > 0)
                            data.FileAttachment.push(...FileAttachmentRequestCancel);
                    } else {
                        data.FileAttachment = ManageFileSevice.setFileAttachApp(data.FileAttachmentRequestCancel);
                    }

                    // if (Array.isArray(data?.ProcessApproval) && data?.ProcessApproval.length > 0) {
                    //     data.ProcessApproval = data?.ProcessApproval.map((item) => {
                    //         delete item?.PositionName;
                    //         return {
                    //             ...item
                    //         };
                    //     });
                    // }

                    const _listActions = await this.rowActionsHeaderRight(data);

                    // nhan.nguyen: 0177449: [TB W12]raise lỗi App v3 Quên chấm công
                    this.setState({
                        configListDetail: getDetailConfig,
                        dataItem: { ...dataItem, ...data },
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
            DrawerServices.navigate('AttSubmitTamScanLogRegister');
        } else {
            this.setState({ dataItem: null }, () => {
                this.getDataItem(true);
            });
        }
    };

    componentDidMount() {
        AttSubmitTamScanLogRegisterBusinessFunction.setThisForBusiness(this);
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, listActions } = this.state,
            { containerItemDetail, contentScroll, bottomActions } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <AttSubmitTamScanLogRegisterAddOrEdit
                        ref={refs => (this.AttSubmitTamScanLogRegisterAddOrEdit = refs)}
                    />
                    <ScrollView style={contentScroll} showsVerticalScrollIndicator={false}>
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
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaViewDetail>
        );
    }
}
