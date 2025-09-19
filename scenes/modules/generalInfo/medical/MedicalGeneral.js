import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import { PermissionForAppMobile } from '../../../../assets/configProject/PermissionForAppMobile';
import ItemFilterMain from '../../../../components/Main/ItemFilterMain';
import { Size, styleSafeAreaView } from '../../../../constants/styleConfig';

export default class MedicalGeneral extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const listIcon = [
            {
                id: 'EA5E3510-5416-463C-9899-00F10A6CEDAQ',
                type: 'E_SCREEN',
                title: 'HR_ImmunizationRecord_Portal',
                urlIcon: '[URI_POR]/Content/images/icons/menu/medImmunization.png',
                screenName: 'MedImmunization',
                resource: {
                    name: 'ImmunizationRecord_Index_ImmunizationRecord_Gird',
                    rule: 'View'
                }
            },
            {
                id: 'EA5E3510-5416-463C-9899-00F10A6CEDKK',
                type: 'E_SCREEN',
                title: 'HRM_Medical_AnnualHealth_List_Title',
                urlIcon: '[URI_POR]/Content/images/icons/menu/healthcare.png',
                screenName: 'MedAnnualHealth',
                resource: {
                    name: 'HealthCheckupResults_Index_HealthCheckupResults_Gird',
                    rule: 'View'
                }
            },
            {
                id: 'EA5E3510-5416-463C-9899-00F10A6CEDDF',
                type: 'E_SCREEN',
                title: 'HR_HistoryMedical_Portal',
                urlIcon: '[URI_POR]/Content/images/icons/menu/medHistoryMedical.png',
                screenName: 'MedHistoryMedical',
                resource: {
                    name: 'HistoryMedical_Index_HistoryMedical_Gird',
                    rule: 'View'
                }
            }
        ];
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styles.container]}>
                    {listIcon.map(item => {
                        let key = item.resource.name;
                        item.urlIcon = item.urlIcon.replace('[URI_POR]', dataVnrStorage.apiConfig.uriPor);
                        if (PermissionForAppMobile.value[key] && PermissionForAppMobile.value[key]['View']) {
                            return (
                                <ItemFilterMain
                                    key={item.resource && item.resource.name ? item.resource.name : index}
                                    index={item.id}
                                    closeFilter={this.handleBlur}
                                    type={item.type}
                                    title={item.title}
                                    urlIcon={item.urlIcon}
                                    screenName={item.screenName}
                                    nav={item}
                                />
                            );
                        }
                    })}
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Size.defineSpace
    }
});
