import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';

const configDefault = [
    {
        TypeView: 'E_GROUP_PROFILE',
        DisplayKey: 'ProfileNameViewNew',
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
        Name: 'PositionName',
        DisplayKey: 'HRM_HR_Profile_PositionName',
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
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Hre_Accident_TabStripInformation_Accident',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'AccidentTypeName',
        DisplayKey: 'HRM_HR_Accident_AccidentTypeName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Date',
        DisplayKey: 'HRM_HR_Accident_Date',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TimeHappen',
        DisplayKey: 'HRM_HR_Accident_TimeHappen',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Place',
        DisplayKey: 'HRM_HR_Accident_Place',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'FirstMoney',
        DisplayKey: 'HRM_HR_Accident_FirstMoney',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'RealMoney',
        DisplayKey: 'HRM_HR_Accident_RealMoney',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CompanyPay',
        DisplayKey: 'HRM_HR_Accident_CompanyPay',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'InsPay',
        DisplayKey: 'HRM_HR_Accident_InsPay',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'OtherInspaid',
        DisplayKey: 'HRM_HR_Accident_OtherInspaid',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Description',
        DisplayKey: 'HRM_HR_Accident_Description',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttach',
        DisplayKey: 'FileAttach',
        DataType: 'FileAttach'
    }
];

export default class HreAccidentManageViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null
        };
    }

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail =
                    ConfigListDetail.value[ScreenName.HreAccidentManageViewDetail] != null
                        ? ConfigListDetail.value[ScreenName.HreAccidentManageViewDetail]
                        : configDefault;
            let id = dataItem.ProfileID ? dataItem.ProfileID : dataItem.ID;
            if (id) {
                const dataBody = {
                    AccidentID: id
                };
                const response = await HttpService.Post(
                    '[URI_CENTER]/api/Hre_ProfileAPI/New_GetProfileAccidentDetailPortal',
                    dataBody,
                    null,
                    this.reload
                );
                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = {
                        ...dataItem,
                        ...response.Data
                    };
                    if (
                        response.Data['Hre_ProfileAccidentDetailModel'] &&
                        response.Data['Hre_ProfileAccidentDetailModel'][0]
                    ) {
                        data = {
                            ...data,
                            ...response.Data['Hre_ProfileAccidentDetailModel'][0]
                        };
                    }

                    data.lstFileAttach = ManageFileSevice.setFileAttachApp(data.FileAttach);
                    this.setState({ configListDetail: _configListDetail, dataItem: data });
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
        const { dataItem, configListDetail } = this.state,
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
