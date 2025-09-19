import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView, stylesScreenDetailV3, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { generateRowActionAndSelected, AttApproveShiftChangeBusiness } from './AttApproveShiftChangeBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import VnrText from '../../../../../components/VnrText/VnrText';

const configDefault = [
    {
        TypeView: 'E_STATUS',
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP_PROFILE',
        DisplayKey: 'HRM_PortalApp_Employee',
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
        DisplayKey: 'HRM_PortalApp_ChangeShiftInformation',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TypeView',
        DisplayKey: 'Type',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'registrationType',
        DisplayKey: 'HRM_PortalApp_TakeLeave_DurationType',
        DataType: 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'DateStart',
        'NameSecond': 'DateEnd',
        'DisplayKey': 'HRM_PortalApp_ShiftChangeDate',
        'DataType': 'DateToFrom',
        'DataFormat': 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_MULTI',
        Name: 'ShiftName',
        DisplayKey: 'HRM_PortalApp_TopTab_AttSubmitShiftChange_ShiftChangeShiftNow',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Comment',
        DisplayKey: 'Reason',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'FileAttachment',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_GROUP_APPROVE',
        DisplayKey: 'HRM_PortalApp_ApprovedProcess',
        DataType: 'string'
    }
];

const configDefault2 = [
    {
        TypeView: 'E_STATUS',
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP_PROFILE',
        DisplayKey: 'HRM_PortalApp_Employee',
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
        DisplayKey: 'HRM_PortalApp_ChangeShiftInformation',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TypeView',
        DisplayKey: 'Type',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'registrationType',
        DisplayKey: 'HRM_PortalApp_TakeLeave_DurationType',
        DataType: 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'DateStart',
        'DisplayKey': 'HRM_PortalApp_ShiftChangeDate',
        'DataType': 'DateToFrom',
        'DataFormat': 'DD/MM/YYYY'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'DateEnd',
        'DisplayKey': 'HRM_PortalApp_TheReplacementDay',
        'DataType': 'DateToFrom',
        'DataFormat': 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ChangeShiftName',
        DisplayKey: 'HRM_PortalApp_ShiftChange',
        DataType: 'string'
    },
    {
        TypeView: 'E_MULTI',
        Name: 'ChangeShiftName',
        NameSecond: 'AlternateShiftName',
        DisplayKey: 'HRM_PortalApp_AlternateShift',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ShiftChangeEmployee',
        DisplayKey: 'HRM_PortalApp_ShiftChangeEmployee',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ProfileName2',
        DisplayKey: 'HRM_PortalApp_ReplacementStaff',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Comment',
        DisplayKey: 'Reason',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'FileAttach',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_GROUP_APPROVE',
        DisplayKey: 'HRM_PortalApp_ApprovedProcess',
        DataType: 'string'
    }
];

