import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors, Size, styleSheets, styleSafeAreaView } from '../../../constants/styleConfig';
import { PermissionForAppMobile } from '../../../assets/configProject/PermissionForAppMobile';
import VnrText from '../../../components/VnrText/VnrText';
import { SafeAreaView } from 'react-navigation';
import VnrLoading from '../../../components/VnrLoading/VnrLoading';
import { EnumIcon, EnumTask } from '../../../assets/constant';
import { getDataLocal } from '../../../factories/LocalData';
import { FlatList } from 'react-native-gesture-handler';
import SettingNotificationItem from './SettingNotificationItem';
import { AlertSevice } from '../../../components/Alert/Alert';
import EmptyData from '../../../components/EmptyData/EmptyData';

export default class SettingNotification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSwichNotify: false,
            isLoading: true,
            listSetting: null,
            dataGroupSelectAll: null,
            dataSetting: null
        };
    }

    router = roouterName => {
        const { navigation } = this.props;
        navigation.navigate(roouterName);
    };

    toggleSwitchNotify = () => {
        this.setState({
            isSwichNotify: !this.state.isSwichNotify
        });
    };

    getData = () => {
        const permission = PermissionForAppMobile.value;
        getDataLocal(EnumTask.KT_Notification_Setting).then(res => {
            if (res != null) {
            } else {
                const dataSetting = {
                    attManage: [
                        {
                            type: 'E_SUBMIT_TSLREGISTER',
                            title: 'HRM_PortalApp_Submit_TSLRegister',
                            subTitle: 'HRM_PortalApp_Submit_TSLRegister_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/ds_dk_du_lieu_quet_the.png',
                            screenName: 'AttSubmitTSLRegister',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Att_TamScanLogRegister_Approve_New_Index_Portal',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_SUBMIT_OVERTIME',
                            title: 'HRM_PortalApp_Submit_Overtime',
                            subTitle: 'HRM_PortalApp_Submit_Overtime_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/ds_dk_tang_ca.png',
                            screenName: 'AttSubmitOvertime',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Att_Overtime_Approve_New_Index_Portal',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_SUBMIT_ROSTER',
                            title: 'HRM_PortalApp_Submit_Roster',
                            subTitle: 'HRM_PortalApp_Submit_Roster_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/ds_dk_ca_lam_viec.png',
                            isOnOffNotification: true,
                            screenName: 'AttSubmitRoster',
                            resource: {
                                name: 'New_Att_Roster_Approve_New_Index_Portal',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_SUBMIT_LEAVEDAY',
                            title: 'HRM_PortalApp_Submit_Leaveday',
                            subTitle: 'HRM_PortalApp_Submit_Leaveday_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/ds_dk_ngay_nghi.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Att_Leaveday_Approve_New_Index_Portal',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_SUBMIT_BUSSINESSTRIP',
                            title: 'HRM_PortalApp_Submit_BussinessTrip',
                            subTitle: 'HRM_PortalApp_Submit_BussinessTrip_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/ds_dk_cong_tac.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Att_BussinessTravel_Approve_New_Index',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_SUBMIT_STOPWORkING',
                            title: 'HRM_PortalApp_Submit_StopWorking',
                            subTitle: 'HRM_PortalApp_Submit_StopWorking_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/yeu_cau_nghi_viec.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Hre_PersonalSubmitStopWorking_Approve_New_Index_Portal',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_CANCEL_TSLREGISTER',
                            title: 'HRM_PortalApp_Cancel_TSLRegister',
                            subTitle: 'HRM_PortalApp_Cancel_TSLRegister_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/huy_dk_du_lieu_quet_the.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Att_TamScanLogRegister_Approve_New_Index_Portal',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_CANCEL_OVERTIME',
                            title: 'HRM_PortalApp_Cancel_Overtime',
                            subTitle: 'HRM_PortalApp_Cancel_Overtime_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/huy_tang_ca.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Att_Overtime_Approve_New_Index_Portal',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_CANCEL_ROSTER',
                            title: 'HRM_PortalApp_Cancel_Roster',
                            subTitle: 'HRM_PortalApp_Cancel_Roster_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/huy_dk_ca_lam_viec.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Att_Roster_Approve_New_Index_Portal',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_CANCEL_LEAVEDAY',
                            title: 'HRM_PortalApp_Cancel_Leaveday',
                            subTitle: 'HRM_PortalApp_Cancel_Leaveday_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/huy_ngay_nghi.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Att_Leaveday_Approve_New_Index_Portal',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_CANCEL_BUSSINESSTRIP',
                            title: 'HRM_PortalApp_Cancel_BussinessTrip',
                            subTitle: 'HRM_PortalApp_Cancel_BussinessTrip_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/huy_duyet_cong_tac.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Att_BussinessTravel_Approve_New_Index',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_CANCEL_STOPWORkING',
                            title: 'HRM_PortalApp_Cancel_StopWorking',
                            subTitle: 'HRM_PortalApp_Cancel_StopWorking_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/huy_nghi_viec.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Hre_PersonalSubmitStopWorking_Approve_New_Index_Portal',
                                rule: 'View'
                            }
                        }
                        // {
                        //     "type": "E_FEEDBACK_TASK",
                        //     "title": "HRM_PortalApp_Feedback_Task",
                        //     "subTitle": "HRM_PortalApp_Feedback_Task_Subtitle",
                        //     "urlIcon": "[URI_POR]/Content/images/icons/menu/phan_hoi_quan_ly_cong_viec.png",
                        //     "isOnOffNotification": true,
                        //     "resource": {
                        //         "name": "Hre_Task_Managerment",
                        //         "rule": "View"
                        //     }
                        // },
                    ],
                    attPersonal: [
                        {
                            type: 'E_APPROVE_TSLREGISTER',
                            title: 'HRM_PortalApp_Approve_TSLRegister',
                            subTitle: 'HRM_PortalApp_Approve_TSLRegister_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/ds_duyet_du_lieu_quet_the.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Att_TamScanLogRegister_New_Index_Portal',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_APPROVE_OVERTIME',
                            title: 'HRM_PortalApp_Approve_Overtime',
                            subTitle: 'HRM_PortalApp_Approve_Overtime_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/ds_duyet_tang_ca.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Att_Overtime_New_Index_Portal',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_APPROVE_ROSTER',
                            title: 'HRM_PortalApp_Approve_Roster',
                            subTitle: 'HRM_PortalApp_Approve_Roster_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/ds_duyet_ca_lam_viec.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Att_Roster_New_Index_Portal',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_APPROVE_LEAVEDAY',
                            title: 'HRM_PortalApp_Approve_Leaveday',
                            subTitle: 'HRM_PortalApp_Approve_Leaveday_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/ds_duyet_ngay_nghi.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Att_Leaveday_New_Index_Portal',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_APPROVE_BUSSINESSTRIP',
                            title: 'HRM_PortalApp_Approve_BussinessTrip',
                            subTitle: 'HRM_PortalApp_Approve_BussinessTrip_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/ds_duyet_di_cong_tac.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Att_BussinessTravel_New_Index_Portal',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_APPROVE_STOPWORkING',
                            title: 'HRM_PortalApp_Approve_StopWorking',
                            subTitle: 'HRM_PortalApp_Approve_StopWorking_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/duyet_nghi_viec.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Hre_PersonalSubmitStopWorking_New_Index_Portal',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_REJECT_TSLREGISTER',
                            title: 'HRM_PortalApp_Reject_TSLRegister',
                            subTitle: 'HRM_PortalApp_Reject_TSLRegister_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/tu_choi_dk_du_lieu_quet_the.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Att_TamScanLogRegister_New_Index_Portal',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_REJECT_OVERTIME',
                            title: 'HRM_PortalApp_Reject_Overtime',
                            subTitle: 'HRM_PortalApp_Reject_Overtime_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/tu_choi_tang_ca.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Att_Overtime_New_Index_Portal',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_REJECT_ROSTER',
                            title: 'HRM_PortalApp_Reject_Roster',
                            subTitle: 'HRM_PortalApp_Reject_Roster_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/tu_choi_dk_ca_lam_viec.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Att_Roster_New_Index_Portal',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_REJECT_LEAVEDAY',
                            title: 'HRM_PortalApp_Reject_Leaveday',
                            subTitle: 'HRM_PortalApp_Reject_Leaveday_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/tu_choi_ngay_nghi.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Att_Leaveday_New_Index_Portal',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_REJECT_BUSSINESSTRIP',
                            title: 'HRM_PortalApp_Reject_BussinessTrip',
                            subTitle: 'HRM_PortalApp_Reject_BussinessTrip_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/tu_choi_duyet_cong_tac.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Att_BussinessTravel_New_Index_Portal',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_REJECT_STOPWORkING',
                            title: 'HRM_PortalApp_Reject_StopWorking',
                            subTitle: 'HRM_PortalApp_Reject_StopWorking_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/tu_choi_nghi_viec.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Hre_PersonalSubmitStopWorking_New_Index_Portal',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_ASSIGN_TASK',
                            title: 'HRM_PortalApp_Assign_Task',
                            subTitle: 'HRM_PortalApp_Assign_Task_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/yeu_cau_quan_ly_cong_viec.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'Hre_Task_Managerment',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_EVALUATION_TASK',
                            title: 'HRM_PortalApp_Evaluation_Task',
                            subTitle: 'HRM_PortalApp_Evaluation_Task_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/danh_gia_cong_viec.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'Hre_Task_Managerment',
                                rule: 'View'
                            }
                        }
                    ],
                    hrPersonal: [
                        {
                            type: 'E_NEWS',
                            title: 'HRM_Common_News',
                            subTitle: 'HRM_PortalApp_News_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/tin_tuc.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'Other_News',
                                rule: 'View'
                            }
                        },
                        {
                            type: 'E_SLIDER_NEWS',
                            title: 'HRM_Common_News',
                            subTitle: 'HRM_PortalApp_News_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/tin_tuc.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_SysNewsSlider_New_Index_Portal',
                                rule: 'View'
                            }
                        },

                        {
                            type: 'E_REMIND_TSLREGISTER',
                            title: 'HRM_PortalApp_Remind_TSLRegister',
                            subTitle: 'HRM_PortalApp_Remind_TSLRegister_Subtitle',
                            urlIcon: '[URI_POR]/Content/images/icons/menu/cham_cong_gps.png',
                            isOnOffNotification: true,
                            resource: {
                                name: 'New_Att_CheckInGPS_New_Index',
                                rule: 'View'
                            }
                        }
                    ]
                };

                // Object.keys(dataSetting).forEach(key => {
                //     dataSetting[key] = dataSetting[key].filter(e => {
                //         const { resource, rule } = e;
                //         return permission[resource.name] ? permission[resource.name][rule] : false
                //     });
                // });

                this.setState({
                    isLoading: false,
                    dataSetting: dataSetting,
                    dataGroupSelectAll: {
                        attManage: true,
                        attPersonal: true,
                        hrPersonal: true
                    }
                });
            }
        });
    };

    componentDidMount() {
        this.getData();
    }

    toggleSwitchItem = (keyGroup, indexItem) => {
        const { dataSetting } = this.state,
            groupSelect = dataSetting[keyGroup],
            itemSelect = groupSelect[indexItem];

        itemSelect.isOnOffNotification = !itemSelect.isOnOffNotification;

        this.setState({ dataSetting });
    };

    saveConfig = () => {
        const { dataGroupSelectAll, dataSetting } = this.state;
        const listDataConfig = {};
        Object.keys(dataSetting).forEach(key => {
            dataSetting[key].forEach(e => {
                const { type, isOnOffNotification } = e;
                listDataConfig[type] = isOnOffNotification;
            });
        });
    };

    toggleSelectAll = keyGroup => {
        const { dataGroupSelectAll } = this.state;
        AlertSevice.alert({
            title: 'HRM_Common_Confirm',
            iconType: EnumIcon.E_WARNING,
            message: 'HRM_Notification_OnOff_Alert_Setting',
            textRightButton: dataGroupSelectAll[keyGroup] ? 'UNSELECT_ALL' : 'SELECT_ALL',
            onCancel: () => {},
            onConfirm: () => {
                const { dataGroupSelectAll, dataSetting } = this.state,
                    groupSelect = dataSetting[keyGroup];
                let newStateGroup = !dataGroupSelectAll[keyGroup];
                dataGroupSelectAll[keyGroup] = newStateGroup;

                if (groupSelect != undefined) {
                    groupSelect.map(item => {
                        item.isOnOffNotification = newStateGroup;
                    });
                }

                this.setState(
                    {
                        dataSetting: dataSetting,
                        dataGroupSelectAll
                    },
                    () => {
                        this.saveConfig();
                    }
                );
            }
        });
    };

    renderTiteGroup = keyGroup => {
        const listKeyTrans = {
            attManage: 'HRM_PortalApp_AttManage_Group',
            attPersonal: 'HRM_PortalApp_AttPersonal_Group',
            hrPersonal: 'HRM_HR_Profile_Personal'
        };
        return <VnrText style={[styleSheets.lable, styles.styTitle]} i18nKey={listKeyTrans[keyGroup]} />;
    };

    render() {
        const { isLoading, dataSetting, dataGroupSelectAll } = this.state;

        if (isLoading) return <VnrLoading size="large" isVisible={isLoading} />;

        let contentView = <View />;
        if (isLoading) {
            contentView = <VnrLoading size={'large'} />;
        } else if (dataSetting != null) {
            contentView = (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    ref={ref => (this.refScroll = ref)}
                    contentContainerStyle={{
                        flexGrow: 1
                    }}
                >
                    <VnrText
                        style={[styleSheets.lable, styles.styTitleWarning]}
                        i18nKey={'HRM_PortalApp_Message_Setting_OnOff_Notification'}
                    />

                    {Object.keys(dataSetting).map(key => {
                        if (dataSetting[key].length > 0) {
                            return (
                                <View style={styles.styContentGroup}>
                                    <View style={styles.styViewTitle}>
                                        <View style={styles.styLeftTitle}>{this.renderTiteGroup(key)}</View>
                                        <TouchableOpacity onPress={() => this.toggleSelectAll(key)}>
                                            {dataGroupSelectAll[key] ? (
                                                <VnrText
                                                    style={[styleSheets.lable, styles.styBntUnSelect]}
                                                    i18nKey={'UNSELECT_ALL'}
                                                />
                                            ) : (
                                                <VnrText
                                                    style={[styleSheets.lable, styles.styBntUnSelect]}
                                                    i18nKey={'SELECT_ALL'}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    </View>

                                    <FlatList
                                        key={key}
                                        scrollEnabled={false}
                                        data={dataSetting[key]}
                                        renderItem={({ item, index }) => (
                                            <SettingNotificationItem
                                                keyGroup={key}
                                                index={index}
                                                dataItem={item}
                                                isOnOffNotification={item.isOnOffNotification}
                                                toggleSwitchItem={this.toggleSwitchItem}
                                            />
                                        )}
                                        keyExtractor={item => item.type}
                                        // keyExtractor={(item, index) => {
                                        //     return (item.resource && item.resource.name) ? item.resource.name : index
                                        // }}
                                    />
                                </View>
                            );
                        }
                    })}
                </ScrollView>
            );
        } else {
            contentView = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return (
            <SafeAreaView {...styleSafeAreaView} style={styles.container}>
                {/* {

                } */}
                {contentView}
            </SafeAreaView>
        );
    }
}

const HEIGHT_LINE_ACTION = Size.deviceWidth * 0.13,
    HEIGHT_ACTION = Math.floor(
        HEIGHT_LINE_ACTION < 70 && HEIGHT_LINE_ACTION > 40 ? HEIGHT_LINE_ACTION : HEIGHT_LINE_ACTION > 70 ? 70 : 40
    ),
    HEIGHT_INIT_ITEM = Size.deviceWidth * 0.14,
    HEIGHT_ITEM = Math.floor(
        HEIGHT_INIT_ITEM < 70 && HEIGHT_INIT_ITEM > 40 ? HEIGHT_INIT_ITEM : HEIGHT_INIT_ITEM > 70 ? 70 : 40
    );
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingBottom: Size.deviceheight * 0.075,
        paddingHorizontal: Size.defineSpace,
        backgroundColor: Colors.white
    },
    styViewTitle: {
        flexDirection: 'row',
        marginTop: Size.defineSpace,
        height: HEIGHT_ACTION,
        justifyContent: 'center',
        alignItems: 'center'
        // backgroundColor: 'red'
    },
    styLeftTitle: {
        flex: 1
    },
    styTitle: {
        // fontSize: Size.textSmall,
        fontWeight: '500'
    },
    stySubTitle: {
        fontSize: Size.textSmall - 1,
        color: Colors.gray_7
    },
    styBntUnSelect: {
        color: Colors.primary,
        fontWeight: '500',
        marginRight: 5
    },
    styContentGroup: {},
    styTitleWarning: {
        color: Colors.primary,
        marginTop: Size.defineSpace
    }
});
