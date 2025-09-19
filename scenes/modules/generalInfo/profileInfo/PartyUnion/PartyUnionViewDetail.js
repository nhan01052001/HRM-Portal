import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';

const configDefault = [
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_System_Resource_HR_ProfileInformationDetail',
        IsBold: true,
        DataType: 'string'
    },
    {
        Name: 'CodeEmp',
        DisplayKey: 'HRM_Hre_SignatureRegister_CodeEmp',
        DataType: 'string',
        FieldChange: 'CodeEmp'
    },
    {
        Name: 'ProfileName',
        DisplayKey: 'ProfileName',
        DataType: 'string',
        FieldChange: 'ProfileName'
    },
    {
        Name: 'OrgStructureName',
        DisplayKey: 'Hre_AnalyzeSuccessionTraining_OrgStructure',
        DataType: 'string',
        FieldChange: 'OrgStructureName'
    },
    {
        Name: 'SalaryClassName',
        DisplayKey: 'HRM_Payroll_BasicSalary_SalaryClassName',
        DataType: 'string',
        FieldChange: 'SalaryClassName'
    },
    {
        Name: 'PositionName',
        DisplayKey: 'HRM_HR_Profile_PositionName',
        DataType: 'string',
        FieldChange: 'PositionName'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PartyUnion',
        IsBold: true,
        DataType: 'string'
    },
    {
        Name: 'IsCommunistPartyMember',
        DisplayKey: 'HRM_HR_ProfilePartyUnion_IsCommunistPartyMember',
        DataType: 'bool'
    },
    {
        Name: 'CommunistPartyEnrolledDate',
        DisplayKey: 'HRM_HR_ProfilePartyUnion_CommunistPartyEnrolledDate',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'IsYouthUnionist',
        DisplayKey: 'HRM_HR_ProfilePartyUnion_IsYouthUnionist',
        DataType: 'bool'
    },
    {
        Name: 'YouthUnionEnrolledDate',
        DisplayKey: 'HRM_HR_ProfilePartyUnion_YouthUnionEnrolledDate',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'IsTradeUnionist',
        DisplayKey: 'HRM_HR_ProfilePartyUnion_IsTradeUnionist',
        DataType: 'bool'
    },
    {
        Name: 'AdmissionDate',
        DisplayKey: 'AdmissionDate',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    }
];

export default class ContractViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null
        };
    }

    getDataItem = (isReload = false) => {
        try {
            const _params = this.props.navigation.state.params,
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail =
                    ConfigListDetail.value[screenName] != null ? ConfigListDetail.value[screenName] : configDefault;

            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                // HttpService.Post(`[URI_HR]/Att_GetData/GetTamScanLogRegisterById`, {
                //     id: !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID,
                //     screenName: screenName,
                //     uri: dataVnrStorage.apiConfig.uriHr
                // })
                //     .then(res => {
                //         console.log(res);
                //         if (!Vnr_Function.CheckIsNullOrEmpty(res)) {
                //             this.setState({ configListDetail: _configListDetail, dataItem: res });
                //         }
                //         else {
                //             this.setState({ dataItem: 'EmptyData' });
                //         }
                //     });
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                this.setState({ configListDetail: _configListDetail, dataItem });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    componentDidMount() {
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail } = this.state,
            { containerItemDetail } = styleScreenDetail;

        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={[styleSheets.col_10]}>
                    <ScrollView>
                        <View style={containerItemDetail}>
                            {configListDetail.map(e => {
                                return Vnr_Function.formatStringTypeV2(dataItem, e);
                            })}
                        </View>
                    </ScrollView>
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
