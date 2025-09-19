import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView, Colors, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import VnrFormatStringType from '../../../../../componentsV3/VnrFormatStringType/VnrFormatStringType';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import Vnr_Services from '../../../../../utils/Vnr_Services';
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
        DisplayKey: 'HRM_PortalApp_ConcurrentInformation',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DecisionNo',
        DisplayKey: 'HRM_PortalApp_Concurrent_DecisionNo',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'OrgStructureConcurrent',
        DisplayKey: 'HRM_PortalApp_ConcurrentDepartment',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PositionConcurrent',
        DisplayKey: 'HRM_PortalApp_ConcurrentPosition',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'JobTitleConcurrent',
        DisplayKey: 'HRM_PortalApp_ConcurrentJobTitle',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SalaryClassConcurrent',
        DisplayKey: 'HRM_PortalApp_ConcurrentPayGrade',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateEffective',
        DisplayKey: 'HRM_PortalApp_HreMovementHistory_EffectiveDate',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateComeBack',
        DisplayKey: 'HRM_PortalApp_WorkHistory_ReturnDate',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateNotice',
        DisplayKey: 'HRM_PortalApp_Concurrent_AnnouncementDate',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    }
],
    configDefaultConCurrentAllowance = [
        {
            TypeView: 'E_COMMON',
            Name: 'UnusualAllowanceCfgName',
            DisplayKey: 'HRM_PortalApp_Concurrent_UnusualAllowance',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'TypeAllowance',
            DisplayKey: 'HRM_PortalApp_Concurrent_TypeAllowance',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'Amount',
            DisplayKey: 'HRM_PortalApp_AmountOfMoney',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'MonthStart',
            NameSecond: 'MonthEnd',
            DisplayKey: 'HRM_PortalApp_Concurrent_EffectiveTime',
            DataType: 'datetime',
            DataFormat: 'DD/MM/YYYY'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'Notes',
            DisplayKey: 'Note',
            DataType: 'string'
        }
    ];

// SpecializationName,Loại thử việc(check lại)
// các field chưa có

export default class HreConcurrentManageViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            configListDetailConCurrentAllowance: null
        };
    }

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[ScreenName.HreConcurrentManageViewDetail]
                    ? ConfigListDetail.value[ScreenName.HreConcurrentManageViewDetail]
                    : configDefault,
                _configListDetailConCurrentAllowance = ConfigListDetail.value[
                    ScreenName.HreConcurrentManageViewDetailAllowance
                ]
                    ? ConfigListDetail.value[ScreenName.HreConcurrentManageViewDetailAllowance]
                    : configDefaultConCurrentAllowance;
            let id = dataItem.ProfileID ? dataItem.ProfileID : dataItem.ID;
            if (id) {
                const dataBody = {
                    ConCurrentID: id
                };
                const response = await HttpService.Post(
                    '[URI_CENTER]/api/Hre_ProfileAPI/New_GetProfile_ConCurrentDetailPortal',
                    dataBody,
                    null,
                    this.reload
                );

                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = {
                        ...dataItem,
                        ...response.Data
                    };
                    if (Array.isArray(data?.ConcurrentInformation) && data?.ConcurrentInformation[0]) {
                        data = {
                            ...data,
                            ...data?.ConcurrentInformation[0]
                        };
                    }

                    data.itemStatus = Vnr_Services.formatStyleStatusApp(data.Status);
                    data.lstFileAttach = ManageFileSevice.setFileAttachApp(data.FileAttach);

                    this.setState({
                        configListDetail: _configListDetail,
                        dataItem: data,
                        configListDetailConCurrentAllowance: _configListDetailConCurrentAllowance
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
        const { dataItem, configListDetail, configListDetailConCurrentAllowance } = this.state,
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
                        {Array.isArray(dataItem?.ConcurrentAllowance) &&
                            Array.isArray(configListDetailConCurrentAllowance) &&
                            dataItem?.ConcurrentAllowance.map((item, index) => {
                                return (
                                    <View key={index} style={contentScroll}><View style={styles.container}>
                                        <Text style={[styleSheets.lable, CustomStyleSheet.marginLeft(6)]}>
                                            {`${translate(['HRM_PortalApp_ConcurrentAllowance'])}`}{' '}
                                            {dataItem?.ConcurrentAllowance.length > 1 ? index + 1 : ''}
                                        </Text>
                                    </View>
                                        <View style={containerItemDetail}>
                                            {configListDetailConCurrentAllowance.map(e => {
                                                if (e.TypeView != 'E_COMMON_PROFILE')
                                                    return (
                                                        <VnrFormatStringType
                                                            data={item}
                                                            col={e}
                                                            allConfig={configListDetail}
                                                        />
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
    }
});
