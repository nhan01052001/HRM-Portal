import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import {
    generateRowActionAndSelected,
    AttApproveTamScanLogRegisterBusinessFunction
} from './AttApproveTamScanLogRegisterBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import ListButtonMenuRight from '../../../../../componentsV3/ListButtonMenuRight/ListButtonMenuRight';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
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

export default class AttApproveTamScanLogRegisterViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: generateRowActionAndSelected(ScreenName.AttApproveTamScanLogRegister),
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
                { dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail =
                    ConfigListDetail.value[ScreenName.AttApproveTamScanLogRegister] !== null
                        ? ConfigListDetail.value[ScreenName.AttApproveTamScanLogRegister]
                        : configDefault;

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;
            if (id) {
                const response = await HttpService.Get(
                    `[URI_CENTER]/api/Att_TAMScanLogRegister/GetTamScanLogRegisterByID?ID=${id}`
                );
                const getDetailConfig = await Vnr_Function.HandleConfigListDetailATT(_configListDetail, 'Detail_Approve_Tamscanlog');
                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = response.Data;
                    data.BusinessAllowAction = Vnr_Services.handleStatusApprove(
                        data.Status,
                        data?.TypeApprove ?? dataItem?.TypeApprove
                    );
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
        AttApproveTamScanLogRegisterBusinessFunction.setThisForBusiness(this);
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
