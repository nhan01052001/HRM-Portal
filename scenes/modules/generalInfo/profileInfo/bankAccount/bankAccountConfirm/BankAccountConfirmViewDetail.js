import React, { Component } from 'react';
import { View, ScrollView, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    stylesModalPopupBottom,
    Colors,
    Size,
    CustomStyleSheet
} from '../../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../../components/EmptyData/EmptyData';
import { BankAccountConfirmFunction } from './BankAccountConfirmBusinessFunction';
import DrawerServices from '../../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import HttpService from '../../../../../../utils/HttpService';
import VnrText from '../../../../../../components/VnrText/VnrText';
import Modal from 'react-native-modal';
import { VnrLoadingSevices } from '../../../../../../components/VnrLoading/VnrLoadingPages';
import VnrAttachFile from '../../../../../../components/VnrAttachFile/VnrAttachFile';
import { dataVnrStorage } from '../../../../../../assets/auth/authentication';
import { IconCancel, IconColse } from '../../../../../../constants/Icons';
import { TouchableOpacity } from 'react-native';
import { translate } from '../../../../../../i18n/translate';

const configDefault = [
    {
        TypeView: 'E_COMMON',
        Name: 'SalaryPaidAccountView',
        DisplayKey: 'SalaryPaidAccountView',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'GroupBank',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_GroupBank',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttach',
        DisplayKey: 'FileAttach',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_BankAccountInformation',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'AccountName',
        DisplayKey: 'HRM_Category_AccountType_AccountTypeName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'AccountNo',
        DisplayKey: 'BankAccountNo',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'BankName',
        DisplayKey: 'eBHXHD02TSTangCol46',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'BranchName',
        DisplayKey: 'HRM_Evaluation_EligibleEmployee_E_BRANCH',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'BankBrandName',
        DisplayKey: 'iBHXHD02TSTangCol47',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CountryName',
        DisplayKey: 'lblform_VisaInfo_CountryID',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ProvinceCodeName',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_ProvinceCodeNameGeneral',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Address',
        DisplayKey: 'Hre_SignatureRegister_owner_address',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SwiftCode',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_SwiftCodeGeneral',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SortCode',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_SortCodeGeneral',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateReleased',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_DateReleasedGeneral',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateExpired',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_DateExpiredGeneral',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IsCash',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_IsCashGeneral',
        DataType: 'bool'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IsRemainAmontByCash',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_IsRemainAmontByCashGeneral',
        DataType: 'bool'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'AmountTransfer',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_AmountTransferGeneral',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CurrencyName',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_CurrencyIDGeneral',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'AccountCompany1Name',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_AccountCompanyIDGeneral',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IBAN',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_IBANGeneral',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Note1',
        DisplayKey: 'HRM_Payroll_Sal_SalaryInformation_NoteGeneral',
        DataType: 'string'
    }
];

