import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import AttSubmitWorkingOvertime from './attSubmitWorkingOvertime/AttSubmitWorkingOvertime';
import AttSaveTempSubmitWorkingOvertime from './attSubmitWorkingOvertime/attSaveTempSubmitWorkingOvertime/AttSaveTempSubmitWorkingOvertime';
import AttApproveSubmitWorkingOvertime from './attSubmitWorkingOvertime/attApproveSubmitWorkingOvertime/AttApproveSubmitWorkingOvertime';
import AttApprovedSubmitWorkingOvertime from './attSubmitWorkingOvertime/attApprovedSubmitWorkingOvertime/AttApprovedSubmitWorkingOvertime';
import AttConfirmedSubmitWorkingOvertime from './attSubmitWorkingOvertime/attConfirmedSubmitWorkingOvertime/AttConfirmedSubmitWorkingOvertime';
import AttRejectSubmitWorkingOvertime from './attSubmitWorkingOvertime/atRejectSubmitWorkingOvertime/AttRejectSubmitWorkingOvertime';
import AttCanceledSubmitWorkingOvertime from './attSubmitWorkingOvertime/attCanceledSubmitWorkingOvertime/AttCanceledSubmitWorkingOvertime';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import { PermissionForAppMobile } from '../../../../assets/configProject/PermissionForAppMobile';
import { Colors } from '../../../../constants/styleConfig';
import TopTabViewPlanAndResult from './TopTabViewPlanAndResult';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_All',
        screenName: ScreenName.AttSubmitWorkingOvertime,
        fieldCount: 'CountAll'
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_SaveTemporary',
        screenName: ScreenName.AttSaveTempSubmitWorkingOvertime,
        fieldCount: 'CountSubmitTemp'
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_WaitingApproval',
        screenName: ScreenName.AttApproveSubmitWorkingOvertime,
        fieldCount: 'CountWaitApprove'
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Approved',
        screenName: ScreenName.AttApprovedSubmitWorkingOvertime,
        fieldCount: 'CountApproved'
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Confirmed',
        screenName: ScreenName.AttConfirmedSubmitWorkingOvertime,
        fieldCount: 'CountConfirmed'
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Rejected',
        screenName: ScreenName.AttRejectSubmitWorkingOvertime,
        fieldCount: 'CountRejected'
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Canceled',
        screenName: ScreenName.AttCanceledSubmitWorkingOvertime,
        fieldCount: 'CountCancelled'
    }
];

const TopTabAttSubmitWorkingOvertime = createMaterialTopTabNavigator(
    {
        AttSubmitWorkingOvertime: {
            screen: AttSubmitWorkingOvertime,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_All')
        },
        AttSaveTempSubmitWorkingOvertime: {
            screen: AttSaveTempSubmitWorkingOvertime,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_SaveTemporary')
        },
        AttApproveSubmitWorkingOvertime: {
            screen: AttApproveSubmitWorkingOvertime,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_WaitingApproval')
        },
        AttApprovedSubmitWorkingOvertime: {
            screen: AttApprovedSubmitWorkingOvertime,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Approved')
        },
        AttConfirmedSubmitWorkingOvertime: {
            screen: AttConfirmedSubmitWorkingOvertime,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Confirmed')
        },
        AttRejectSubmitWorkingOvertime: {
            screen: AttRejectSubmitWorkingOvertime,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Rejected')
        },
        AttCanceledSubmitWorkingOvertime: {
            screen: AttCanceledSubmitWorkingOvertime,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Canceled')
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: (navigationAll) => {
            let perTabApprove = true,
                perTabWaitApproved = true,
                perTabReject = true;

            let perTabConfirmed = false,
                perTabSaveTemp = false;

            if (
                PermissionForAppMobile &&
                PermissionForAppMobile.value['New_Att_OvertimePlan_New_Index_V2_TabConfirm'] &&
                PermissionForAppMobile.value['New_Att_OvertimePlan_New_Index_V2_TabConfirm']['View']
            ) {
                perTabConfirmed = true;
            }

            if (
                PermissionForAppMobile &&
                PermissionForAppMobile.value['HRM_PortalV3_Att_OvertimePlan_BtnSaveTemp'] &&
                PermissionForAppMobile.value['HRM_PortalV3_Att_OvertimePlan_BtnSaveTemp']['View']
            ) {
                perTabSaveTemp = true;
            }

            let filteredData = data;

            if (!perTabConfirmed) {
                filteredData = filteredData.filter(
                    (item) => item.title !== 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Confirmed'
                );
            }

            if (perTabSaveTemp) {
                filteredData = filteredData.filter(
                    (item) => item.title !== 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_SaveTemporary'
                );
            }

            if ((perTabApprove || perTabWaitApproved || perTabReject) && Array.isArray(data) && data.length > 0) {
                return (
                    <View style={styles.container}>
                        <TopTabViewPlanAndResult />
                        <RenderTopTab isShowCountData={true} data={filteredData} navigationAll={navigationAll} />
                    </View>
                );
            } else {
                return <View />;
            }
        }
    }
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        maxHeight: 90,
        backgroundColor: Colors.white
    }
});

export default TopTabAttSubmitWorkingOvertime;
