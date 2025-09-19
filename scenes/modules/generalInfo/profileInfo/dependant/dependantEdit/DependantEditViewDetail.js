import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../../assets/configProject/ConfigListDetail';
import VnrText from '../../../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../../../assets/auth/authentication';
import { DependantBusinessFunction, generateRowActionAndSelected } from '../DependantBusinessFunction';
import DrawerServices from '../../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { ScreenName } from '../../../../../../assets/constant';

const configDefault = [
    {
        Name: 'CodeEmp',
        DisplayKey: 'HRM_HR_Profile_CodeEmp',
        DataType: 'string'
    },
    {
        Name: 'ProfileName',
        DisplayKey: 'HRM_Tra_Trainee_ProfileID',
        DataType: 'string'
    },
    {
        Name: 'DependantName',
        DisplayKey: 'HRM_HR_Dependant_DependantName',
        DataType: 'string'
    },
    {
        Name: 'DateOfBirth',
        DisplayKey: 'HRM_HR_Dependant_DateOfBirth',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'IDNo',
        DisplayKey: 'HRM_HR_Dependant_IDNo',
        DataType: 'string'
    },
    {
        Name: 'PassportNo',
        DisplayKey: 'HRM_HR_Profile_PassportNo',
        DataType: 'string'
    },
    {
        Name: 'CodeTax',
        DisplayKey: 'HRM_HR_Dependant_CodeTax',
        DataType: 'string'
    },
    {
        Name: 'NationalityName',
        DisplayKey: 'HRM_HR_Dependant_NationlatyID',
        DataType: 'string'
    },
    {
        Name: 'GenderView',
        DisplayKey: 'HRM_HR_Dependant_Gender',
        DataType: 'string'
    },
    {
        Name: 'RelativeTypeName',
        DisplayKey: 'HRM_HR_Dependant_RelationID',
        DataType: 'string'
    }
];

export default class DependantEditViewDetail extends Component {
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
        console.log(_params.listActions, '_params.listActions');
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
                _configListDetail =
                    ConfigListDetail.value[screenName] != null ? ConfigListDetail.value[screenName] : configDefault;

            dataItem.BusinessAllowAction = ['E_DELETE', 'E_MODIFY'];
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
            console.log(error);
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
        DependantBusinessFunction.setThisForBusiness(this);
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, listActions } = this.state,
            { itemContent, containerItemDetail, textLableInfo, bottomActions } = styleScreenDetail;
        console.log(listActions, 'listActions');
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
