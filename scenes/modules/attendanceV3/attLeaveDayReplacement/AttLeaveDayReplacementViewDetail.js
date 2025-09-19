import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    stylesScreenDetailV3,
    CustomStyleSheet,
    Colors,
    Size
} from '../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../utils/Vnr_Function';
import { generateRowActionAndSelected, AttLeaveDayReplacementBusiness } from './AttLeaveDayReplacementBusiness';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../utils/HttpService';
import DrawerServices from '../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { EnumName } from '../../../../assets/constant';
import Vnr_Services from '../../../../utils/Vnr_Services';
import SafeAreaViewDetail from '../../../../components/safeAreaView/SafeAreaViewDetail';
import ManageFileSevice from '../../../../utils/ManageFileSevice';
import VnrText from '../../../../components/VnrText/VnrText';
import { translate } from '../../../../i18n/translate';

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
        'DisplayKey': 'HRM_PortalApp_TakeLeave_WorkDate',
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
        'DisplayKey': 'HRM_PortalApp_StartTime',
        'DataType': 'DateToFrom',
        'DataFormat': 'HH:mm'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'HoursTo',
        'DisplayKey': 'HRM_PortalApp_EndTime',
        'DataType': 'DateToFrom',
        'DataFormat': 'HH:mm'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'EmergencyLeave',
        'DisplayKey': 'HRM_PortalApp_TakeLeave_EmergencyLeaveDay',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'IsSubstitute',
        'DisplayKey': 'HRM_PortalApp_TakeLeave_ToNeedAReplacement',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'ConfirmHours',
        'DisplayKey': 'HRM_PortalApp_TakeLeaveReplacement_Confirmed',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'RemainLeaveHours',
        'DisplayKey': 'HRM_PortalApp_LeaveDayReplacement_tabPendingConfirmation',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'Comment',
        'DisplayKey': 'HRM_PortalApp_Reason_Note',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_FILEATTACH',
        'Name': 'FileAttachment',
        'DisplayKey': '',
        'DataType': 'FileAttach'
    },
    {
        'TypeView': 'E_GROUP_APPROVE',
        'DisplayKey': 'HRM_HRE_Concurrent_ApproveHistory',
        'DataType': 'string'
    }
];
export default class AttLeaveDayReplacementViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: generateRowActionAndSelected('AttSubmitTakeLeaveDay'),
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
                { screenName, dataId, dataItem, screenNameRender } =
                    typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[screenName]
                    ? ConfigListDetail.value[screenName]
                    : configDefault;

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;
            if (id) {
                const response = await HttpService.Get(
                    `[URI_CENTER]/api/Att_LeaveDay/GetDetailLeaveDayReplacementByID?ID=${id}`
                );
                const getDetailConfig = await Vnr_Function.HandleConfigListDetailATT(_configListDetail, 'Detail_List_DaysReplacement');
                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = response.Data;
                    data = { ...data, ...data.SingleWordDetail[0] };

                    data.BusinessAllowAction = Vnr_Services.handleStatusApprove(data.Status, 'E_APPROVED');
                    data.itemStatus =
                        screenNameRender === 'AttWaitConfirmLeaveDayReplacement'
                            ? {
                                colorStatus: '#FA8C16',
                                borderStatus: Colors.white,
                                bgStatus: '250, 140, 22, 0.08'
                            }
                            : {
                                colorStatus: '#52C41A',
                                borderStatus: Colors.white,
                                bgStatus: '82, 196, 26, 0.08'
                            };
                    data.FileAttachment = ManageFileSevice.setFileAttachApp(data.FileAttachment);
                    data.ImagePath = data?.AvatarUserRegister
                        ? data.AvatarUserRegister
                        : dataItem?.ProfileInfo?.ImagePath;
                    data.StatusView =
                        screenNameRender === 'AttWaitConfirmLeaveDayReplacement'
                            ? translate('HRM_PortalApp_PITFinalization_tabWaitingConfirmed')
                            : translate('HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Confirmed');

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
        AttLeaveDayReplacementBusiness.setThisForBusiness(this);
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
                            <View>
                                <View style={[stylesScreenDetailV3.styItemContentGroup]}>
                                    {/* {icon} */}
                                    <VnrText
                                        style={[
                                            styleSheets.lable,
                                            stylesScreenDetailV3.styTextGroup,
                                            CustomStyleSheet.flex(1)
                                        ]}
                                        i18nKey={'HRM_PortalApp_AttLeaveDayReplacement_DetailConfirmedLetter'}
                                        value={''}
                                    />
                                </View>
                                <View style={[{
                                    marginBottom: Size.defineHalfSpace
                                }]}>
                                    {
                                        Array.isArray(dataItem.TimeSheetReplacement) && dataItem.TimeSheetReplacement.length > 0 &&
                                        dataItem.TimeSheetReplacement.map((sheetItem, index) => {
                                            return (
                                                <View key={index} style={styles.styViewItemTimeSheet}>
                                                    {
                                                        Vnr_Function.renderAvatarCricleByName(
                                                            sheetItem.AvatarProfileTimeSheet,
                                                            sheetItem.ProfileNameProfileTimeSheet,
                                                            20
                                                        )
                                                    }
                                                    <Text style={[styleSheets.text, CustomStyleSheet.color(Colors.primary), CustomStyleSheet.marginLeft(5)]}>{`${sheetItem.ProfileNameProfileTimeSheet}`}</Text>
                                                    <Text> - </Text>
                                                    <Text style={[styleSheets.text, CustomStyleSheet.fontSize(Size.text - 2)]}>{`${sheetItem.StrWorkDate}`}</Text>
                                                    <Text> - </Text>
                                                    <Text style={[styleSheets.text, CustomStyleSheet.fontSize(Size.text - 2)]}>{`${sheetItem.StrActualHours}`}</Text>
                                                    <Text> - </Text>
                                                    <Text style={[styleSheets.text, CustomStyleSheet.fontSize(Size.text - 2)]}>{`${sheetItem.DurationTypeProfileTimeSheet}`}</Text>
                                                </View>
                                            );
                                        })
                                    }
                                </View>
                            </View>
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

const styles = StyleSheet.create({
    styViewItemTimeSheet: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 5
    }
});