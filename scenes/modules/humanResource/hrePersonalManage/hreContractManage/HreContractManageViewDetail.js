import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView, Colors, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import { translate } from '../../../../../i18n/translate';

const configDefault = [
    {
        TypeView: 'E_STATUS',
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
        DataType: 'string',
        isHiddenDate: true
    },
    {
        TypeView: 'E_GROUP_PROFILE',
        DisplayKey: 'ProfileNameViewNew',
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
        DisplayKey: '',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_BRANCH',
        DisplayKey: '',
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
        DisplayKey: '',
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
        DisplayKey: 'HRM_PortalApp_ContractHistory_Contract',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ContractTypeName',
        DisplayKey: 'HRM_PortalApp_ContractHistory_ContractType',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ContractNo',
        DisplayKey: 'HRM_PortalApp_ContractHistory_ContractNo',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateSigned',
        DisplayKey: 'HRM_PortalApp_HreContractManage_DateOfSigningALaborContract',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY',
        IsNullOrEmpty: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ContractPeriod',
        DisplayKey: 'HRM_PortalApp_ContractHistory_ContractDuration',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DurationContract',
        DisplayKey: 'HRM_PortalApp_HreContractManage_TimeValue',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'OrgStructureName',
        DisplayKey: 'HRM_PortalApp_ContractHistory_Department',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PositionName',
        DisplayKey: 'HRM_PortalApp_ContractHistory_Position',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'JobTitleName',
        DisplayKey: 'HRM_PortalApp_ContractHistory_JobTitle',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SalaryClassName',
        DisplayKey: 'HRM_PortalApp_ContractHistory_Level',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'WorkPlaceName',
        DisplayKey: 'HRM_PortalApp_ContractHistory_PlaceWork',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'EmployeeGroupName',
        DisplayKey: 'HRM_PortalApp_ContractHistory_EmployeeGroup',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ContractTypeName',
        DisplayKey: 'HRM_PortalApp_ContractHistory_EmployeeType',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Salary',
        DisplayKey: 'HRM_PortalApp_ContractHistory_SalaryBasic',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'KPIAmount',
        DisplayKey: 'HRM_PortalApp_WorkHistory_KPIAmount',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalSalary',
        DisplayKey: 'HRM_PortalApp_ContractHistory_Salary',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Note',
        DisplayKey: 'Note',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttach',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        DataType: 'FileAttach'
    }
];

const configDefaultContractExtend = [
    {
        TypeView: 'E_COMMON',
        Name: 'ContractNo',
        DisplayKey: 'HRM_PortalApp_ContractHistory_ContractNo',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateStart',
        DisplayKey: 'HRM_PortalApp_ContractHistory_DateStartContract',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY',
        IsNullOrEmpty: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'AnnexCode',
        DisplayKey: 'HRM_PortalApp_ContractHistory_AnnexCode',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ContractTime',
        DisplayKey: 'HRM_PortalApp_HreContractManage_DueDate',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateEffectiveExtend',
        DisplayKey: 'HRM_PortalApp_ContractHistory_DateEffectiveExtend',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY',
        IsNullOrEmpty: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SalaryExtend',
        DisplayKey: 'HRM_PortalApp_ContractHistory_SalaryBasic',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'KPIAmountExtend',
        DisplayKey: 'HRM_PortalApp_WorkHistory_KPIAmount',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalSalaryExtend',
        DisplayKey: 'HRM_PortalApp_ContractHistory_Salary',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lsAttachmentExtend',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'NoteExtend',
        DisplayKey: 'Note',
        DataType: 'string'
    }
];

// SpecializationName,Loại thử việc(check lại)
// các field chưa có

export default class HreContractManageViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            configListDetailContractExtend: null
        };
    }

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[ScreenName.HreContractManageViewDetail]
                    ? ConfigListDetail.value[ScreenName.HreContractManageViewDetail]
                    : configDefault,
                _configListDetailContractExtend =
                    ConfigListDetail.value[ScreenName.HreContractManageViewDetailContractExtend] != null
                        ? ConfigListDetail.value[ScreenName.HreContractManageViewDetailContractExtend]
                        : configDefaultContractExtend;

            let id = dataItem.ID;
            if (id) {
                const dataBody = {
                    ContractID: id
                };
                const response = await HttpService.Post(
                    '[URI_CENTER]/api/Hre_Contract/New_GetContractNewPortalByID',
                    dataBody,
                    null,
                    this.reload
                );
                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = {
                        ...dataItem,
                        ...response.Data
                    };
                    if (response['lstHre_ContractModel'] && response['lstHre_ContractModel'][0]) {
                        data = {
                            ...data,
                            ...response['lstHre_ContractModel'][0]
                        };
                    }

                    if (Array.isArray(data?.ListContractExtend) && data?.ListContractExtend.length > 0) {
                        data?.ListContractExtend.forEach(item => {
                            if (item?.AttachmentExtend) {
                                item.lsAttachmentExtend = ManageFileSevice.setFileAttachApp(item.AttachmentExtend);
                            }
                        });
                    }

                    data.itemStatus = Vnr_Services.formatStyleStatusApp(data.Status);
                    data.lstFileAttach = ManageFileSevice.setFileAttachApp(data.Attachments);

                    this.setState({
                        configListDetail: _configListDetail,
                        dataItem: data,
                        configListDetailContractExtend: _configListDetailContractExtend
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

    reload = () => {
        const { reloadScreenList } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');
        this.setState({ dataItem: null }, () => {
            this.getDataItem(true);
        });
    };

    componentDidMount() {
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, configListDetailContractExtend } = this.state,
            { containerItemDetail, contentScroll } = styleScreenDetail;

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
                        {Array.isArray(dataItem?.ListContractExtend) &&
                            dataItem?.ListContractExtend.length > 0 &&
                            configListDetailContractExtend &&
                            dataItem?.ListContractExtend.map((item, index) => {
                                return (
                                    <View
                                        key={index}
                                        style={contentScroll}>
                                        {index !== 0 ? (
                                            <View style={styles.wrapLine}>
                                                <View style={styles.line} />
                                            </View>
                                        ) : (
                                            <View style={styles.container}>
                                                <Text style={[styleSheets.lable, CustomStyleSheet.marginLeft(6)]}>
                                                    {`${translate(['HRM_PortalApp_ContractHistory_AppendixContract'])}`}
                                                </Text>
                                            </View>
                                        )}
                                        <View style={containerItemDetail}>
                                            {configListDetailContractExtend.map(e => {
                                                return Vnr_Function.formatStringTypeV3(
                                                    item,
                                                    e,
                                                    configListDetailContractExtend
                                                );
                                            })}
                                        </View>
                                    </View>
                                );
                            })}
                    </ScrollView>
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
    container: {
        backgroundColor: Colors.gray_3,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center'
    },

    wrapLine: {
        paddingHorizontal: 8,
        paddingVertical: 6
    },

    line: {
        width: '100%',
        height: 0.5,
        backgroundColor: Colors.gray_5
    }
});
