import React, { Component } from 'react';
import { View, ScrollView, TouchableWithoutFeedback, TouchableOpacity, StyleSheet } from 'react-native';
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
import VnrText from '../../../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { PassportWaitConfirmBusinessFunction } from './PassportWaitConfirmBusinessFunction';
import Modal from 'react-native-modal';
import { VnrLoadingSevices } from '../../../../../../components/VnrLoading/VnrLoadingPages';
import VnrAttachFile from '../../../../../../components/VnrAttachFile/VnrAttachFile';
import { IconCancel, IconColse } from '../../../../../../constants/Icons';

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
        DisplayKey: 'HRM_Eva_Performance_OrgStructureName',
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
        DisplayKey: 'HRM_Sys_Hre_Passport',
        IsBold: true,
        DataType: 'string'
    },
    {
        Name: 'PassportNo',
        DisplayKey: 'HRM_HR_Profile_PassportNo',
        DataType: 'string',
        FieldChange: 'PassportNo'
    },
    {
        Name: 'PassportDateOfIssue',
        DisplayKey: 'HRM_HR_Profile_PassportDateOfIssue',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY',
        FieldChange: 'PassportDateOfIssue'
    },
    {
        Name: 'PassportDateOfExpiry',
        DisplayKey: 'HRM_HR_Profile_PassportDateOfExpiry',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY',
        FieldChange: 'PassportDateOfExpiry'
    },
    {
        Name: 'CountryName',
        DisplayKey: 'CountryName',
        DataType: 'string',
        FieldChange: 'CountryID'
    },
    {
        Name: 'PassportPlaceNewName',
        DisplayKey: 'PassportPlaceNewName',
        DataType: 'string',
        FieldChange: 'PassportPlaceNewID'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttach',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        DataType: 'FileAttach',
        FieldChange: 'Attachment'
    }
];

export default class PassportWaitConfirmViewDetail extends Component {
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

    // rowActionsHeaderRight = (dataItem) => {
    //     let _listActions = [];
    //     const { rowActions } = this.state.dataRowActionAndSelected;

    //     if (!Vnr_Function.CheckIsNullOrEmpty(rowActions) && !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction)) {
    //         _listActions = rowActions.filter(
    //             (item) => {
    //                 return dataItem.BusinessAllowAction.indexOf(item.type) >= 0
    //             });
    //     }
    //     return _listActions;
    // }

    getDataItem = (isReload = false) => {
        try {
            const _params = this.props.navigation.state.params,
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);
            let _configListDetail = ConfigListDetail.value[screenName]
                ? ConfigListDetail.value[screenName]
                : configDefault;

            if (!Vnr_Function.CheckIsNullOrEmpty(dataItem) || !Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                let profileID = dataVnrStorage.currentUser.info.ProfileID;
                let ID = dataItem?.ID ? dataItem.ID : dataId ? dataId : null;
                HttpService.MultiRequest([
                    HttpService.Get(
                        `[URI_HR]/Hre_GetDataV2/getHreRequestInfo_Common_ByOriginID?ProfileID=${profileID}&tableChange=Hre_Passport`
                    ),
                    HttpService.Get(`[URI_HR]/Hre_GetDataV2/GetById_Passport?ID=${ID}`)
                ]).then(resAll => {
                    if (Array.isArray(resAll) && resAll.length === 2) {
                        const [listFieldChange, listData] = resAll;
                        let nextStatte = {};
                        if (listFieldChange && listFieldChange.length > 0) {
                            const lstChangeFromID = listFieldChange.filter(item => item.OriginID == ID);
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

                        if (!dataItem) {
                            nextStatte = {
                                ...nextStatte,
                                ...listData
                            };
                        }

                        this.setState({
                            configListDetail: _configListDetail,
                            dataItem: { ...dataItem, ...nextStatte, lstFileAttach: listData?.lstFileAttach }
                        });
                    }
                });
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

    //#region  hiển thị số giờ lũy kế
    openModalAttachFile = itemID => {
        const { dataAttachFile, FileAttach } = this.state;
        if (!itemID) {
            return;
        }

        VnrLoadingSevices.show();
        HttpService.Get(`[URI_HR]/Hre_GetData/GetByIdAttachFile_RelativesCombineGrid?ID=${itemID}`).then(res => {
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
                PassportWaitConfirmBusinessFunction.businessSaveAttachFile(params);
            }
        );
    };
    //#endregion

    componentDidMount() {
        PassportWaitConfirmBusinessFunction.setThisForBusiness(this);
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
                                        style={styles.stylesScrollView}
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
    stylesScrollView: {
        flex: 0.8,
        flexGrow: 1,
        flexDirection: 'column',
        padding: Size.defineSpace
    }
})
