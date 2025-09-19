import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../../components/EmptyData/EmptyData';
import DrawerServices from '../../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { RelativeWaitConfirmBusinessFunction } from '../relativeWaitConfirm/RelativeWaitConfirmBusinessFunction';

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
        DataType: 'string'
    },
    {
        Name: 'ProfileName',
        DisplayKey: 'ProfileName',
        DataType: 'string'
    },
    {
        Name: 'E_DEPARTMENT',
        DisplayKey: 'HRM_Eva_Performance_OrgStructureName',
        DataType: 'string'
    },
    {
        Name: 'SalaryClassName',
        DisplayKey: 'HRM_Payroll_BasicSalary_SalaryClassName',
        DataType: 'string'
    },
    {
        Name: 'PositionName',
        DisplayKey: 'HRM_HR_Profile_PositionName',
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
        DataType: 'string'
    },
    {
        Name: 'GenderView',
        DisplayKey: 'GenderView',
        DataType: 'string'
    },
    {
        Name: 'RelativeTypeName',
        DisplayKey: 'RelativeTypeName',
        DataType: 'string'
    },
    {
        Name: 'DateYearOfBirth',
        DisplayKey: 'DateOfBirth',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'YearOfLose',
        DisplayKey: 'YearOfLose',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'IDNo',
        DisplayKey: 'eBHXHD02TSGiamCol74',
        DataType: 'string'
    },
    {
        Name: 'IDDateOfIssue',
        DisplayKey: 'HRM_HR_Profile_IDDateOfIssue',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'IDDateOfExpiry',
        DisplayKey: 'HRM_PortalApp_IDExpiryDate',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttach',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IsCheckCompany',
        DisplayKey: 'HRM_HR_Relatives_IsCheckCompany',
        DataType: 'bool'
    },
    {
        Name: 'DateOfWedding',
        DisplayKey: 'HRM_HRE_Relatives_DateOfWedding',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'PhoneNumberView',
        DisplayKey: 'Hre_SignatureRegister_owner_mobile',
        DataType: 'string'
    },
    {
        Name: 'Career',
        DisplayKey: 'HRM_HR_Relatives_Career',
        DataType: 'string'
    },
    {
        Name: 'RelativeAddress',
        DisplayKey: 'HRM_Category_Cat_HRPlanningPeriod_Address',
        DataType: 'string'
    },
    {
        Name: 'RelativesIDPlaceOfIssueIDView',
        DisplayKey: 'Rec_CandidateProfile_PlaceOfIssueNewID',
        DataType: 'string'
    },
    {
        Name: 'RelativesIDPlaceOfIssue',
        DisplayKey: 'Rec_CandidateProfile_PlaceOfIssueNewID',
        DataType: 'string'
    },
    {
        Name: 'IdentificationNo',
        DisplayKey: 'HRM_HRE_Relatives_IdentificationNo',
        DataType: 'string'
    },
    {
        Name: 'RelativesIDCardIssuePlaceIDView',
        DisplayKey: 'HRM_HRE_Relatives_PlaceOfIssuanceOfIdentityCard',
        DataType: 'string'
    },
    {
        Name: 'PlaceOfIssuanceOfIdentityCard',
        DisplayKey: 'HRM_HRE_Relatives_PlaceOfIssuanceOfIdentityCard',
        DataType: 'string'
    },
    {
        Name: 'DateOfIssuanceOfIdentityCard',
        DisplayKey: 'HRM_HR_Rec_Candidate_IDCardDateOfIssue',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'ExpiryDateOfIdentityCard',
        DisplayKey: 'HRM_HR_IDCardDateOfExpiry',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'RelativesPassportNo',
        DisplayKey: 'HRM_HR_Profile_PassportNo',
        DataType: 'string'
    },
    {
        Name: 'RelativesPassportIssuePlaceIDView',
        DisplayKey: 'HRM_HR_Profile_PassportPlaceOfIssue',
        DataType: 'string'
    },
    {
        Name: 'RelativesPassportPlaceOfIssue',
        DisplayKey: 'HRM_HR_Profile_PassportPlaceOfIssue',
        DataType: 'string'
    },
    {
        Name: 'RelativesPassportDateOfIssue',
        DisplayKey: 'HRM_HR_Profile_PassportDateOfIssue',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'RelativesPassportDateOfExpiry',
        DisplayKey: 'HRM_HR_Profile_PassportDateOfExpiry',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'Notes',
        DisplayKey: 'HRM_Category_Cat_HRPlanningPeriod_Note',
        DataType: 'string'
    },
    {
        Name: 'DateUpdate',
        DisplayKey: 'HRM_HR_Profile_DateUpdate',
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
        DataType: 'string'
    },
    {
        Name: 'VolDocument',
        DisplayKey: 'HRM_HR_Relatives_VolDocument',
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
        DataType: 'string'
    },
    {
        Name: 'ProvinceName',
        DisplayKey: 'Hre_SignatureRegister_province',
        DataType: 'string'
    },
    {
        Name: 'DistrictName',
        DisplayKey: 'HRM_LabelInfo_District',
        DataType: 'string'
    },
    {
        Name: 'VillageName',
        DisplayKey: 'Cat_Village-Name',
        DataType: 'string'
    },
    {
        Name: 'Address',
        DisplayKey: 'HRM_HR_Relatives_Address',
        DataType: 'string'
    }
];

export default class RelativeConfirmedViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            //dataRowActionAndSelected: generateRowActionAndSelected(ScreenName.QualificationEdit),
            listActions: this.resultListActionHeader()
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
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[screenName]
                    ? ConfigListDetail.value[screenName]
                    : configDefault;

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
                this.setState({ configListDetail: _configListDetail, dataItem });
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

    // componentDidMount() {
    //     this.getDataItem();
    // }
    componentDidMount() {
        RelativeWaitConfirmBusinessFunction.setThisForBusiness(this);
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, listActions } = this.state,
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
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaView>
        );
    }
}
