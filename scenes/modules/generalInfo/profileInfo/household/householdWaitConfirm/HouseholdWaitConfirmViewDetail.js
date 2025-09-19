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
import { HouseholdWaitConfirmBusinessFunction } from './HouseholdWaitConfirmBusinessFunction';
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

const configDefault = [
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_HR_Profile_Info',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CodeEmp',
        DisplayKey: 'HRM_HR_Profile_CodeEmp',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ProfileName',
        DisplayKey: 'HRM_HR_Profile_ProfileName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'OrgStructureName',
        DisplayKey: 'HRM_Eva_Performance_OrgStructureName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SalaryClassName',
        DisplayKey: 'HRM_Payroll_BasicSalary_SalaryClassName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PositionName',
        DisplayKey: 'HRM_HR_Profile_PositionName',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Household_FamilyMemberInfo',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'RelativeName',
        FieldChange: 'RelativeName',
        DisplayKey: 'HRM_Hre_HouseholdInfo_RelativeName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'HouseholdTypeName',
        FieldChange: 'HouseholdTypeID',
        DisplayKey: 'HouseholdTypeName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'HouseholdInfoNo',
        FieldChange: 'HouseholdInfoNo',
        DisplayKey: 'HRM_Hre_HouseholdInfo_No',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'BookNo',
        FieldChange: 'BookNo',
        DisplayKey: 'HRM_Hre_HouseholdInfo_BookNo',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'GenderView',
        FieldChange: 'Gender',
        DisplayKey: 'GenderView',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateOfBirth',
        FieldChange: 'DateOfBirth',
        DisplayKey: 'HRM_HR_Dependant_DateOfBirth',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'NationalityName',
        FieldChange: 'NationalityID',
        DisplayKey: 'HRM_HR_Profile_NationalityName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'HouseholdInfoNationality2Name',
        FieldChange: 'Nationality2ID',
        DisplayKey: 'HRM_Hre_HouseholdInfo_Nationality2ID',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'EthnicGroupName',
        FieldChange: 'EthnicID',
        DisplayKey: 'HRM_Insurance_ChangeInsInfoRegister_People',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SocialInsNo',
        FieldChange: 'SocialInsNo',
        DisplayKey: 'HRM_Hre_HouseholdInfo_SocialInsNo',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IsInsuranceStatus',
        FieldChange: 'IsInsuranceStatus',
        DisplayKey: 'HRM_Hre_HouseholdInfo_IsInsuranceStatus',
        DataType: 'bool'
    },
    {
        TypeView: 'E_NODATA',
        Name: '',
        DisplayKey: 'HRM_Hre_HouseholdInfo_AttachImage',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttachImage',
        FieldChange: 'AttachImage',
        DisplayKey: 'HRM_Hre_HouseholdInfo_AttachImage',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Notes',
        FieldChange: 'Notes',
        DisplayKey: 'Notes',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Household_FamilyMemberBirthReg',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ProvinceBirthCertificateName',
        FieldChange: 'ProvinceBirthCertificateID',
        DisplayKey: 'HRM_HR_Profile_TAProvince',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DistrictBirthCertificateName',
        FieldChange: 'DistrictBirthCertificateID',
        DisplayKey: 'HRM_HR_Profile_TADistrict',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'VillageBirthCertificateName',
        FieldChange: 'VillageBirthCertificateID',
        DisplayKey: 'HRM_HR_Profile_Village',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'HouseholdIssuePlace',
        FieldChange: 'HouseholdIssuePlace',
        DisplayKey: 'HRM_Hre_HouseholdInfo_HouseholdIssuePlace',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateUpdate',
        FieldChange: 'DateUpdate',
        DisplayKey: 'HRM_Category_LeaveDayType_DateUpdate',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_STATUS',
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_LateEarlyAllowed_Status',
        DataType: 'string'
    }
];

export default class HouseholdWaitConfirmViewDetail extends Component {
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
        HttpService.Get(`[URI_HR]/Att_GetData/GetByIdHouseHoldTotal?ID=${itemID}`).then(res => {
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
                HouseholdWaitConfirmBusinessFunction.businessSaveAttachFile(params);
            }
        );
    };
    //#endregion

    componentDidMount() {
        HouseholdWaitConfirmBusinessFunction.setThisForBusiness(this);
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
