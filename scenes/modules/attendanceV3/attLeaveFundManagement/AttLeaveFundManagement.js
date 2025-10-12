import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import moment from 'moment';

import SafeAreaViewDetail from '../../../../components/safeAreaView/SafeAreaViewDetail';
import { styleSheets, Size, Colors, CustomStyleSheet } from '../../../../constants/styleConfig';
import { translate } from '../../../../i18n/translate';
import HttpService from '../../../../utils/HttpService';
import DrawerServices from '../../../../utils/DrawerServices';
import { EnumName } from '../../../../assets/constant';
import { PermissionForAppMobile } from '../../../../assets/configProject/PermissionForAppMobile';
import AttLeaveFundManagementItem from './attLeaveFundManagementList/AttLeaveFundManagementItem';
import { VnrLoadingSevices } from '../../../../components/VnrLoading/VnrLoadingPages';
import VnrYearPicker from '../../../../components/VnrYearPicker/VnrYearPicker';

const dataDefault = [
    { Type: 'E_ANNUAL_LEAVE', TypeName: 'E_ANNUAL_LEAVE' },
    { Type: 'E_COMPENSATORY_LEAVE', TypeName: 'E_COMPENSATORY_LEAVE' },
    { Type: 'E_SICK_LEAVE', TypeName: 'E_SICK_LEAVE' },
    { Type: 'E_PREGNANT_LEAVE', TypeName: 'E_PREGNANT_LEAVE' },
    { Type: 'E_ADDITIONAL_LEAVE', TypeName: 'E_ADDITIONAL_LEAVE' }
];

const initSateDefault = {
    year: moment(new Date()).format('YYYY'),
    dataLeaveFundManagement: [],
    fullData: []
};

class AttLeaveFundManagement extends Component {
    constructor(props) {
        super(props);
        this.state = { ...initSateDefault };
    }

