import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    stylesScreenDetailV3,
    CustomStyleSheet,
    Size,
    Colors
} from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { generateRowActionAndSelected, AttSubmitShiftChangeBusinessFunction } from './AttSubmitShiftChangeBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { EnumName } from '../../../../../assets/constant';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import AttSubmitShiftChangeAddOrEdit from './AttSubmitShiftChangeAddOrEdit';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import VnrText from '../../../../../components/VnrText/VnrText';
import { IconSwapright } from '../../../../../constants/Icons';

const configDefault = [
    {
        TypeView: 'E_GROUP_PROFILE',
        DisplayKey: 'HRM_PortalApp_Employee',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'CodeEmp',
        DisplayKey: 'HRM_HR_Profile_CodeEmp',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'ProfileName',
        DisplayKey: 'HRM_HR_Profile_ProfileName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_COMPANY',
        DisplayKey: 'HRM_Hre_SignatureRegister_E_COMPANY',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_BRANCH',
        DisplayKey: 'HRM_Hre_SignatureRegister_E_BRANCH',
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
        DisplayKey: 'HRM_Hre_SignatureRegister_E_DEPARTMENT',
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
        DisplayKey: 'HRM_HR_ReportProfileWaitingStopWorking_TeamName',
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
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
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
        Name: 'ChangeShiftTypeView',
        DisplayKey: 'HRM_PortalApp_TakeLeave_DurationType',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'StrDate',
        DisplayKey: 'HRM_PortalApp_ShiftChangeDate',
        DataType: 'string'
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
        Name: 'FileAttach',
        DisplayKey: '',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_GROUP_APPROVE',
        DisplayKey: 'HRM_PortalApp_Approval_Process',
        DataType: 'string'
    }
];
const configScheDefault = [
    {
        TypeView: 'E_GROUP_PROFILE',
        DisplayKey: 'HRM_PortalApp_Employee',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'CodeEmp',
        DisplayKey: 'HRM_HR_Profile_CodeEmp',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'ProfileName',
        DisplayKey: 'HRM_HR_Profile_ProfileName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_COMPANY',
        DisplayKey: 'HRM_Hre_SignatureRegister_E_COMPANY',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_BRANCH',
        DisplayKey: 'HRM_Hre_SignatureRegister_E_BRANCH',
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
        DisplayKey: 'HRM_Hre_SignatureRegister_E_DEPARTMENT',
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
        DisplayKey: 'HRM_HR_ReportProfileWaitingStopWorking_TeamName',
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
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
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
        Name: 'ChangeShiftTypeView',
        DisplayKey: 'HRM_PortalApp_TakeLeave_DurationType',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'StrChangeDate',
        DisplayKey: 'HRM_PortalApp_ShiftChangeDate',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'StrAlternateDate',
        DisplayKey: 'HRM_PortalApp_TheReplacementDay',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Shift_Old',
        DisplayKey: 'HRM_PortalApp_ShiftChange',
        DataType: 'string'
    },
    {
        TypeView: 'E_MULTI',
        Name: 'ShiftName',
        DisplayKey: 'HRM_PortalApp_AlternateShift',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ProfileName',
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
        DisplayKey: '',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_GROUP_APPROVE',
        DisplayKey: 'HRM_PortalApp_Approval_Process',
        DataType: 'string'
    }
];

export default class AttSubmitShiftChangeViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: generateRowActionAndSelected(this.props.navigation.state.params?.screenName),
            listActions: this.resultListActionHeader()
        };

        this.AttSubmitShiftChangeAddOrEdit = null;
    }

    onEdit = (item) => {
        if (item) {
            if (this.AttSubmitShiftChangeAddOrEdit && this.AttSubmitShiftChangeAddOrEdit.onShow) {
                this.AttSubmitShiftChangeAddOrEdit.onShow({
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
                    : configDefault,
                _configListScheduleDetail = ConfigListDetail.value['AttSubmitShiftChangeSchedule']
                    ? ConfigListDetail.value['AttSubmitShiftChangeSchedule']
                    : configScheDefault;

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;
            if (id) {
                const response = await HttpService.Get(`[URI_CENTER]/api/Att_Roster/GetDetailRosterByID?ID=${id}`);
                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = { ...response.Data, ...response.Data?.DetailChangeShift[0] };
                    data.BusinessAllowAction = Vnr_Services.handleStatus(
                        data.Status,
                        dataItem?.SendEmailStatus ? dataItem?.SendEmailStatus : false
                    );
                    data.itemStatus = Vnr_Services.formatStyleStatusApp(data.Status);
                    data.FileAttach = ManageFileSevice.setFileAttachApp(data.FileAttach);
                    data.ImagePath = data?.AvatarUserRegister
                        ? data.AvatarUserRegister
                        : dataItem?.ProfileInfo?.ImagePath;

                    const _listActions = await this.rowActionsHeaderRight(data);
                    this.setState({
                        configListDetail:
                            data.Type === 'E_DIFFERENTDAY' ||
                            data.Type === 'E_CHANGE_SHIFT_COMPANSATION' ||
                            data.Type === 'E_SAMEDAY'
                                ? _configListScheduleDetail
                                : _configListDetail,
                        dataItem: data,
                        listActions: _listActions
                    });
                } else {
                    this.setState({ dataItem: 'EmptyData' });
                }
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                this.setState({
                    configListDetail:
                        dataItem.Type === 'E_DIFFERENTDAY' ||
                        dataItem.Type === 'E_CHANGE_SHIFT_COMPANSATION' ||
                        dataItem.Type === 'E_SAMEDAY'
                            ? _configListScheduleDetail
                            : _configListDetail,
                    dataItem
                });
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
        AttSubmitShiftChangeBusinessFunction.setThisForBusiness(this);
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, listActions } = this.state,
            { containerItemDetail, contentScroll, bottomActions } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <AttSubmitShiftChangeAddOrEdit ref={(refs) => (this.AttSubmitShiftChangeAddOrEdit = refs)} />
                    <ScrollView style={contentScroll} showsVerticalScrollIndicator={false}>
                        <View style={containerItemDetail}>
                            {configListDetail.map((e) => {
                                if (e.TypeView === 'E_MULTI') {
                                    return (
                                        <View
                                            style={[
                                                stylesScreenDetailV3.styItemContent,
                                                e.isWrapLine && CustomStyleSheet.flexDirection('column')
                                            ]}
                                        >
                                            <View
                                                style={[
                                                    stylesScreenDetailV3.viewLable,
                                                    CustomStyleSheet.justifyContent('flex-start'),
                                                    stylesScreenDetailV3.viewLableJustify
                                                ]}
                                            >
                                                <VnrText
                                                    style={[
                                                        styleSheets.text,
                                                        { ...styleSheets.text, ...{ textAlign: 'left' } }
                                                    ]}
                                                    i18nKey={e.DisplayKey}
                                                />
                                            </View>
                                            <View
                                                style={[
                                                    stylesScreenDetailV3.styViewValue,
                                                    stylesScreenDetailV3.styViewValueJustify
                                                ]}
                                            >
                                                {Array.isArray(dataItem?.DetailChangeShift) &&
                                                dataItem?.DetailChangeShift.length > 0 &&
                                                Array.isArray(dataItem?.DetailChangeShift[0]?.ListChangeShift) &&
                                                dataItem?.DetailChangeShift[0]?.ListChangeShift.length > 0 ? (
                                                    dataItem?.DetailChangeShift[0]?.ListChangeShift.map(
                                                        (item, index) => {
                                                            return (
                                                                <Text
                                                                    key={index}
                                                                    style={{
                                                                        ...styleSheets.lable,
                                                                        ...stylesScreenDetailV3.styTextValueInfo,
                                                                        ...CustomStyleSheet.textAlign('right')
                                                                    }}
                                                                >
                                                                    <Text
                                                                        style={[item?.Shift_Old && styles.lineThrough]}
                                                                    >
                                                                        {item?.Shift_Old ?? '-'}
                                                                    </Text>{' '}
                                                                    {
                                                                        <IconSwapright
                                                                            size={Size.iconSize - 6}
                                                                            color={Colors.black}
                                                                        />
                                                                    }{' '}
                                                                    {item?.Shift ?? '-'}{' '}
                                                                </Text>
                                                            );
                                                        }
                                                    )
                                                    ) : dataItem?.DetailChangeShift[0].Shift ||
                                                  dataItem?.DetailChangeShift[0].Shift_Old ? (
                                                            <Text
                                                                style={{
                                                                    ...styleSheets.lable,
                                                                    ...stylesScreenDetailV3.styTextValueInfo,
                                                                    ...CustomStyleSheet.textAlign('right')
                                                                }}
                                                            >
                                                                <Text
                                                                    style={[
                                                                dataItem?.DetailChangeShift[0].Shift_Old &&
                                                                    styles.lineThrough
                                                                    ]}
                                                                >
                                                                    {dataItem?.DetailChangeShift[0]?.Shift_Old ?? ''}
                                                                </Text>{' '}
                                                                {dataItem?.DetailChangeShift[0]?.Shift_Old && (
                                                                    <IconSwapright
                                                                        size={Size.iconSize - 6}
                                                                        color={Colors.black}
                                                                    />
                                                                )}{' '}
                                                                {dataItem?.DetailChangeShift[0]?.Shift ?? '-'}{' '}
                                                            </Text>
                                                        ) : (
                                                            <Text
                                                                style={{
                                                                    ...styleSheets.lable,
                                                                    ...stylesScreenDetailV3.styTextValueInfo,
                                                                    ...CustomStyleSheet.textAlign('right')
                                                                }}
                                                            >
                                                        -
                                                            </Text>
                                                        )}
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
