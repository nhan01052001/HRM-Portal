import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    styleViewDetailHumanResource,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import { translate } from '../../../../../i18n/translate';

const configDefault = [
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
        Name: 'E_SECTION',
        DisplayKey: '',
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
        Name: 'JobTitleName',
        DisplayKey: 'HRM_HR_Profile_JobTitleName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'PositionName',
        DisplayKey: 'HRM_HR_Profile_PositionName',
        DataType: 'string'
    }
],
    configDefaultDisciplineInformation = [
        {
            TypeView: 'E_COMMON',
            Name: 'DateOfViolation',
            DisplayKey: 'HRM_PortalApp_DateOfViolation',
            DataType: 'datetime',
            DataFormat: 'DD/MM/YYYY'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'DecisionNo',
            DisplayKey: 'HRM_PortalApp_DecisionNo',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'CountDis',
            DisplayKey: 'HRM_PortalApp_CountDiscipline',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'DisciplineTypeName',
            DisplayKey: 'HRM_PortalApp_DisciplineType',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'EffectiveTime',
            DisplayKey: 'HRM_PortalApp_Discipline_EffectiveTime',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'AmountOfFine',
            DisplayKey: 'HRM_PortalApp_AmountOfFine',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'DisciplineResonName',
            DisplayKey: 'HRM_PortalApp_DisciplineReson',
            DataType: 'string'
        },
        {
            TypeView: 'E_FILEATTACH',
            Name: 'lstFileAttach',
            DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
            DataType: 'FileAttach'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'Notes',
            DisplayKey: 'HRM_PortalApp_TSLRegister_Comment',
            DataType: 'string'
        }
    ];

// SpecializationName,Loại thử việc(check lại)
// các field chưa có

export default class HreDisciplineManageViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            configListDetailDisciplineInformation: null
        };
    }

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[ScreenName.HreDisciplineManageViewDetail]
                    ? ConfigListDetail.value[ScreenName.HreDisciplineManageViewDetail]
                    : configDefault,
                _configListDetailDisciplineInformation = ConfigListDetail.value[
                    ScreenName.HreDisciplineManageViewDetailDisciplineInformation
                ]
                    ? ConfigListDetail.value[ScreenName.HreDisciplineManageViewDetailDisciplineInformation]
                    : configDefaultDisciplineInformation;
            let id = dataItem?.ID;
            if (id) {
                const dataBody = {
                    ID: id
                };
                const response = await HttpService.Post(
                    '[URI_CENTER]/api/Hre_Discipline/New_GetDisciplineDetailPortal',
                    dataBody,
                    null,
                    this.reload
                );

                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = {
                        ...dataItem,
                        ...response.Data
                    };
                    if (Array.isArray(data?.DisciplineInformation)) {
                        data?.DisciplineInformation.forEach((item) => {
                            item.lstFileAttach = ManageFileSevice.setFileAttachApp(item.Attachment);
                        });
                    }

                    this.setState({
                        configListDetail: _configListDetail,
                        dataItem: data,
                        configListDetailDisciplineInformation: _configListDetailDisciplineInformation
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
        const { dataItem, configListDetail, configListDetailDisciplineInformation } = this.state,
            { containerItemDetail, contentScroll } = styleScreenDetail;

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
                        </View>
                        {Array.isArray(dataItem?.DisciplineInformation) &&
                            dataItem?.DisciplineInformation.length > 0 &&
                            dataItem?.DisciplineInformation.map((item, index) => {
                                return (
                                    <View key={index} style={contentScroll}>
                                        {index !== 0 ? (
                                            <View style={styleViewDetailHumanResource.wrapLine}>
                                                <View style={styleViewDetailHumanResource.line} />
                                            </View>
                                        ) : (
                                            <View style={styleViewDetailHumanResource.container}>
                                                <Text style={[styleSheets.lable, CustomStyleSheet.marginLeft(6)]}>
                                                    {`${translate(['HRM_PortalApp_DisciplineInformation'])}`}
                                                </Text>
                                            </View>
                                        )}
                                        <View style={containerItemDetail}>
                                            {configListDetailDisciplineInformation.map((e) => {
                                                return Vnr_Function.formatStringTypeV3(
                                                    item,
                                                    e,
                                                    configListDetailDisciplineInformation
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