    getDataManageLeave = () => {
        try {
            VnrLoadingSevices.show();
            const { year } = this.state;
            HttpService.Post(
                `[URI_CENTER]api/Att_GetData/GetManageLeave?year=${
                    year ? year.toString() : moment(new Date()).format('YYYY')
                }`
            )
                .then(res => {
                    VnrLoadingSevices.hide();
                    if (
                        res &&
                        res?.Status === EnumName.E_SUCCESS &&
                        Array.isArray(res?.Data?.SumaryModel) &&
                        Array.isArray(res?.Data?.GeneralModel)
                    ) {
                        let data = [],
                            dataSumaryModel = res?.Data?.SumaryModel.length > 0 ? res?.Data?.SumaryModel : dataDefault,
                            rsFindRemaining = res?.Data?.GeneralModel.find(item => item?.Field === 'Remain');
                        dataSumaryModel.map(item => {
                            // phép năm
                            if (
                                item?.Type === EnumName.E_ANNUAL_LEAVE &&
                                (PermissionForAppMobile &&
                                    PermissionForAppMobile.value[
                                        'ProfileQualification_Index_ProfileQualificationGird'
                                    ] &&
                                    PermissionForAppMobile.value['ProfileQualification_Index_ProfileQualificationGird'][
                                        'View'
                                    ])
                            ) {
                                data.push({
                                    ...item,
                                    color: '#A155B9',
                                    Remain:
                                        rsFindRemaining && rsFindRemaining[(item?.Type)]
                                            ? rsFindRemaining[(item?.Type)]
                                            : 0
                                });
                            }

                            // Phép bù
                            if (
                                item?.Type === EnumName.E_COMPENSATORY_LEAVE &&
                                (PermissionForAppMobile &&
                                    PermissionForAppMobile.value[
                                        'ProfileQualification_Index_ProfileQualificationGird'
                                    ] &&
                                    PermissionForAppMobile.value['ProfileQualification_Index_ProfileQualificationGird'][
                                        'View'
                                    ])
                            ) {
                                data.push({
                                    ...item,
                                    color: '#165BAA',
                                    Remain:
                                        rsFindRemaining && rsFindRemaining[`${item?.Type}`]
                                            ? rsFindRemaining[`${item?.Type}`]
                                            : 0
                                });
                            }

                            // Phép ốm
                            if (
                                item?.Type === EnumName.E_SICK_LEAVE &&
                                (PermissionForAppMobile &&
                                    PermissionForAppMobile.value[
                                        'ProfileQualification_Index_ProfileQualificationGird'
                                    ] &&
                                    PermissionForAppMobile.value['ProfileQualification_Index_ProfileQualificationGird'][
                                        'View'
                                    ])
                            ) {
                                data.push({
                                    ...item,
                                    color: '#E31B54',
                                    Remain:
                                        rsFindRemaining && rsFindRemaining[(item?.Type)]
                                            ? rsFindRemaining[(item?.Type)]
                                            : 0
                                });
                            }

                            // Nghỉ thai sản
                            if (
                                item?.Type === 'E_PREGNANT_LEAVE' &&
                                (PermissionForAppMobile &&
                                    PermissionForAppMobile.value[
                                        'ProfileQualification_Index_ProfileQualificationGird'
                                    ] &&
                                    PermissionForAppMobile.value['ProfileQualification_Index_ProfileQualificationGird'][
                                        'View'
                                    ])
                            ) {
                                data.push({
                                    ...item,
                                    color: '#F765A3',
                                    Remain:
                                        rsFindRemaining && rsFindRemaining[(item?.Type)]
                                            ? rsFindRemaining[(item?.Type)]
                                            : 0
                                });
                            }

                            // Phép thêm tồn đầu kỳ
                            if (
                                item?.Type === EnumName.E_ADDITIONAL_LEAVE &&
                                (PermissionForAppMobile &&
                                    PermissionForAppMobile.value[
                                        'ProfileQualification_Index_ProfileQualificationGird'
                                    ] &&
                                    PermissionForAppMobile.value['ProfileQualification_Index_ProfileQualificationGird'][
                                        'View'
                                    ])
                            ) {
                                data.push({
                                    ...item,
                                    color: '#475467',
                                    Remain:
                                        rsFindRemaining && rsFindRemaining[(item?.Type)]
                                            ? rsFindRemaining[(item?.Type)]
                                            : 0
                                });
                            }
                        });

                        this.setState({
                            dataLeaveFundManagement: data,
                            fullData: res?.Data
                        });
                    } else {
                        // data default
                        this.setState({
                            dataLeaveFundManagement: dataDefault
                        });
                    }
                })
                .catch(error => {
                    VnrLoadingSevices.hide();
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                });
        } catch (error) {
            VnrLoadingSevices.hide();
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    componentDidMount() {
        this.getDataManageLeave();
    }

    render() {
        const { year, dataLeaveFundManagement, fullData } = this.state;
        return (
            <SafeAreaViewDetail style={styles.container}>
                <Text style={[styleSheets.lable, { fontSize: Size.text + 3 }]}>
                    {translate('HRM_PortalApp_Only_Year') + ' ' + year}
                </Text>

                <View style={CustomStyleSheet.flex(1)}>
                    <FlatList
                        data={dataLeaveFundManagement}
                        renderItem={({ item, index }) => (
                            <AttLeaveFundManagementItem key={index} dataItem={item} fullData={fullData} />
                        )}
                        keyExtractor={item => item?.Type}
                    />
                </View>

                <View
                    style={styles.wrapComponentVnrYearPicker}
                >
                    <VnrYearPicker
                        isOnlyDisplayYear={true}
                        colorItems={Colors.white}
                        stylePicker={styles.componentVnrYearPicker}
                        onFinish={item => {
                            if (item?.year) {
                                this.setState(
                                    {
                                        year: item?.year
                                    },
                                    () => {
                                        this.getDataManageLeave();
                                    }
                                );
                            }
                        }}
                        value={Number(year)}
                    />
                </View>
            </SafeAreaViewDetail>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 16
    },
    componentVnrYearPicker: {
        flex: 1,
        backgroundColor: Colors.black,
        borderRadius: 30,
        marginHorizontal: 0,
        justifyContent: 'center'
    },
    wrapComponentVnrYearPicker: {
        position: 'absolute',
        bottom: Size.defineSpace * 3,
        right: Size.defineSpace,
        alignItems: 'flex-end'
    }
});

export default AttLeaveFundManagement;
