import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView, Size, Colors } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import VnrText from '../../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import DrawerServices from '../../../../../utils/DrawerServices';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import TouchIDService from '../../../../../utils/TouchIDService';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';

const configDefault = [
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
        Name: 'Note',
        DisplayKey: 'HRM_PortalApp_ContractHistory_Note',
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
        DisplayKey: 'HRM_PortalApp_ContractHistory_ProductivityBonus',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalSalary',
        DisplayKey: 'HRM_PortalApp_ContractHistory_Salary',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttach',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        DataType: 'FileAttach'
    }
];

export default class ContractV3ViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            isSuccessPass: false
        };

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            DrawerServices.getBeforeScreen() != 'ContractHistoryAll' &&
                DrawerServices.getBeforeScreen() != 'ContractHistoryConfirmed' &&
                DrawerServices.getBeforeScreen() != 'ContractHistoryWaitConfirm' &&
                TouchIDService.checkConfirmPass(this.onFinish.bind(this), 'E_CONTRACT');
        });
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    onFinish = isSuccess => {
        if (isSuccess) {
            this.setState({ isSuccessPass: true }, () => this.getDataItem());
        } else DrawerServices.goBack();
    };

    getDataItem = (isReload = false) => {
        try {
            const _params = this.props.navigation.state.params,
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[screenName]
                    ? ConfigListDetail.value[screenName]
                    : configDefault;

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
                const AttachFile = ManageFileSevice.setFileAttachApp(dataItem.AttachFile);
                this.setState({
                    configListDetail: _configListDetail,
                    dataItem: {
                        ...dataItem,
                        lstFileAttach: AttachFile
                    }
                });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    render() {
        const { dataItem, isSuccessPass, configListDetail } = this.state,
            { containerItemDetail } = styleScreenDetail;

        let contentViewDetail = isSuccessPass && <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={[styleSheets.col_10]}>
                    <ScrollView>
                        <View style={containerItemDetail}>
                            {configListDetail.map(e => {
                                return Vnr_Function.formatStringTypeV3(dataItem, e);
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
                <View style={[styleSheets.container]}>
                    {contentViewDetail}

                    {PermissionForAppMobile &&
                        PermissionForAppMobile.value['HR_HistoryContract_Index'] &&
                        PermissionForAppMobile.value['HR_HistoryContract_Index']['View'] && (
                        <TouchableOpacity
                            onPress={() => DrawerServices.navigate('ContractHistoryAll')}
                            style={styles.btnContractHistoryAll}
                        >
                            <VnrText
                                style={[styleSheets.lable, { color: Colors.primary }]}
                                i18nKey="HRM_PortalApp_ContractHistory_Title"
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    btnContractHistoryAll: {
        height: 50,
        width: Size.deviceWidth,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
