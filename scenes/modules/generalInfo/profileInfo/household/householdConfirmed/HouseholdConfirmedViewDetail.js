import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../../components/EmptyData/EmptyData';
import { HouseholdConfirmedBusinessFunction } from './HouseholdConfirmedBusinessFunction';
import DrawerServices from '../../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../../components/ListButtonMenuRight/ListButtonMenuRight';

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
        Name: 'RelativeName',
        DisplayKey: 'HRM_Hre_HouseholdInfo_RelativeName',
        DataType: 'string'
    },
    {
        Name: 'HouseholdTypeName',
        DisplayKey: 'HouseholdTypeName',
        DataType: 'string'
    },
    {
        Name: 'HouseholdInfoNo',
        DisplayKey: 'HRM_Hre_HouseholdInfo_No',
        DataType: 'string'
    },
    {
        Name: 'BookNo',
        DisplayKey: 'HRM_Hre_HouseholdInfo_BookNo',
        DataType: 'string'
    },
    {
        Name: 'GenderView',
        DisplayKey: 'GenderView',
        DataType: 'string'
    },
    {
        Name: 'DateOfBirth',
        DisplayKey: 'HRM_HR_Dependant_DateOfBirth',
        DataType: 'string'
    },
    {
        Name: 'NationalityName',
        DisplayKey: 'HRM_HR_Profile_NationalityName',
        DataType: 'string'
    },
    {
        Name: 'HouseholdInfoNationality2Name',
        DisplayKey: 'HRM_Hre_HouseholdInfo_Nationality2ID',
        DataType: 'string'
    },
    {
        Name: 'EthnicGroupName',
        DisplayKey: 'HRM_Insurance_ChangeInsInfoRegister_People',
        DataType: 'string'
    },
    {
        Name: 'SocialInsNo',
        DisplayKey: 'HRM_Hre_HouseholdInfo_SocialInsNo',
        DataType: 'string'
    },
    {
        Name: 'IsInsuranceStatus',
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
        DisplayKey: 'HRM_Hre_HouseholdInfo_AttachImage',
        DataType: 'FileAttach'
    },
    {
        Name: 'Notes',
        DisplayKey: 'Notes',
        DataType: 'string',
        IsHideBorder: true
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Household_FamilyMemberBirthReg',
        DataType: 'string'
    },
    {
        Name: 'ProvinceBirthCertificateName',
        DisplayKey: 'HRM_HR_Profile_TAProvince',
        DataType: 'string'
    },
    {
        Name: 'DistrictBirthCertificateName',
        DisplayKey: 'HRM_HR_Profile_TADistrict',
        DataType: 'string'
    },
    {
        Name: 'VillageBirthCertificateName',
        DisplayKey: 'HRM_HR_Profile_Village',
        DataType: 'string'
    },
    {
        Name: 'HouseholdIssuePlace',
        DisplayKey: 'HRM_Hre_HouseholdInfo_HouseholdIssuePlace',
        DataType: 'string'
    },
    {
        Name: 'DateUpdate',
        DisplayKey: 'HRM_Category_LeaveDayType_DateUpdate',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    }
];

export default class HouseholdConfirmedViewDetail extends Component {
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

    getDataItem = (isReload = false) => {
        try {
            const _params = this.props.navigation.state.params,
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[screenName]
                    ? ConfigListDetail.value[screenName]
                    : configDefault;
            // ConfigListDetail.value[screenName] != null
            //     ? ConfigListDetail.value[screenName]
            //     : configDefault;

            dataItem.BusinessAllowAction = ['E_MODIFY'];
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
        HouseholdConfirmedBusinessFunction.setThisForBusiness(this);
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
