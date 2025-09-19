import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../../components/EmptyData/EmptyData';
import DrawerServices from '../../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import HttpService from '../../../../../../utils/HttpService';
import ManageFileSevice from '../../../../../../utils/ManageFileSevice';
import { translate } from '../../../../../../i18n/translate';

const configDefault = [
    {
        TypeView: 'E_STATUS',
        Name: 'StatusEvaView',
        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP_FILEATTACH',
        DisplayKey: 'HRM_PortalApp_ContractHistory_Contract',
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
        Name: 'ContractTypeName',
        DisplayKey: 'HRM_PortalApp_ContractHistory_ContractType',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateStart',
        NameSecond: 'DateEnd',
        DisplayKey: 'HRM_PortalApp_ContractHistory_ContractDuration',
        DataType: 'DateToFrom',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DurationView',
        DisplayKey: 'HRM_PortalApp_ContractHistory_DurationValue',
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
        Name: 'DateSigned',
        DisplayKey: 'HRM_PortalApp_ContractHistory_ContractDate',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Note',
        DisplayKey: 'HRM_PortalApp_ContractHistory_Note',
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
        Name: 'SalaryClassName',
        DisplayKey: 'HRM_PortalApp_ContractHistory_Level',
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
        Name: 'EmployeeTypeName',
        DisplayKey: 'HRM_PortalApp_ContractHistory_EmployeeType',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Salary',
        DisplayKey: 'HRM_PortalApp_ContractHistory_SalaryBasic',
        DataType: 'Double',
        DataFormat: '#.###,##',
        Unit: ''
    },
    {
        TypeView: 'E_COMMON',
        Name: 'KPIAmount',
        DisplayKey: 'HRM_PortalApp_ContractHistory_productivityBonus',
        DataType: 'Double',
        DataFormat: '#.###,##',
        Unit: ''
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalSalary',
        DisplayKey: 'HRM_PortalApp_ContractHistory_Salary',
        DataType: 'Double',
        DataFormat: '#.###,##',
        Unit: ''
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttach',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        DataType: 'FileAttach'
    }
];

const configDefaultExtend = [
    {
        TypeView: 'E_COMMON',
        Name: 'ContractNo',
        DisplayKey: 'HRM_PortalApp_ContractHistory_ContractNo',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateStartExtend',
        DisplayKey: 'HRM_PortalApp_ContractHistory_DateStartContract',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'AnnexCode',
        DisplayKey: 'HRM_PortalApp_ContractHistory_AnnexCode',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'AppendixContractName',
        DisplayKey: 'HRM_PortalApp_ContractHistory_AppendixContractName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateSignedAppendixContract',
        DisplayKey: 'HRM_PortalApp_ContractHistory_DateSignedAppendixContract',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateStart',
        DisplayKey: 'HRM_PortalApp_ContractHistory_AppendixTerm',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateEffectiveExtend',
        DisplayKey: 'HRM_PortalApp_ContractHistory_DateEffectiveExtend',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'NoteExtend',
        DisplayKey: 'HRM_PortalApp_ContractHistory_Note',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SalaryExtend',
        DisplayKey: 'HRM_PortalApp_ContractHistory_SalaryBasic',
        DataType: 'Double',
        DataFormat: '#.###,##',
        Unit: ''
    },
    {
        TypeView: 'E_COMMON',
        Name: 'KPIAmountExtend',
        DisplayKey: 'HRM_PortalApp_ContractHistory_productivityBonus',
        DataType: 'Double',
        DataFormat: '#.###,##',
        Unit: ''
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalSalaryExtend',
        DisplayKey: 'HRM_PortalApp_ContractHistory_Salary',
        DataType: 'Double',
        DataFormat: '#.###,##',
        Unit: ''
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttachExtend',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        DataType: 'FileAttach'
    }
];

export default class ContractHistoryConfirmedViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            configListDetailExtend: null
        };
    }

    getDataItem = () => {
        try {
            const _params = this.props.navigation.state.params,
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail =
                    ConfigListDetail.value[screenName] != null ? ConfigListDetail.value[screenName] : configDefault,
                _configListDetailExtend =
                    ConfigListDetail.value[`${screenName}Extend`] != null
                        ? ConfigListDetail.value[`${screenName}Extend`]
                        : configDefaultExtend;

            if (!Vnr_Function.CheckIsNullOrEmpty(dataItem) || dataId) {
                let ID = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;
                HttpService.Post(`[URI_CENTER]/api/Hre_Contract/GetContractByID/${ID}`).then(res => {
                    if (res && res.Data) {
                        const AttachFile = ManageFileSevice.setFileAttachApp(res.Data.AttachFile);
                        this.setState({
                            configListDetail: _configListDetail,
                            configListDetailExtend: _configListDetailExtend,
                            dataItem: {
                                ...res.Data,
                                ...dataItem,
                                lstFileAttach: AttachFile
                            }
                        });
                    } else {
                        this.setState({ dataItem: 'EmptyData' });
                    }
                });
                this.setState({ configListDetail: _configListDetail, dataItem });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    reload = (E_KEEP_FILTER, actionIsDelete) => {
        //detail
        const { reloadScreenList, screenName } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');

        //nếu action = Delete => back về danh sách
        if (actionIsDelete) {
            DrawerServices.navigate(screenName);
        } else {
            this.getDataItem();
        }
    };

    componentDidMount() {
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, configListDetailExtend, listActions } = this.state,
            { containerItemDetail, bottomActions } = styleScreenDetail;

        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={[styleSheets.col_10]}>
                    <ScrollView>
                        <View style={containerItemDetail}>
                            {configListDetail.map(e => {
                                return Vnr_Function.formatStringTypeV3(dataItem, e);
                            })}

                            {dataItem.ListContractExtend != null &&
                                dataItem.ListContractExtend.length > 0 &&
                                dataItem.ListContractExtend.map((item, index) => {
                                    if (item.AttachmentExtend) {
                                        const AttachFile = ManageFileSevice.setFileAttachApp(item.AttachmentExtend);
                                        item.lstFileAttachExtend = AttachFile;
                                    }

                                    return (
                                        <View
                                            key={index}
                                        >
                                            {Vnr_Function.formatStringTypeV3(
                                                {},
                                                {
                                                    TypeView: 'E_GROUP_FILEATTACH',
                                                    DisplayKey: `${translate(
                                                        'HRM_PortalApp_ContractHistory_AppendixContract'
                                                    )} ${index + 1}`,
                                                    DataType: 'string'
                                                }
                                            )}
                                            {configListDetailExtend.map(e => {
                                                return Vnr_Function.formatStringTypeV3(item, e);
                                            })}
                                        </View>
                                    );
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
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaView>
        );
    }
}
