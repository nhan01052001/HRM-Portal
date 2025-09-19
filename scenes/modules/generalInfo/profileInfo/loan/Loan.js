import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import LoanList from './LoanList';
import { styleSheets, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { EnumName } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';

export default class Loan extends Component {

    constructor(porps) {
        super(porps);
        this.state = {
            rowActions: []
        };
    }

    componentDidMount() {
        if (!ConfigList.value['Loan'])
            ConfigList.value = {
                ...ConfigList.value,
                'Loan': {
                    Api: {
                        urlApi: '[URI_CENTER]/api/Hre_Personal/GetCreditByUserlogin?profileID=',
                        type: 'GET',
                        pageSize: 20
                    },
                    Row: [
                        {
                            TypeView: 'E_COMMON',
                            Name: 'DateOfSign',
                            DisplayKey: 'HRM_PortalApp_DateOfSigning',
                            DataType: 'DateTime',
                            DataFormat: 'DD/MM/YYYY'
                        },
                        {
                            TypeView: 'E_COMMON',
                            Name: 'LoanTerm',
                            DisplayKey: 'HRM_PortalApp_LoanTerm',
                            DataType: 'string'
                        },
                        {
                            TypeView: 'E_COMMON',
                            Name: 'EstimatedEndDate',
                            DisplayKey: 'HRM_PortalApp_EstimatedEndDate',
                            DataType: 'DateTime',
                            DataFormat: 'DD/MM/YYYY'
                        },
                        {
                            TypeView: 'E_COMMON',
                            Name: 'LoanAmount',
                            DisplayKey: 'HRM_PortalApp_LoanAmount',
                            DataType: 'string'
                        },
                        {
                            TypeView: 'E_COMMON',
                            Name: 'AnnualLimit',
                            DisplayKey: 'HRM_PortalApp_AnnualLimit',
                            DataType: 'string'
                        },
                        {
                            TypeView: 'E_COMMON',
                            Name: 'UsedLimit',
                            DisplayKey: 'HRM_PortalApp_UsedLimit',
                            DataType: 'string'
                        },
                        {
                            TypeView: 'E_COMMON',
                            Name: 'RemainingLimit',
                            DisplayKey: 'HRM_PortalApp_RemainingLimit',
                            DataType: 'string'
                        },
                        {
                            TypeView: 'E_COMMON',
                            Name: 'Lender',
                            DisplayKey: 'HRM_PortalApp_Lender',
                            DataType: 'string'
                        },
                        {
                            TypeView: 'E_COMMON',
                            Name: 'LoanLimitNote',
                            DisplayKey: 'Note',
                            DataType: 'string'
                        },
                        {
                            TypeView: 'E_FILEATTACH',
                            Name: 'LoanLimitFileAttach',
                            DisplayKey: 'HRM_Tas_Task_FileAttach',
                            DataType: 'FileAttach'
                        }
                    ],
                    Order: [
                        {
                            field: 'DateUpdate',
                            dir: 'desc'
                        }
                    ],
                    BusinessAction: []
                }
            }

        const configList = ConfigList.value['Loan'],
            renderRow = configList[EnumName.E_Row];

        this.setState({
            rowActions: renderRow ? renderRow : []
        });
    }

    render() {
        const { rowActions } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>
                    <LoanList
                        api={{
                            urlApi: `[URI_CENTER]/api/Hre_Personal/GetCreditByUserlogin?profileID=${dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null}`,
                            type: 'E_GET'
                        }}
                        rowActions={rowActions}
                        valueField="ID"
                    />
                </View>
            </SafeAreaView>
        );
    }
}