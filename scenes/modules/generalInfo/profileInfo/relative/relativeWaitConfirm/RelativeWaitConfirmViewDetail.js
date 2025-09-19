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
import { RelativeWaitConfirmBusinessFunction } from './RelativeWaitConfirmBusinessFunction';
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
        FieldChange: 'CodeEmp',
        DataType: 'string'
    },
    {
        Name: 'ProfileName',
        DisplayKey: 'ProfileName',
        FieldChange: 'ProfileName',
        DataType: 'string'
    },
    {
        Name: 'E_DEPARTMENT',
        DisplayKey: 'HRM_Eva_Performance_OrgStructureName',
        FieldChange: 'E_DEPARTMENT',
        DataType: 'string'
    },
    {
        Name: 'SalaryClassName',
        DisplayKey: 'HRM_Payroll_BasicSalary_SalaryClassName',
        FieldChange: 'SalaryClassName',
        DataType: 'string'
    },
    {
        Name: 'PositionName',
        DisplayKey: 'HRM_HR_Profile_PositionName',
        FieldChange: 'PositionName',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Hre_Relatives_TabStripRelative',
        IsBold: true,
        DataType: 'string'
    },
    {
        Name: 'RelativeName',
        DisplayKey: 'RelativeName',
        FieldChange: 'RelativeName',
        DataType: 'string'
    },
    {
        Name: 'GenderView',
        DisplayKey: 'GenderView',
        FieldChange: 'Gender',
        DataType: 'string'
    },
    {
        Name: 'RelativeTypeName',
        DisplayKey: 'RelativeTypeName',
        FieldChange: 'RelativeTypeID',
        DataType: 'string'
    },
    {
        Name: 'DateYearOfBirth',
        DisplayKey: 'DateOfBirth',
        FieldChange: 'YearOfBirth',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'YearOfLose',
        DisplayKey: 'YearOfLose',
        FieldChange: 'YearOfLose',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'IDNo',
        DisplayKey: 'eBHXHD02TSGiamCol74',
        FieldChange: 'IDNo',
        DataType: 'string'
    },
    {
        Name: 'IDDateOfIssue',
        DisplayKey: 'HRM_HR_Profile_IDDateOfIssue',
        FieldChange: 'IDDateOfIssue',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'IDDateOfExpiry',
        DisplayKey: 'HRM_PortalApp_IDExpiryDate',
        FieldChange: 'IDDateOfExpiry',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttach',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        FieldChange: 'lstFileAttach',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IsCheckCompany',
        DisplayKey: 'HRM_HR_Relatives_IsCheckCompany',
        FieldChange: 'IsCheckCompany',
        DataType: 'bool'
    },
    {
        Name: 'DateOfWedding',
        DisplayKey: 'HRM_HRE_Relatives_DateOfWedding',
        FieldChange: 'DateOfWedding',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'PhoneNumberView',
        DisplayKey: 'Hre_SignatureRegister_owner_mobile',
        FieldChange: 'PhoneNumber',
        DataType: 'string'
    },
    {
        Name: 'Career',
        DisplayKey: 'HRM_HR_Relatives_Career',
        FieldChange: 'Career',
        DataType: 'string'
    },
    {
        Name: 'RelativeAddress',
        DisplayKey: 'HRM_Category_Cat_HRPlanningPeriod_Address',
        FieldChange: 'Address',
        DataType: 'string'
    },
    {
        Name: 'RelativesIDPlaceOfIssueIDView',
        DisplayKey: 'Rec_CandidateProfile_PlaceOfIssueNewID',
        FieldChange: 'RelativesIDPlaceOfIssueIDView',
        DataType: 'string'
    },
    {
        Name: 'RelativesIDPlaceOfIssue',
        DisplayKey: 'Rec_CandidateProfile_PlaceOfIssueNewID',
        FieldChange: 'RelativesIDPlaceOfIssue',
        DataType: 'string'
    },
    {
        Name: 'IdentificationNo',
        DisplayKey: 'HRM_HRE_Relatives_IdentificationNo',
        FieldChange: 'IdentificationNo',
        DataType: 'string'
    },
    {
        Name: 'RelativesIDCardIssuePlaceIDView',
        DisplayKey: 'HRM_HRE_Relatives_PlaceOfIssuanceOfIdentityCard',
        FieldChange: 'RelativesIDCardIssuePlaceIDView',
        DataType: 'string'
    },
    {
        Name: 'PlaceOfIssuanceOfIdentityCard',
        DisplayKey: 'HRM_HRE_Relatives_PlaceOfIssuanceOfIdentityCard',
        FieldChange: 'PlaceOfIssuanceOfIdentityCard',
        DataType: 'string'
    },
    {
        Name: 'DateOfIssuanceOfIdentityCard',
        DisplayKey: 'HRM_HR_Rec_Candidate_IDCardDateOfIssue',
        FieldChange: 'DateOfIssuanceOfIdentityCard',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'ExpiryDateOfIdentityCard',
        DisplayKey: 'HRM_HR_IDCardDateOfExpiry',
        FieldChange: 'ExpiryDateOfIdentityCard',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'RelativesPassportNo',
        DisplayKey: 'HRM_HR_Profile_PassportNo',
        FieldChange: 'RelativesPassportNo',
        DataType: 'string'
    },
    {
        Name: 'RelativesPassportIssuePlaceIDView',
        DisplayKey: 'HRM_HR_Profile_PassportPlaceOfIssue',
        FieldChange: 'RelativesPassportIssuePlaceIDView',
        DataType: 'string'
    },
    {
        Name: 'RelativesPassportPlaceOfIssue',
        DisplayKey: 'HRM_HR_Profile_PassportPlaceOfIssue',
        FieldChange: 'RelativesPassportPlaceOfIssue',
        DataType: 'string'
    },
    {
        Name: 'RelativesPassportDateOfIssue',
        DisplayKey: 'HRM_HR_Profile_PassportDateOfIssue',
        FieldChange: 'RelativesPassportDateOfIssue',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'RelativesPassportDateOfExpiry',
        DisplayKey: 'HRM_HR_Profile_PassportDateOfExpiry',
        FieldChange: 'RelativesPassportDateOfExpiry',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'Notes',
        DisplayKey: 'HRM_Category_Cat_HRPlanningPeriod_Note',
        FieldChange: 'Notes',
        DataType: 'string'
    },
    {
        Name: 'DateUpdate',
        DisplayKey: 'HRM_HR_Profile_DateUpdate',
        FieldChange: 'DateUpdate',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Household_FamilyMemberBirthReg',
        IsBold: true,
        DataType: 'string'
    },
    {
        Name: 'NoDocument',
        DisplayKey: 'FIN_ClaimItem_DocumentNumber',
        FieldChange: 'NoDocument',
        DataType: 'string'
    },
    {
        Name: 'VolDocument',
        DisplayKey: 'HRM_HR_Relatives_VolDocument',
        FieldChange: 'VolDocument',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Portal_Dependents_Registered_NPT',
        IsBold: true,
        DataType: 'string'
    },
    {
        Name: 'CountryName',
        DisplayKey: 'CountryName',
        FieldChange: 'CountryName',
        DataType: 'string'
    },
    {
        Name: 'ProvinceName',
        DisplayKey: 'Hre_SignatureRegister_province',
        FieldChange: 'ProvinceName',
        DataType: 'string'
    },
    {
        Name: 'DistrictName',
        DisplayKey: 'HRM_LabelInfo_District',
        FieldChange: 'DistrictName',
        DataType: 'string'
    },
    {
        Name: 'VillageName',
        DisplayKey: 'Cat_Village-Name',
        FieldChange: 'VillageName',
        DataType: 'string'
    },
    {
        Name: 'Address',
        DisplayKey: 'HRM_HR_Relatives_Address',
        FieldChange: 'Address',
        DataType: 'string'
    },
    {
        TypeView: 'E_STATUS',
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_LateEarlyAllowed_Status',
        DataType: 'string'
    }
];

export default class RelativeWaitConfirmViewDetail extends Component {
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

            // dataItem.BusinessAllowAction = ['E_DELETE', 'E_MODIFY', 'E_SENDMAIL']
            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                // let ID = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;
                // HttpService.Get(`[URI_HR]/Hre_GetData/GetByIdEdit_ProfileQualification?ID=${ID}`)
                //     .then(res => {
                //         console.log(res, 'resresres');
                //         if (!Vnr_Function.CheckIsNullOrEmpty(res)) {
                //             this.setState({ configListDetail: _configListDetail, dataItem: res });
                //         }
                //         else {
                //             this.setState({ dataItem: 'EmptyData' });
                //         }
                //     });
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                let profileID = dataVnrStorage.currentUser.info.ProfileID;
                HttpService.Get(
                    `[URI_HR]/Hre_GetData/getHreRequestInfo_RelativesCombine_byObjectID?ProfileID=${profileID}`
                ).then(res => {
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
                    this.setState({ configListDetail: _configListDetail, dataItem });
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
                RelativeWaitConfirmBusinessFunction.businessSaveAttachFile(params);
            }
        );
    };
    //#endregion

    componentDidMount() {
        RelativeWaitConfirmBusinessFunction.setThisForBusiness(this);
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