export default class AttApproveShiftChangeViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: this.props.navigation.state.params?.screenName
                ? generateRowActionAndSelected(this.props.navigation.state.params?.screenName)
                : [],
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
                { dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);
            let _configListDetail = ConfigListDetail.value[ScreenName.AttApproveShiftChange]
                ?? configDefault;

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;
            if (id) {
                const response = await HttpService.Get(
                    `[URI_CENTER]/api/Att_Roster/GetDetailRosterByID?ID=${id}`
                );


                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = { ...response.Data };
                    data.BusinessAllowAction = Vnr_Services.handleStatusApprove(data.Status, data?.TypeApprove);
                    data.itemStatus = Vnr_Services.formatStyleStatusApp(data.Status);
                    data.FileAttachment = ManageFileSevice.setFileAttachApp(data.FileAttachment);
                    data.FileAttach = ManageFileSevice.setFileAttachApp(data.FileAttach);
                    data.ImagePath = data?.AvatarUserRegister
                        ? data.AvatarUserRegister
                        : dataItem?.ProfileInfo?.ImagePath;
                    data.registrationType = data?.DetailChangeShift[0]?.ChangeShiftTypeView;

                    if (data?.Type === 'E_CHANGE_SHIFT' && Array.isArray(_configListDetail)) {
                        _configListDetail = _configListDetail.filter((item) => item?.TypeView !== 'E_FILEATTACH');
                    } else {
                        if (Array.isArray(data?.DetailChangeShift))
                            data.ShiftChangeEmployee = data?.DetailChangeShift[0]?.ProfileName;
                        _configListDetail = ConfigListDetail.value['AttApproveChangeWorkSchedule']
                            ?? configDefault2;
                    }

                    // handle synchronized field for app
                    // if (!data?.UserProcessApproveID && data?.UserProcessID) {
                    //     data.UserProcessApproveID = data?.UserProcessID;
                    // }

                    // if (!data?.UserProcessApproveID2 && data?.UserProcessID2) {
                    //     data.UserProcessApproveID2 = data?.UserProcessID2;
                    // }

                    // if (!data?.UserProcessApproveID3 && data?.UserProcessID3) {
                    //     data.UserProcessApproveID3 = data?.UserProcessID3;
                    // }

                    // if (!data?.UserProcessApproveID4 && data?.UserProcessID4) {
                    //     data.UserProcessApproveID4 = data?.UserProcessID4;
                    // }

                    const _listActions = await this.rowActionsHeaderRight(data);

                    this.setState({ configListDetail: _configListDetail, dataItem: data, listActions: _listActions });
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
        AttApproveShiftChangeBusiness.setThisForBusiness(this, false, this.state.dataRowActionAndSelected?.rowActions);
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
                                if (e.TypeView === 'E_MULTI') {
                                    return (
                                        <View
                                            style={[stylesScreenDetailV3.styItemContent, e.isWrapLine && CustomStyleSheet.flexDirection('column')]}
                                        >
                                            <View
                                                style={[
                                                    stylesScreenDetailV3.viewLable,
                                                    CustomStyleSheet.justifyContent('flex-start'),
                                                    stylesScreenDetailV3.viewLableJustify
                                                ]}
                                            >
                                                <VnrText
                                                    style={[styleSheets.text, { ...styleSheets.text, ...{ textAlign: 'left' } }]}
                                                    i18nKey={e.DisplayKey}
                                                />
                                            </View>
                                            <View
                                                style={[
                                                    stylesScreenDetailV3.styViewValue,
                                                    stylesScreenDetailV3.styViewValueJustify
                                                ]}
                                            >
                                                {
                                                    dataItem?.Type === 'E_CHANGE_SHIFT' ? (
                                                        Array.isArray(dataItem?.DetailChangeShift) && dataItem?.DetailChangeShift.length > 0
                                                            && Array.isArray(dataItem?.DetailChangeShift[0]?.ListChangeShift) && dataItem?.DetailChangeShift[0]?.ListChangeShift.length > 0
                                                            ? (
                                                                dataItem?.DetailChangeShift[0]?.ListChangeShift.map((item, index) => {
                                                                    return (
                                                                        <Text key={index} style={{
                                                                            ...styleSheets.lable,
                                                                            ...stylesScreenDetailV3.styTextValueInfo,
                                                                            ...CustomStyleSheet.textAlign('right')
                                                                        }}><Text style={[item?.Shift_Old && styles.lineThrough]}>{item?.Shift_Old ?? '-'}</Text> {'->'} {item?.Shift ?? '-'} </Text>
                                                                    );
                                                                })
                                                            ) : (
                                                                <Text style={{
                                                                    ...styleSheets.lable,
                                                                    ...stylesScreenDetailV3.styTextValueInfo,
                                                                    ...CustomStyleSheet.textAlign('right')
                                                                }}>-</Text>
                                                            )
                                                    ) : (
                                                        <Text style={{
                                                            ...styleSheets.lable,
                                                            ...stylesScreenDetailV3.styTextValueInfo,
                                                            ...CustomStyleSheet.textAlign('right')
                                                        }}><Text style={[dataItem?.ChangeShiftName && styles.lineThrough]}>{dataItem?.ChangeShiftName ?? '-'}</Text> {'->'} {dataItem?.AlternateShiftName ?? '-'} </Text>
                                                    )
                                                }
                                            </View>
                                        </View>
                                    );
                                }

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

const styles = StyleSheet.create({
    lineThrough: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    }
});
