// import React, { Component } from 'react';
// import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
// import VnrText from '../../../../../components/VnrText/VnrText';
// import {
//     styleSheets,
//     Colors
// } from '../../../../../constants/styleConfig';
// import { dataVnrStorage } from '../../../../../assets/auth/authentication';
// import HttpService from '../../../../../utils/HttpService';
// import DrawerServices from '../../../../../utils/DrawerServices';
// import moment from 'moment';
// export default class ContractV3Component extends Component {

//     constructor(porps) {
//         super(porps);
//         this.state = {
//             isLoading: true,
//             dataSource: null
//         }
//     }

//     getData = () => {
//         const dataBody = {
//             profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null,
//         };

//         HttpService.Post(`[URI_CENTER]/api/Hre_Contract/GetListContractPortalV3`, dataBody, null, this.getData).
//             then(res => {
//                 if (res && res.Data && Array.isArray(res.Data) && res.Data.length > 0) {

//                     // let newItem = null;
//                     // if (res.Data.length == 1) {
//                     //     newItem = res.Data[0];
//                     // }
//                     // else {
//                     //     newItem = res.Data.sort(function (a, b) {
//                     //         return moment(b.DateSigned).toDate() - moment(a.DateSigned).toDate();
//                     //     })[0];
//                     // }

//                     this.setState({
//                         dataSource: newItem,
//                         isLoading: false
//                     })
//                 }
//                 else {
//                     this.setState({
//                         isLoading: false
//                     })
//                 }
//             })
//     }

//     componentDidMount() {
//         this.getData();
//     }

//     render() {
//         const { isLoading, dataSource } = this.state,
//             { styles, initLableValue } = this.props;
//         return (
//             <View style={styles.styBlock}>
//                 <View style={styles.styTopTitle}>
//                     <View style={styles.styWrap}>
//                         <VnrText style={[styleSheets.lable, styles.styTitle]}
//                             i18nKey={'HRM_Contract'} />
//                     </View>
//                     {
//                         isLoading ?
//                             <ActivityIndicator size={'small'} color={Colors.primary} />
//                             : (
//                                 <TouchableOpacity onPress={() => DrawerServices.navigate('Contract')}
//                                     style={styles.styWrapRight}
//                                 >
//                                     <VnrText style={[styleSheets.text, styles.styTextDetail]}
//                                         i18nKey={'HRM_Common_ViewMore'} />
//                                 </TouchableOpacity>
//                             )
//                     }

//                 </View>

//                 {
//                     dataSource !== null && (
//                         <View style={styles.styViewData}>
//                             {initLableValue(
//                                 dataSource, {
//                                 Name: "ContractTypeName",
//                                 DisplayKey: "HRM_HR_Contract_ContractTypeID",
//                                 DataType: "string",
//                             })}

//                             {initLableValue(
//                                 dataSource, {
//                                 Name: "DateSigned",
//                                 DisplayKey: "HRM_HR_Contract_DateSigned",
//                                 DataType: "DateTime",
//                                 DataFormat: "DD/MM/YYYY"
//                             })}

//                             {initLableValue(
//                                 dataSource, {
//                                 Name: "DateStart",
//                                 DisplayKey: "HRM_HR_Profile_StartDate",
//                                 DataType: "DateTime",
//                                 DataFormat: "DD/MM/YYYY"
//                             })}

//                             {initLableValue(
//                                 dataSource, {
//                                 Name: "DateEnd",
//                                 DisplayKey: "HRM_HR_Profile_EndDate",
//                                 DataType: "DateTime",
//                                 DataFormat: "DD/MM/YYYY"
//                             })}
//                         </View>
//                     )
//                 }
//             </View>

//         );
//     }
// }

import React, { Component } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import VnrText from '../../../../../components/VnrText/VnrText';
import { styleSheets, Colors } from '../../../../../constants/styleConfig';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName } from '../../../../../assets/constant';
export default class ContractComponent extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            isLoading: true,
            dataSource: null
        };
    }

    getData = () => {
        this.setState({
            dataSource: null,
            isLoading: false
        });

        HttpService.Get('[URI_CENTER]/api/Hre_Contract/GetListContractPortalV3', null, this.getData).then(res => {
            if (res && res.Status == EnumName.E_SUCCESS && res.Data && Array.isArray(res.Data) && res.Data.length > 0) {
                let newItem = res.Data[0],
                    { items } = newItem,
                    data = {};

                if (items && Array.isArray(items) && items.length > 0) {
                    items.forEach(item => {
                        data[item.fieldName] = item.value;
                    });
                }

                this.setState({
                    dataSource: data,
                    isLoading: false
                });
            } else {
                this.setState({
                    isLoading: false
                });
            }
        });
    };

    componentDidMount() {
        this.getData();
    }

    render() {
        const { isLoading, dataSource } = this.state,
            { styles, initLableValue } = this.props;
        return (
            <View style={styles.styBlock}>
                <View style={styles.styTopTitle}>
                    <View style={styles.styWrap}>
                        <VnrText style={[styleSheets.lable, styles.styTitle]} i18nKey={'HRM_Contract'} />
                    </View>
                    {isLoading ? (
                        <ActivityIndicator size={'small'} color={Colors.primary} />
                    ) : (
                        <TouchableOpacity
                            onPress={() =>
                                DrawerServices.navigate('ContractV3ViewDetail', {
                                    screenName: 'ContractV3ViewDetail',
                                    dataItem: dataSource
                                })
                            }
                            style={styles.styWrapRight}
                        >
                            <VnrText style={[styleSheets.text, styles.styTextDetail]} i18nKey={'HRM_Common_ViewMore'} />
                        </TouchableOpacity>
                    )}
                </View>

                {dataSource !== null && (
                    <View style={styles.styViewData}>
                        {initLableValue(dataSource, {
                            Name: 'ContractTypeName',
                            DisplayKey: 'HRM_HR_Contract_ContractTypeID',
                            DataType: 'string'
                        })}

                        {initLableValue(dataSource, {
                            Name: 'ContractNo',
                            DisplayKey: 'HRM_HR_Contract_ContractNo',
                            DataType: 'string'
                        })}

                        {initLableValue(dataSource, {
                            Name: 'DateStart',
                            DisplayKey: 'HRM_HR_Profile_StartDate',
                            DataType: 'DateTime',
                            DataFormat: 'DD/MM/YYYY'
                        })}

                        {initLableValue(dataSource, {
                            Name: 'DateEnd',
                            DisplayKey: 'HRM_HR_Profile_EndDate',
                            DataType: 'DateTime',
                            DataFormat: 'DD/MM/YYYY'
                        })}
                    </View>
                )}
            </View>
        );
    }
}
