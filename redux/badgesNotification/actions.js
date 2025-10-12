import { dataVnrStorage } from '../../assets/auth/authentication';
import { PermissionForAppMobile } from '../../assets/configProject/PermissionForAppMobile';
import HttpService from '../../utils/HttpService';
import NotificationsService from '../../utils/NotificationsService';
import Vnr_Function from '../../utils/Vnr_Function';

export const actions = {
    SET_NUMBER_BADGES_MESSAGING: 'SET_NUMBER_BADGES_MESSAGING',
    SET_NUMBER_BADGES_NOTIFY: 'SET_NUMBER_BADGES_NOTIFY',
    SET_NUMBER_BADGES_COUNT_APPROVE: 'SET_NUMBER_BADGES_COUNT_APPROVE',
    CLEAN_ALL_NUMBER_BADGES: 'CLEAN_ALL_NUMBER_BADGES',
    setNumberBadgesMessaging: (number) => {
        return {
            type: actions.SET_NUMBER_BADGES_MESSAGING,
            number: number
        };
    },
    setNumberBadgesNotify: (number) => {
        return {
            type: actions.SET_NUMBER_BADGES_NOTIFY,
            number: number
        };
    },
    setNumberBadgesCountApprove: (data) => {
        return {
            type: actions.SET_NUMBER_BADGES_COUNT_APPROVE,
            data: data
        };
    },
    clearStateAllBadges: () => {
        return {
            type: actions.CLEAN_ALL_NUMBER_BADGES
        };
    },
    fetchCountNumberApproveInfo: () => {
        return (dispatch) => {
            // build 19 và từ 42 trở đi thì có
            if (dataVnrStorage.currentUser != null && dataVnrStorage.currentUser.headers != null) {
                let strBusiness = [];

                // check quyền để đếm dữ liệu chờ xử lý ở dashboard
                if (PermissionForAppMobile) {
                    if (
                        (PermissionForAppMobile.value['New_Att_Leaveday_Approve_New_Index_Portal'] &&
                            PermissionForAppMobile.value['New_Att_Leaveday_Approve_New_Index_Portal']['View']) ||
                        (PermissionForAppMobile.value['New_Att_LeaveDayApprove_New_Index_V2'] &&
                            PermissionForAppMobile.value['New_Att_LeaveDayApprove_New_Index_V2']['View'])
                    ) {
                        strBusiness.push('APPROVE_LD');
                    }

                    if (
                        PermissionForAppMobile.value['New_Att_Overtime_Approve_New_Index_Portal'] &&
                        PermissionForAppMobile.value['New_Att_Overtime_Approve_New_Index_Portal']['View']
                    ) {
                        strBusiness.push('APPROVE_OT');
                    }

                    if (
                        (PermissionForAppMobile.value['New_Att_PlanOvertime_Approve_New_Index'] &&
                            PermissionForAppMobile.value['New_Att_PlanOvertime_Approve_New_Index']['View']) ||
                        (PermissionForAppMobile.value['New_Att_OvertimePlanApprove_New_Index_V2'] &&
                            PermissionForAppMobile.value['New_Att_OvertimePlanApprove_New_Index_V2']['View'])
                    ) {
                        strBusiness.push('APPROVE_PLAN_OT');
                    }

                    if (
                        PermissionForAppMobile.value['New_Att_PregnancyRegister_Approve_New_Index'] &&
                        PermissionForAppMobile.value['New_Att_PregnancyRegister_Approve_New_Index']['View']
                    ) {
                        strBusiness.push('TOTAL_PREGNANCYREGISTER_APPROVE');
                    }

                    if (
                        (PermissionForAppMobile.value['New_Att_BussinessTravel_Approve_New_Index'] &&
                            PermissionForAppMobile.value['New_Att_BussinessTravel_Approve_New_Index']['View']) ||
                        (PermissionForAppMobile.value['New_Att_BussinessTravelApprove_New_Index_V2'] &&
                            PermissionForAppMobile.value['New_Att_BussinessTravelApprove_New_Index_V2']['View'])
                    ) {
                        strBusiness.push('TOTAL_BUSINESSTRAVEL_APPROVE');
                    }

                    if (
                        PermissionForAppMobile.value['New_Att_BusinessTravelTransfer_Approve_New_Index'] &&
                        PermissionForAppMobile.value['New_Att_BusinessTravelTransfer_Approve_New_Index']['View']
                    ) {
                        strBusiness.push('TOTAL_BUSINESSTRAVELTRANSFER_APPROVE');
                    }

                    if (
                        PermissionForAppMobile.value['New_Att_RequestCancelationBusinessTravel_Approve_New_Index'] &&
                        PermissionForAppMobile.value['New_Att_RequestCancelationBusinessTravel_Approve_New_Index'][
                            'View'
                        ]
                    ) {
                        strBusiness.push('TOTAL_REQUESTCANCELATION_BUSINESSTRAVEL_APPROVE');
                    }

                    if (
                        PermissionForAppMobile.value['New_Att_RequestCancelationOvertimePlan_Approve_New_Index'] &&
                        PermissionForAppMobile.value['New_Att_RequestCancelationOvertimePlan_Approve_New_Index']['View']
                    ) {
                        strBusiness.push('TOTAL_REQUESTCANCELATION_OTPLAN_APPROVE');
                    }

                    if (
                        PermissionForAppMobile.value['New_Att_RequireCancelApprove_New_Index'] &&
                        PermissionForAppMobile.value['New_Att_RequireCancelApprove_New_Index']['View']
                    ) {
                        strBusiness.push('APPROVE_REQUIRE_CANCEL');
                    }

                    if (
                        PermissionForAppMobile.value['New_Att_ShiftSubstitution_Confirm_New_Index'] &&
                        PermissionForAppMobile.value['New_Att_ShiftSubstitution_Confirm_New_Index']['View']
                    ) {
                        strBusiness.push('TOTAL_SHIFTSUBSTITUTION_CONFIRM');
                    }

                    if (
                        PermissionForAppMobile.value['New_Att_ShiftSubstitution_Approve_New_Index'] &&
                        PermissionForAppMobile.value['New_Att_ShiftSubstitution_Approve_New_Index']['View']
                    ) {
                        strBusiness.push('TOTAL_SHIFTSUBSTITUTION_APPROVE');
                    }

                    if (
                        PermissionForAppMobile.value['New_Att_RosterGroupByEmp_Approve_New_Index'] &&
                        PermissionForAppMobile.value['New_Att_RosterGroupByEmp_Approve_New_Index']['View']
                    ) {
                        strBusiness.push('APPROVE_ROSTERGROUP_EMP');
                    }

                    if (
                        PermissionForAppMobile.value['New_Att_Roster_Approve_New_Index_Portal'] &&
                        PermissionForAppMobile.value['New_Att_Roster_Approve_New_Index_Portal']['View']
                    ) {
                        strBusiness.push('APPROVE_ROSTER');
                    }

                    if (
                        PermissionForAppMobile.value['New_Hre_EvaluationDocument_Index'] &&
                        PermissionForAppMobile.value['New_Hre_EvaluationDocument_Index']['View']
                    ) {
                        strBusiness.push('APPROVE_EVALUATEDOC');
                    }

                    if (
                        (PermissionForAppMobile.value['New_Att_TamScanLogRegister_Approve_New_Index_Portal'] &&
                            PermissionForAppMobile.value['New_Att_TamScanLogRegister_Approve_New_Index_Portal'][
                                'View'
                            ]) ||
                        (PermissionForAppMobile.value['New_Att_TamScanLogRegisterApprove_New_Index_V2'] &&
                            PermissionForAppMobile.value['New_Att_TamScanLogRegisterApprove_New_Index_V2']['View'])
                    ) {
                        strBusiness.push('APPROVE_INOUT');
                    }

                    if (
                        PermissionForAppMobile.value['New_EvaPerformanceWait_New_Index'] &&
                        PermissionForAppMobile.value['New_EvaPerformanceWait_New_Index']['View']
                    ) {
                        strBusiness.push('TOTAL_EVALUTION_WAITING');
                    }

                    if (
                        PermissionForAppMobile.value['New_Hre_Violation_Approve_New_Index'] &&
                        PermissionForAppMobile.value['New_Hre_Violation_Approve_New_Index']['View']
                    ) {
                        strBusiness.push('APPROVE_VIOLATION');
                    }

                    if (
                        PermissionForAppMobile.value['New_List_ApprovedTravel_New_Index_Portal'] &&
                        PermissionForAppMobile.value['New_List_ApprovedTravel_New_Index_Portal']['View']
                    ) {
                        strBusiness.push('APPROVE_TRAVEL');
                    }

                    if (
                        PermissionForAppMobile.value['New_Att_LateEarlyAllowed_Approve_New_Index'] &&
                        PermissionForAppMobile.value['New_Att_LateEarlyAllowed_Approve_New_Index']['View']
                    ) {
                        strBusiness.push('APPROVE_LATEEARLYALLOWED');
                    }

                    if (
                        PermissionForAppMobile.value['New_Hre_WorkHistorySalary_Approve_New_Index'] &&
                        PermissionForAppMobile.value['New_Hre_WorkHistorySalary_Approve_New_Index']['View']
                    ) {
                        strBusiness.push('TOTAL_WORKHISTORYSALARY');
                    }

                    if (
                        PermissionForAppMobile.value['New_Att_RegisterVehicle_Approve_New_Index'] &&
                        PermissionForAppMobile.value['New_Att_RegisterVehicle_Approve_New_Index']['View']
                    ) {
                        strBusiness.push('APPROVE_REGISTERVEHICLE');
                    }

                    if (
                        PermissionForAppMobile.value['New_Rec_RecruitmentRequestApproval_New_Index'] &&
                        PermissionForAppMobile.value['New_Rec_RecruitmentRequestApproval_New_Index']['View']
                    ) {
                        strBusiness.push('APPROVE_RECRUITMENTREQUEST');
                    }

                    if (
                        PermissionForAppMobile.value['New_Hre_ProfileCardPortalList_Approve_New_Index'] &&
                        PermissionForAppMobile.value['New_Hre_ProfileCardPortalList_Approve_New_Index']['View']
                    ) {
                        strBusiness.push('APPROVE_PROFILECARD');
                    }

                    if (
                        PermissionForAppMobile.value['New_Hre_PersonalSubmitStopWorking_Approve_New_Index_PortalV3'] &&
                        PermissionForAppMobile.value['New_Hre_PersonalSubmitStopWorking_Approve_New_Index_PortalV3'][
                            'View'
                        ]
                    ) {
                        strBusiness.push('TOTAL_STOPWORKINGAPPROVED');
                    }

                    if (
                        PermissionForAppMobile.value['Hre_ProfileWorkList_View_NewPortal'] &&
                        PermissionForAppMobile.value['Hre_ProfileWorkList_View_NewPortal']['View']
                    ) {
                        strBusiness.push('TOTAL_PROFILEWORKLIST_V3');
                    }

                    if (
                        PermissionForAppMobile.value['HRM_PortalV3_PerformanceEva'] &&
                        PermissionForAppMobile.value['HRM_PortalV3_PerformanceEva']['View']
                    ) {
                        strBusiness.push('TOTAL_APPROVE_CONTRACT_V3');
                    }

                    if (
                        PermissionForAppMobile.value['New_Hre_PersonalSubmitStopWorking_Approve_New_Index_PortalV3'] &&
                        PermissionForAppMobile.value['New_Hre_PersonalSubmitStopWorking_Approve_New_Index_PortalV3'][
                            'View'
                        ]
                    ) {
                        strBusiness.push('TOTAL_STOPWORKINGWAITING_V3');
                    }

                    if (
                        PermissionForAppMobile.value['Att_ProfileTimeSheetRegisterApproveV3_Index'] &&
                        PermissionForAppMobile.value['Att_ProfileTimeSheetRegisterApproveV3_Index'][
                            'View'
                        ]
                    ) {
                        strBusiness.push('APPROVE_PROFILETIMESHEET');
                    }
                }

                if (strBusiness.length > 0) {
                    const reload = () => {
                        HttpService.Post(
                            '[URI_SYS]/restapi/CountData/GetDataWaitingApprove',
                            {
                                TypeApprove: strBusiness.join(),
                                UserID: dataVnrStorage.currentUser.headers.userid,
                                IsPortalApp: true
                            },
                            null,
                            reload
                        ).then((dataCount) => {
                            if (typeof dataCount == 'object' && Object.keys(dataCount).length > 0) {
                                return dispatch(actions.setNumberBadgesCountApprove(dataCount));
                            }
                        });
                    };
                    reload();
                } else {
                    return dispatch(actions.setNumberBadgesCountApprove({}));
                }

                if (strBusiness.length > 0 || Vnr_Function.checkPermission('New_Feature_Notification_Tabbar')) {
                    NotificationsService.fetchContbadges();
                }
            }
        };
    },
    fetchCountNotifyInfo: () => {
        // build 19 và từ 42 trở đi thì có
        return (dispatch) => {
            HttpService.Post('[URI_HR]/Por_GetData/Count_SysNotification').then((res) => {
                if (res !== null && res >= 0) {
                    const count = res;
                    return dispatch(actions.setNumberBadgesNotify(count));
                }
            });
        };
    }
};
