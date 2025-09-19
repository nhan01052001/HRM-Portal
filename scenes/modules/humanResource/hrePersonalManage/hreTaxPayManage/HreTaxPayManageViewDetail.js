import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    styleViewDetailHumanResource
} from '../../../../../constants/styleConfig';
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
            Name: 'E_SECTION',
            DisplayKey: '',
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
    configDefaultTaxPay = [
        {
            TypeView: 'E_COMMON',
            Name: 'OrderMonth',
            DisplayKey: 'HRM_PortalApp_TaxPay_Month',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'TotalGrossIncome',
            DisplayKey: 'HRM_PortalApp_TaxPay_GrossIncome',
            DataType: 'Double',
            DataFormat: '#.###,##',
            Unit: 'VND'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'TaxableIncome',
            DisplayKey: 'HRM_PortalApp_TaxPay_TaxableIncome',
            DataType: 'Double',
            DataFormat: '#.###,##',
            Unit: 'VND'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'DependantDeduction',
            DisplayKey: 'HRM_PortalApp_TaxPay_FamilyCircumstanceDeduction',
            DataType: 'Double',
            DataFormat: '#.###,##',
            Unit: 'VND'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'Charity',
            DisplayKey: 'HRM_PortalApp_TaxPay_TotalCharitable',
            DataType: 'Double',
            DataFormat: '#.###,##',
            Unit: 'VND'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'TotalIns',
            DisplayKey: 'HRM_PortalApp_TaxPay_TotalInsurance',
            DataType: 'Double',
            DataFormat: '#.###,##',
            Unit: 'VND'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'OtherIncome',
            DisplayKey: 'HRM_PortalApp_TaxPay_OtherIncome',
            DataType: 'Double',
            DataFormat: '#.###,##',
            Unit: 'VND'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'AssessableIncome',
            DisplayKey: 'HRM_PortalApp_TaxPay_TaxCountIncome',
            DataType: 'Double',
            DataFormat: '#.###,##',
            Unit: 'VND'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'DeductedPIT',
            DisplayKey: 'HRM_PortalApp_TaxPay_DeductedPIT',
            DataType: 'Double',
            DataFormat: '#.###,##',
            Unit: 'VND'
        }
    ];

export default class HreTaxPayManageViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            configListDetailTaxPay: null
        };
    }

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[ScreenName.HreTaxPayManageViewDetail]
                    ? ConfigListDetail.value[ScreenName.HreTaxPayManageViewDetail]
                    : configDefault,
                _configListDetailTaxPay = ConfigListDetail.value[ScreenName.HreTaxPayManageViewDetailTaxPay]
                    ? ConfigListDetail.value[ScreenName.HreTaxPayManageViewDetailTaxPay]
                    : configDefaultTaxPay;
            let id = dataItem.ProfileID ? dataItem.ProfileID : dataItem.ID;
            if (id) {
                const dataBody = {
                    ID: id
                };
                const response = await HttpService.Post(
                    '[URI_CENTER]/api/Hre_TaxInfo/GetDataDetailTaxByID',
                    dataBody,
                    null,
                    this.reload
                );
                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = {
                        ...dataItem,
                        ...response.Data
                    };
                    if (response.Data['listPit'] && response.Data['listPit'][0]) {
                        data = {
                            ...data,
                            ...response.Data['listPit'][0]
                        };
                    }

                    data.itemStatus = Vnr_Services.formatStyleStatusApp(data.Status);
                    data.lstFileAttach = ManageFileSevice.setFileAttachApp(data.FileAttach);
                    this.setState({
                        configListDetail: _configListDetail,
                        dataItem: data,
                        configListDetailTaxPay: _configListDetailTaxPay
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
        const { dataItem, configListDetail, configListDetailTaxPay } = this.state,
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
                        {Array.isArray(dataItem?.listPit) &&
                            dataItem?.listPit.length > 0 &&
                            dataItem?.listPit.map((item, index) => {
                                return (
                                    <View style={contentScroll}>
                                        {index !== 0 ? (
                                            <View style={styleViewDetailHumanResource.wrapLine}>
                                                <View style={styleViewDetailHumanResource.line} />
                                            </View>
                                        ) : (
                                            <View style={styleViewDetailHumanResource.container}>
                                                <Text style={[styleSheets.lable, { marginLeft: 6 }]}>
                                                    {`${translate(['HRM_PortalApp_MonthlyTaxInformationForMonth'])}`}
                                                    {dataItem?.Year}
                                                </Text>
                                            </View>
                                        )}
                                        <View style={containerItemDetail}>
                                            {configListDetailTaxPay.map(e => {
                                                return Vnr_Function.formatStringTypeV3(item, e, configListDetailTaxPay);
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