export default class BankAccountConfirmViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            //dataRowActionAndSelected: generateRowActionAndSelected(ScreenName.QualificationEdit),
            listActions: this.resultListActionHeader(),
            dataAttachFile: {
                data: null,
                modalVisibleAttachFile: false
            },
            FileAttach: {
                disable: false,
                refresh: false,
                value: null,
                visibleConfig: true,
                visible: true
            }
        };
    }

    resultListActionHeader = () => {
        const _params = this.props.navigation.state.params;
        if (_params && _params.listActions && Array.isArray(_params.listActions)) {
            return _params.listActions;
        }
        return [];
    };

    getDataItem = (isReload = false) => {
        try {
            const _params = this.props.navigation.state.params,
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);

            let _configListDetail = ConfigListDetail.value[screenName]
                ? ConfigListDetail.value[screenName]
                : configDefault;

            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                //
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                let profileID = dataVnrStorage.currentUser.info.ProfileID;
                HttpService.Get(
                    `[URI_HR]/Hre_GetData/getHreRequestInfo_HouseHoldCombine_byObjectID?ProfileID=${profileID}`
                ).then(res => {
                    let listTopConfig = [],
                        listAccountConfig = [],
                        listAccount = [];

                    if (dataItem.NumberOfAccount && dataItem.NumberOfAccount != 'E_ACCOUNTS_1') {
                        const findGpIndex = _configListDetail.findIndex(item => item.TypeView == 'E_GROUP');
                        if (findGpIndex != -1) {
                            _configListDetail.forEach((item, index) => {
                                if (index < findGpIndex) listTopConfig.push(item);
                                else if (index > findGpIndex) {
                                    listAccount.push(item);
                                    listAccountConfig.push(item);
                                }
                            });

                            listAccountConfig = [
                                {
                                    TypeView: 'E_GROUP',
                                    DisplayKey: translate('InformationApproved_Account') + ' 1',
                                    DataType: 'string',
                                    ValueColor: Colors.primary
                                }
                            ].concat(listAccountConfig);

                            let numberAccounts = dataItem.NumberOfAccount ? dataItem.NumberOfAccount.split('_')[2] : 0;
                            for (let i = 2; i <= parseInt(numberAccounts); i++) {
                                listAccountConfig = listAccountConfig.concat([
                                    {
                                        TypeView: 'E_GROUP',
                                        DisplayKey: `${translate('InformationApproved_Account')} ${i}`,
                                        DataType: 'string',
                                        ValueColor: Colors.primary
                                    }
                                ]);

                                listAccount.map(item => {
                                    if (item.Name == 'AccountCompany1Name') {
                                        listAccountConfig.push({
                                            ...item,
                                            Name: `AccountCompany${i}Name`
                                        });
                                    } else if (item.Name == 'Note1') {
                                        listAccountConfig.push({
                                            ...item,
                                            Name: `Note${i}`
                                        });
                                    } else {
                                        listAccountConfig.push({
                                            ...item,
                                            Name: `${item.Name}${i}`
                                        });
                                    }
                                });
                            }

                            if (res && res.length > 0) {
                                const lstChangeFromID = res.filter(item => item.OriginID == dataItem.ID);
                                listAccountConfig = listAccountConfig.map(item => {
                                    let itemChange = lstChangeFromID.find(e => e.FieldChange == item.FieldChange);

                                    if (item.FieldChange && itemChange && itemChange.InfoNew !== itemChange.InfoOld) {
                                        item = {
                                            ...item,
                                            ValueColor: Colors.purple
                                        };
                                    }
                                    return item;
                                });
                            }

                            this.setState({
                                configListDetail: [...listTopConfig, ...listAccountConfig],
                                dataItem: dataItem
                            });
                        }
                    } else {
                        if (res && res.length > 0) {
                            const lstChangeFromID = res.filter(item => item.OriginID == dataItem.ID);
                            _configListDetail = _configListDetail.map(item => {
                                let itemChange = lstChangeFromID.find(e => e.FieldChange == item.FieldChange);

                                if (item.FieldChange && itemChange && itemChange.InfoNew !== itemChange.InfoOld) {
                                    item = {
                                        ...item,
                                        ValueColor: Colors.purple
                                    };
                                }
                                return item;
                            });
                        }

                        this.setState({ configListDetail: _configListDetail, dataItem: dataItem });
                    }
                });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    reload = () => {
        //detail
        const { reloadScreenList, screenName } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');

        DrawerServices.navigate(screenName);
        //nếu action = Delete => back về danh sách
        // if (actionIsDelete) {
        //     DrawerServices.navigate(screenName);
        // }
        // else {
        //     this.getDataItem();
        // }
    };

    //#region  hiển thị số giờ lũy kế
    openModalAttachFile = itemID => {
        const { dataAttachFile, FileAttach } = this.state;
        if (!itemID) {
            return;
        }

        VnrLoadingSevices.show();
        HttpService.Get(`[URI_HR]/Att_GetData/GetSal_SalaryInformationById?ID=${itemID}`).then(res => {
            VnrLoadingSevices.hide();
            this.setState({
                dataAttachFile: {
                    ...dataAttachFile,
                    data: itemID,
                    modalVisibleAttachFile: true
                },
                FileAttach: {
                    ...FileAttach,
                    value: res.lstFileAttach ? res.lstFileAttach : null,
                    refresh: !FileAttach.refresh
                }
            });
        });
    };

    closeModalAttachFile = () => {
        const { dataAttachFile, FileAttach } = this.state;
        this.setState({
            dataAttachFile: {
                ...dataAttachFile,
                data: null,
                modalVisibleAttachFile: false
            },
            FileAttach: {
                ...FileAttach,
                value: null,
                refresh: !FileAttach.refresh
            }
        });
    };
    saveData = () => {
        const { dataAttachFile, FileAttach } = this.state;
        const params = {
            AttachFile: FileAttach.value ? FileAttach.value.map(item => item.fileName).join(',') : null,
            ID: dataAttachFile.data,
            IsPortal: true,
            UserSubmit: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.userid : null
        };

        this.setState(
            {
                dataAttachFile: {
                    ...dataAttachFile,
                    data: null,
                    modalVisibleAttachFile: false
                },
                FileAttach: {
                    ...FileAttach,
                    value: null,
                    refresh: !FileAttach.refresh
                }
            },
            () => {
                BankAccountConfirmFunction.businessSaveAttachFile(params);
            }
        );
    };
    //#endregion

    componentDidMount() {
        BankAccountConfirmFunction.setThisForBusiness(this);
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, listActions, FileAttach, dataAttachFile } = this.state,
            { containerItemDetail, bottomActions } = styleScreenDetail;
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
                <View style={[styleSheets.container]}>
                    {contentViewDetail}

                    {dataAttachFile.modalVisibleAttachFile && (
                        <Modal
                            onBackButtonPress={() => this.closeModalAttachFile()}
                            isVisible={true}
                            onBackdropPress={() => this.closeModalAttachFile()}
                            customBackdrop={
                                <TouchableWithoutFeedback onPress={() => this.closeModalAttachFile()}>
                                    <View
                                        style={styleSheets.coatingOpacity05}
                                    />
                                </TouchableWithoutFeedback>
                            }
                            style={CustomStyleSheet.margin(0)}
                        >
                            <View
                                style={[
                                    stylesModalPopupBottom.viewModalTime,
                                    {
                                        height: Size.deviceheight * 0.5
                                    }
                                ]}
                            >
                                <SafeAreaView {...styleSafeAreaView} style={stylesModalPopupBottom.safeRadius}>
                                    <View style={stylesModalPopupBottom.headerCloseModal}>
                                        <IconColse color={Colors.white} size={Size.iconSize} />
                                        <VnrText style={styleSheets.lable} i18nKey={'HRM_Common_FileAttach'} />
                                        <TouchableOpacity onPress={() => this.closeModalAttachFile()}>
                                            <IconCancel color={Colors.black} size={Size.iconSize} />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView
                                        style={styles.styleScrollView}
                                    >
                                        <VnrAttachFile
                                            disable={FileAttach.disable}
                                            value={FileAttach.value}
                                            multiFile={true}
                                            uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                            onFinish={file => {
                                                this.setState({
                                                    FileAttach: {
                                                        ...FileAttach,
                                                        value: file,
                                                        refresh: !FileAttach.refresh
                                                    }
                                                });
                                            }}
                                        />
                                    </ScrollView>
                                    <View style={[stylesModalPopupBottom.styleViewBntApprove, CustomStyleSheet.flex(0.2)]}>
                                        <TouchableOpacity
                                            onPress={() => this.saveData()}
                                            style={[stylesModalPopupBottom.bntApprove, CustomStyleSheet.maxHeight(40)]}
                                        >
                                            <VnrText
                                                style={[styleSheets.lable, { color: Colors.white }]}
                                                i18nKey={'HRM_Common_SaveClose'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </SafeAreaView>
                            </View>
                        </Modal>
                    )}
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styleScrollView: {
        flex: 0.8,
        flexGrow: 1,
        flexDirection: 'column',
        padding: Size.defineSpace
    }
})
