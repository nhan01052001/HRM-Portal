/* eslint-disable no-console */
import { EnumTask, EnumName, ScreenName } from '../assets/constant';
import HttpService from '../utils/HttpService';
import moment from 'moment';
import { dataVnrStorage } from '../assets/auth/authentication';
import { getDataLocal, saveDataLocal } from './LocalData';
import store from '../store';
import Vnr_Function from '../utils/Vnr_Function';
import DrawerServices from '../utils/DrawerServices';
import lazyLoadingReducer from '../redux/lazyLoading';

//#region [permission/ConfigData]
// import I18n from 'react-native-i18n';
import { ConfigDashboard } from '../assets/configProject/ConfigDashboard';
import { ConfigField } from '../assets/configProject/ConfigField';
import { ConfigList } from '../assets/configProject/ConfigList';
import { ConfigListDetail } from '../assets/configProject/ConfigListDetail';
import { ConfigListFilter } from '../assets/configProject/ConfigListFilter';
import { PermissionForAppMobile } from '../assets/configProject/PermissionForAppMobile';
import { ConfigDrawer } from '../assets/configProject/ConfigDrawer';
import { ConfigMappingSalary } from '../assets/configProject/ConfigMappingSalary';
import { ConfigChart } from '../assets/configProject/ConfigChart';
import { ConfigVersionBuild } from '../assets/configProject/ConfigVersionBuild';
import { DashboardApi } from '../scenes/home/Home';
import { DrawerApi } from '../components/DrawerComponent/DrawerComponent';
import { TaskIsRuning } from './BackGroundTask';
import { setDataLang } from '../i18n/setDataLang';
//#endregion

const handleDataListModuleCommon = async (api, keyTask, payload) => {
    try {
        // các trường hợp (pulltoRefresh, Màn hình) thì kiểm tra dữ liệu dữ liệu mới và củ có khác nhau hay không
        // paging, filter luôn thay đổi
        // dataChange (dùng để kiểm tra dữ liệu mới và củ  có khác nhau hay không )
        // dataChange == true ? khác : giống nhau
        if (typeof payload === 'object') payload.dataChange = true;
        const dataBody = payload
            ? {
                ...api.getParamsDefault(),
                ...payload
            }
            : api.getParamsDefault();
        const dataListLocal = await getDataLocal(keyTask);

        // không có internet
        if (HttpService.checkConnectInternet() === false) {
            // Đã chạy xong. Bắt buộc chờ task chạy xong mới được chạy lại chống sapam
            TaskIsRuning.listTaskRunning[keyTask] = false;

            // console.log(dataListLocal, 'dataListLocal')
            if (dataListLocal != null && dataListLocal[payload.keyQuery] != null) {
                if (api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                    store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                }
            } else {
                const resSave = await saveDataLocal(keyTask, {
                    ...dataListLocal,
                    ...{
                        [payload.keyQuery]: EnumName.E_EMPTYDATA
                    }
                });
                if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                    store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                }
            }
            return;
        }
        // Có internet+
        const dataListServer = await api.getDataList(dataBody, payload);
        // Đã chạy xong. Bắt buộc chờ task chạy xong mới được chạy lại chống sapam
        TaskIsRuning.listTaskRunning[keyTask] = false;
        if (dataListServer) {
            //Filter
            if (payload && payload.keyQuery === EnumName.E_FILTER) {
                const resSave = await saveDataLocal(keyTask, {
                    ...dataListLocal,
                    ...{
                        [EnumName.E_FILTER]: dataListServer
                    }
                });
                if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                    store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                }
            }
            // Paging
            else if (payload && payload.keyQuery === EnumName.E_PAGING) {
                const resSave = await saveDataLocal(keyTask, {
                    ...dataListLocal,
                    ...{
                        [EnumName.E_PAGING]: dataListServer
                    }
                });

                if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                    store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                }
            }
            // reload
            else if (dataListLocal !== null && dataListLocal[EnumName.E_PRIMARY_DATA] !== EnumName.E_EMPTYDATA) {
                if (payload.isCompare === true) {
                    //So sánh 2 dữ liệu khác nhau thì reload lại danh sách
                    let isEqual = Vnr_Function.compare(dataListServer, dataListLocal[EnumName.E_PRIMARY_DATA]);
                    if (!isEqual) {
                        const resSave = await saveDataLocal(keyTask, {
                            ...dataListLocal,
                            ...{
                                [EnumName.E_PRIMARY_DATA]: dataListServer
                            }
                        });

                        // sau khi lưu thành công và đang ở màn hình hiện tại thì reload
                        if (
                            resSave.actionStatus &&
                            api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                        ) {
                            store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                        }
                    } else {
                        // bằng flase khi dữ liệu giống nhau
                        payload.dataChange = false;
                        store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                    }
                } else {
                    const resSave = await saveDataLocal(keyTask, {
                        ...dataListLocal,
                        ...{
                            [EnumName.E_PRIMARY_DATA]: dataListServer
                        }
                    });

                    if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                        store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                    }
                    // payload.dataChange = true;
                    // store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                }
            } else {
                // chưa có dữ liệu dưới local thì lưu và reload lại danh sách
                const resSave = await saveDataLocal(keyTask, {
                    ...dataListLocal,
                    ...{
                        [payload.keyQuery]: dataListServer
                    }
                });
                if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                    store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                }
            }
        } else {
            // khi không có dữ liệu thì lưu là emplty data
            const resSave = await saveDataLocal(keyTask, {
                ...dataListLocal,
                ...{
                    [payload.keyQuery]: EnumName.E_EMPTYDATA
                }
            });
            if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
            }
        }
    } catch (error) {
        console.log(error, 'handelDataReloadListModuleCommon');
    }
};

//#region [module/attendanceV3/attTakeLeaveDay]
const handleGetDataSubmitTakeLeveaDay = async ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.AttRejectSubmitTakeLeaveDay,
                ScreenName.AttApprovedSubmitTakeLeaveDay,
                ScreenName.AttApproveSubmitTakeLeaveDay,
                ScreenName.AttCanceledSubmitTakeLeaveDay,
                ScreenName.AttSaveTempSubmitTakeLeaveDay,
                ScreenName.AttSubmitTakeLeaveDay,
                ScreenName.AttSubmitTakeLeaveDayViewDetail,
                ScreenName.AttSubmitTakeLeaveDayAddOrEdit
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Att_LeaveDay/New_GetPersonalLeaveDayHandle_App',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.AttSubmitTakeLeaveDay],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.AttSubmitTakeLeaveDay],
                    valueField = [
                        'ID',
                        'ImagePath',
                        'SalaryClassName',
                        'OrgStructureName',
                        'PositionName',
                        'WarningViolation',
                        'DateCreate',
                        'DateApprove',
                        'ApprovalDate',
                        'DateUpdate',
                        'DateReject',
                        'DateCancel',
                        'Status',
                        'itemStatus',
                        'StatusView',
                        // -- //
                        'HoursFrom',
                        'HoursTo',
                        'DateStart',
                        'DateEnd',
                        'LeaveDays',
                        'CodeStatistic',
                        'Comment',
                        'RequestCancelStatus',
                        'itemStatusCancel',
                        'ProfileName',
                        'RelativeTypeName'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                configDetail.forEach(item => {
                    if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                        valueField.push(item.Name);
                    }
                });
                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleGetDataApproveTakeLeaveDay = async ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.AttCanceledTakeLeaveDay,
                ScreenName.AttRejectTakeLeaveDay,
                ScreenName.AttApprovedTakeLeaveDay,
                ScreenName.AttApprovedTakeLeaveDayViewDetail,
                ScreenName.AttApproveTakeLeaveDay
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Att_LeaveDay/New_GetLeaveDayApprovedByFilterHandle_App',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.AttApproveTakeLeaveDay],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.AttApproveTakeLeaveDay],
                    valueField = [
                        'ID',
                        'ImagePath',
                        'SalaryClassName',
                        'OrgStructureName',
                        'PositionName',
                        'WarningViolation',
                        'DateCreate',
                        'DateApprove',
                        'ApprovalDate',
                        'DateUpdate',
                        'DateReject',
                        'DateCancel',
                        'Status',
                        'itemStatus',
                        'StatusView',
                        // -- //
                        'HoursFrom',
                        'HoursTo',
                        'DateStart',
                        'DateEnd',
                        'LeaveDays',
                        'CodeStatistic',
                        'Comment',
                        'RequestCancelStatus',
                        'itemStatusCancel',
                        'ProfileName'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                configDetail.forEach(item => {
                    if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                        valueField.push(item.Name);
                    }
                });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region [module/attendanceV3/attTakeBusinessTrip]
const handleGetDataSubmitTakeBusinessTrip = async ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.AttApprovedSubmitTakeBusinessTrip,
                ScreenName.AttApproveSubmitTakeBusinessTrip,
                ScreenName.AttRejectSubmitTakeBusinessTrip,
                ScreenName.AttCanceledSubmitTakeBusinessTrip,
                ScreenName.AttSaveTempSubmitTakeBusinessTrip,
                ScreenName.AttSubmitTakeBusinessTrip,
                ScreenName.AttSubmitTakeBusinessTripViewDetail,
                ScreenName.AttSubmitTakeBusinessTripAddOrEdit
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Att_BussinessTravel/New_GetBusinessTravelByFilterHandleByUserLoginHandle_App',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.AttSubmitTakeBusinessTrip],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.AttSubmitTakeBusinessTrip],
                    valueField = [
                        'ID',
                        'ImagePath',
                        'SalaryClassName',
                        'OrgStructureName',
                        'PositionName',
                        'WarningViolation',
                        'DateCreate',
                        'DateApprove',
                        'ApprovalDate',
                        'DateUpdate',
                        'DateReject',
                        'DateCancel',
                        'Status',
                        'itemStatus',
                        'StatusView',
                        // -- //
                        'DateStart',
                        'DateEnd',
                        'LeaveDayTypeName',
                        'TotalBussinessDays',
                        'DataNote',
                        'ProfileName'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                configDetail.forEach(item => {
                    if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                        valueField.push(item.Name);
                    }
                });

                let _params = {
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleGetDataApproveTakeBusinessTrip = async ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.AttCanceledTakeBusinessTrip,
                ScreenName.AttRejectTakeBusinessTrip,
                ScreenName.AttApprovedTakeBusinessTrip,
                ScreenName.AttApprovedTakeBusinessTripViewDetail,
                ScreenName.AttApproveTakeBusinessTrip
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Att_BussinessTravel/New_GetBusinessTravelApproveddByFilterHandle_App',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.AttApproveTakeBusinessTrip],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.AttApproveTakeBusinessTrip],
                    valueField = [
                        'ID',
                        'ImagePath',
                        'SalaryClassName',
                        'OrgStructureName',
                        'PositionName',
                        'WarningViolation',
                        'DateCreate',
                        'DateApprove',
                        'ApprovalDate',
                        'DateUpdate',
                        'DateReject',
                        'DateCancel',
                        'Status',
                        'itemStatus',
                        'StatusView',
                        // -- //
                        'DateStart',
                        'DateEnd',
                        'LeaveDayTypeName',
                        'TotalBussinessDays',
                        'DataNote',
                        'ProfileName'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                configDetail.forEach(item => {
                    if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                        valueField.push(item.Name);
                    }
                });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};
//#region [module/attendanceV3/attTSLRegisterV3
const handleGetDataSubmitTamScanLogRegister = async ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.AttApprovedSubmitTamScanLogRegister,
                ScreenName.AttApproveSubmitTamScanLogRegister,
                ScreenName.AttCanceledSubmitTamScanLogRegister,
                ScreenName.AttRejectSubmitTamScanLogRegister,
                ScreenName.AttSaveTempSubmitTamScanLogRegister,
                ScreenName.AttSubmitTamScanLogRegister,
                ScreenName.AttSubmitTamScanLogRegisterViewDetail,
                ScreenName.AttSubmitTamScanLogRegisterAddOrEdit
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Att_TAMScanLogRegister/New_GetPersonalSubmitRegistedTamScanLogHandle_App',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.AttSubmitTamScanLogRegister],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.AttSubmitTamScanLogRegister],
                    valueField = [
                        'ID',
                        'ImagePath',
                        'SalaryClassName',
                        'OrgStructureName',
                        'PositionName',
                        'WarningViolation',
                        'DateCreate',
                        'DateApprove',
                        'ApprovalDate',
                        'DateUpdate',
                        'DateReject',
                        'DateCancel',
                        'Status',
                        'itemStatus',
                        'StatusView',
                        // -- //
                        'Type',
                        'TimeLog',
                        'IsCheckApp',
                        'ShopNamebyGPS',
                        'TAMScanReasonMissName',
                        'ProfileName'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                configDetail.forEach(item => {
                    if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                        valueField.push(item.Name);
                    }
                });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleGetDataApproveTamScanLogRegister = async ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.AttAllTamScanLogRegister,
                ScreenName.AttCanceledTamScanLogRegister,
                ScreenName.AttRejectTamScanLogRegister,
                ScreenName.AttApprovedTamScanLogRegister,
                ScreenName.AttApproveTamScanLogRegisterViewDetail,
                ScreenName.AttApproveTamScanLogRegister
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Att_TAMScanLogRegister/New_Get_TamScanLog_WaitingApproveByUserHandle_App',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.AttApproveTamScanLogRegister],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.AttApproveTamScanLogRegister],
                    valueField = [
                        'ID',
                        'ImagePath',
                        'SalaryClassName',
                        'OrgStructureName',
                        'PositionName',
                        'WarningViolation',
                        'DateCreate',
                        'DateApprove',
                        'ApprovalDate',
                        'DateUpdate',
                        'DateReject',
                        'DateCancel',
                        'Status',
                        'Comment',
                        'itemStatus',
                        'StatusView',
                        // -- //
                        'Type',
                        'TimeLog',
                        'IsCheckApp',
                        'ShopNamebyGPS',
                        'TAMScanReasonMissName',
                        'ProfileName'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                configDetail.forEach(item => {
                    if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                        valueField.push(item.Name);
                    }
                });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    Status: 'E_APPROVED1,E_APPROVED2,E_APPROVED3,E_APPROVED,E_REJECTED,E_CANCEL',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region [module/attendance/attTakeLateEarlyAllowed]
const handleGetDataSubmitTakeLateEarlyAllowed = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.AttSubmitTakeLateEarlyAllowed,
                ScreenName.AttSaveTempSubmitTakeLateEarlyAllowed,
                ScreenName.AttCanceledSubmitTakeLateEarlyAllowed,
                ScreenName.AttApproveSubmitTakeLateEarlyAllowed,
                ScreenName.AttApprovedSubmitTakeLateEarlyAllowed,
                ScreenName.AttRejectSubmitTakeLateEarlyAllowed,
                ScreenName.AttSubmitTakeLateEarlyAllowedViewDetail,
                ScreenName.AttSubmitTakeLateEarlyAllowedAddOrEdit
            ],
            getDataList: (dataBody, payload) => {
                console.log(dataBody, 'dataBody');
                return HttpService.Post(
                    '[URI_CENTER]/api/Att_LateEarlyAllowed/GetLateEarlyAllowedByFilterHandle_App',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.AttSubmitTakeLateEarlyAllowed],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.AttSubmitTakeLateEarlyAllowed],
                    valueField = [
                        'ID',
                        'Status',
                        'ApproveHours',
                        'RegisterHours',
                        'ConfirmHours',
                        'WorkDateRoot',
                        'InTime',
                        'OutTime',
                        'Rate',
                        'RequestCancelStatus',
                        'itemStatusCancel',
                        'StatusView',
                        'WarningViolation',
                        'ReasonOT',
                        'DateCreate',
                        'DateApprove',
                        'ApprovalDate',
                        'DateUpdate',
                        'DateReject',
                        'DateCancel',
                        'ProfileName'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                configDetail.forEach(item => {
                    if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                        valueField.push(item.Name);
                    }
                });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleGetDataApproveTakeLateEarlyAllowed = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.AttCanceledTakeLateEarlyAllowed,
                ScreenName.AttRejectTakeLateEarlyAllowed,
                ScreenName.AttApprovedTakeLateEarlyAllowed,
                ScreenName.AttApprovedTakeLateEarlyAllowedViewDetail,
                ScreenName.AttApproveTakeLateEarlyAllowed
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Att_LateEarlyAllowed/GetLateEarlyAllowedApprovedByFilterHandle_App',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.AttApproveTakeLateEarlyAllowed],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.AttApproveTakeLateEarlyAllowed],
                    valueField = [
                        'ID',
                        'ImagePath',
                        'SalaryClassName',
                        'OrgStructureName',
                        'PositionName',
                        'Status',
                        'ApproveHours',
                        'RegisterHours',
                        'ConfirmHours',
                        'WorkDateRoot',
                        'InTime',
                        'OutTime',
                        'Rate',
                        'RequestCancelStatus',
                        'itemStatusCancel',
                        'itemStatus',
                        'StatusView',
                        'WarningViolation',
                        'ReasonOT',
                        'DateCreate',
                        'DateApprove',
                        'ApprovalDate',
                        'DateUpdate',
                        'DateReject',
                        'DateCancel',
                        'ProfileName'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                configDetail.forEach(item => {
                    if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                        valueField.push(item.Name);
                    }
                });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region [module/hreWorkManage]
const handleGetHreWorkBoard = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreAllWorkBoard,
                ScreenName.HreDoneWorkBoard,
                ScreenName.HreWaitWorkBoard,
                ScreenName.HreWorkBoardViewDetail,
                'TopTabHreWorkManage',
                'TopTabHreWorkBoard'
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Hre_ProfileWorkList/New_GetProfileWorkList',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreWaitWorkManage],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreWorkManageViewDetail],
                    valueField = [
                        'ProfileID',
                        'Type',
                        'ImagePath',
                        'ProfileName',
                        'CodeEmp',
                        'OrgStructureName',
                        'WorkListTypeView',
                        'CompletedTaskCount',
                        'TaskCount',
                        'ProgressTask',
                        'WorkListStatus',
                        'WorkListStatusView',
                        'TotalRow',
                        'ID',
                        'isSelect',
                        'itemStatus'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail)
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    IsManager: false,
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};
const handleGetHreWorkManage = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreAllWorkManage,
                ScreenName.HreDoneWorkManage,
                ScreenName.HreWaitWorkManage,
                ScreenName.HreWorkManageViewDetail,
                'TopTabHreWorkManage',
                'TopTabHreWorkBoard'
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Hre_ProfileWorkList/New_GetProfileWorkList',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreWaitWorkManage],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreWorkManageViewDetail],
                    valueField = [
                        'ProfileID',
                        'Type',
                        'ImagePath',
                        'ProfileName',
                        'CodeEmp',
                        'OrgStructureName',
                        'WorkListTypeView',
                        'CompletedTaskCount',
                        'TaskCount',
                        'ProgressTask',
                        'WorkListStatus',
                        'WorkListStatusView',
                        'TotalRow',
                        'ID',
                        'isSelect',
                        'itemStatus'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail)
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    IsManager: true,
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region [module/humanResource/hrePersonalManage]
const handleHrePersonalInfoManage = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreAllPersonalInfoManage,
                ScreenName.HreHirePersonalInfoManage,
                ScreenName.HreStopPersonalInfoManage,
                ScreenName.HreWaitPersonalInfoManage,
                ScreenName.HrePersonalInfoManageViewDetail,
                'TopTabPersonalInfoManage'
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Hre_ProfileAPI/New_GetProfileAllNewPortal',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreAllPersonalInfoManage],
                    rowConfig = _configList[EnumName.E_Row] ? _configList[EnumName.E_Row] : null,
                    filter = _configList[EnumName.E_Filter] ? _configList[EnumName.E_Filter] : null,
                    configDetail = ConfigListDetail.value[ScreenName.HrePersonalInfoManageViewDetail]
                        ? ConfigListDetail.value[ScreenName.HrePersonalInfoManageViewDetail]
                        : null,
                    valueField = ['ID', 'ProfileName', 'ImagePath', 'OrgStructureName'];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail && rowConfig)
                    [...rowConfig, ...configDetail].forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    IsManager: true,
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleHreDocumentManage = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreAllDocumentManage,
                ScreenName.HreHireDocumentManage,
                ScreenName.HreStopDocumentManage,
                ScreenName.HreWaitDocumentManage,
                ScreenName.HreDocumentManageViewDetail,
                'TopTabDocumentManage'
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Hre_ReqDocument/New_GetProfileReqDocument',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreAllDocumentManage],
                    rowConfig = _configList[EnumName.E_Row],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreDocumentManageViewDetail],
                    valueField = ['ID', 'ProfileName', 'ImagePath', 'OrgStructureName'];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail && rowConfig)
                    [...rowConfig, ...configDetail].forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    IsManager: true,
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleHreRelativeManage = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreAllRelativeManage,
                ScreenName.HreHireRelativeManage,
                ScreenName.HreStopRelativeManage,
                ScreenName.HreWaitRelativeManage,
                ScreenName.HreRelativeManageViewDetail,
                'TopTabRelativeManage'
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Hre_Relatives/New_GetRelativesByIdList',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreAllRelativeManage],
                    rowConfig = _configList[EnumName.E_Row],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreRelativeManageViewDetail],
                    valueField = ['ID', 'ProfileName', 'ImagePath', 'OrgStructureName'];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail && rowConfig)
                    [...rowConfig, ...configDetail].forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    IsManager: true,
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleHreCompensationManage = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreAllCompensationManage,
                ScreenName.HreHireCompensationManage,
                ScreenName.HreStopCompensationManage,
                ScreenName.HreWaitCompensationManage,
                ScreenName.HreCompensationManageViewDetail,
                'TopTabCompensationManage'
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Att_GetData/New_GetCompensationDetailPersonal',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreAllCompensationManage],
                    rowConfig = _configList[EnumName.E_Row],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreCompensationManageViewDetail],
                    valueField = ['ID', 'ProfileName', 'ImagePath', 'OrgStructureName', 'ProfileID'];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail && rowConfig)
                    [...rowConfig, ...configDetail].forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    IsManager: true,
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleHreAnnualManage = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreAllAnnualManage,
                ScreenName.HreHireAnnualManage,
                ScreenName.HreStopAnnualManage,
                ScreenName.HreWaitAnnualManage,
                ScreenName.HreAnnualManageViewDetail,
                'TopTabAnnualManage'
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Att_GetData/New_GetAnnualDetailPersonal',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreAllAnnualManage],
                    rowConfig = _configList[EnumName.E_Row],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreAnnualManageViewDetail],
                    valueField = ['ID', 'ProfileName', 'ImagePath', 'OrgStructureName', 'ProfileID'];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail && rowConfig)
                    [...rowConfig, ...configDetail].forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleHreRewardManage = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreAllRewardManage,
                ScreenName.HreHireRewardManage,
                ScreenName.HreStopRewardManage,
                ScreenName.HreWaitRewardManage,
                ScreenName.HreRewardManageViewDetail,
                'TopTabRewardManage'
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Hre_Reward/New_GetProfileReward',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreAllRewardManage],
                    rowConfig = _configList[EnumName.E_Row],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreRewardManageViewDetail],
                    valueField = ['ID', 'ProfileName', 'ImagePath', 'OrgStructureName'];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail && rowConfig)
                    [...rowConfig, ...configDetail].forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    IsManager: true,
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleHreCandidateHistory = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreAllCandidateHistory,
                ScreenName.HreHireCandidateHistory,
                ScreenName.HreStopCandidateHistory,
                ScreenName.HreWaitCandidateHistory,
                ScreenName.HreCandidateHistoryViewDetail,
                'TopTabCandidateHistory'
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]api/Hre_CandidateHistory/New_GetCandidateHistoryPortal',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreAllCandidateHistory],
                    rowConfig = _configList[EnumName.E_Row],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreCandidateHistoryViewDetail],
                    valueField = ['ID', 'ProfileName', 'ImagePath', 'OrgStructureName', 'CompanyName'];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail && rowConfig)
                    [...rowConfig, ...configDetail].forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    IsManager: true,
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleHreInforContactManage = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreAllInforContact,
                ScreenName.HreHireInforContact,
                ScreenName.HreStopInforContact,
                ScreenName.HreWaitInforContact,
                ScreenName.HreInforContactViewDetail,
                'TopTabInforContactManage'
            ],
            getDataList: (dataBody, payload) => {
                console.log(dataBody, 'dataBody');
                return HttpService.Post(
                    '[URI_CENTER]/api/Hre_ProfileAPI/New_GetProfileContactPortal',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreAllInforContact],
                    rowConfig = _configList ? _configList[EnumName.E_Row] : null,
                    filter = _configList ? _configList[EnumName.E_Filter] : null,
                    configDetail = ConfigListDetail.value[ScreenName.HreInforContactViewDetail]
                        ? ConfigListDetail.value[ScreenName.HreInforContactViewDetail]
                        : null,
                    valueField = ['ID', 'ProfileName', 'ImagePath', 'OrgStructureName'];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail && rowConfig)
                    [...rowConfig, ...configDetail].forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    IsManager: true,
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleHrePersonalInfoProfileIdentification = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreAllPersonalInfoProfileIdentification,
                ScreenName.HreHirePersonalInfoProfileIdentification,
                ScreenName.HreStopPersonalInfoProfileIdentification,
                ScreenName.HreWaitPersonalInfoProfileIdentification,
                ScreenName.HrePersonalInfoProfileIdentificationViewDetail,
                'HrePersonalInfoProfileIdentificationViewDetail'
            ],
            getDataList: (dataBody, payload) => {
                console.log(dataBody, 'dataBody');
                return HttpService.Post(
                    '[URI_CENTER]/api/Hre_ProfileAPI/ListDocumentPersonal',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreAllPersonalInfoProfileIdentification],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HrePersonalInfoManageViewDetail],
                    valueField = [
                        'ID',
                        'ProfileName',
                        'CodeEmp',
                        'PositionName',
                        'JobTitleName',
                        'DateHire',
                        'CodeAttendance',
                        'CodeTax',
                        'DateSenior',
                        'DateStartProbation',
                        'OrgStructureID',
                        'WorkPlaceID',
                        'GenderView',
                        'DateOfBirth',
                        'SalaryClassName',
                        'EducationLevelName',
                        'EducationLevelFile',
                        'Specialization',
                        'SpecializationFile',
                        'MarriageStatusView',
                        'FileAttach',
                        'Origin',
                        'ReligionName',
                        'EthnicGroupName',
                        'ReligionName',
                        'PlaceOfBirthName',
                        'DayOfAnnualLeave',
                        'SupervisorID',
                        'MidSupervisorID',
                        'NextSupervisorID',
                        'HighSupervisorID'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail)
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    IsManager: true,
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleHreEducationLevel = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreAllEducationLevel,
                ScreenName.HreHireEducationLevel,
                ScreenName.HreStopEducationLevel,
                ScreenName.HreWaitEducationLevel,
                ScreenName.HreEducationLevelViewDetail,
                'HreEducationLevelViewDetail'
            ],
            getDataList: (dataBody, payload) => {
                console.log(dataBody, 'dataBody');
                return HttpService.Post(
                    '[URI_CENTER]/api/Hre_AcademicLevel/New_GetProfileAcademicLevelList',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreAllEducationLevel],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreEducationLevelViewDetail],
                    valueField = [
                        'ID',
                        'ProfileName',
                        'CodeEmp',
                        'PositionName',
                        'JobTitleName',
                        'DateHire',
                        'CodeAttendance',
                        'CodeTax',
                        'DateSenior',
                        'DateStartProbation',
                        'OrgStructureID',
                        'WorkPlaceID',
                        'GenderView',
                        'DateOfBirth',
                        'SalaryClassName',
                        'EducationLevelName',
                        'EducationLevelFile',
                        'Specialization',
                        'SpecializationFile',
                        'MarriageStatusView',
                        'FileAttach',
                        'Origin',
                        'ReligionName',
                        'EthnicGroupName',
                        'ReligionName',
                        'PlaceOfBirthName',
                        'DayOfAnnualLeave',
                        'SupervisorID',
                        'MidSupervisorID',
                        'NextSupervisorID',
                        'HighSupervisorID'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail)
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    IsManager: true,
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleHreContractManage = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreAllContractManage,
                ScreenName.HreHireContractManage,
                ScreenName.HreStopContractManage,
                ScreenName.HreWaitContractManage,
                ScreenName.HreContractManageViewDetail,
                'TopTabContractManage'
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Hre_Contract/New_GetContractNewPortal',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreAllContractManage],
                    rowConfig = _configList[EnumName.E_Row],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreContractManageViewDetail],
                    valueField = ['ID', 'ProfileName', 'ImagePath', 'OrgStructureName'];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail && rowConfig)
                    [...rowConfig, ...configDetail].forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleHreAccidentManage = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreAllAccidentManage,
                ScreenName.HreHireAccidentManage,
                ScreenName.HreStopAccidentManage,
                ScreenName.HreWaitAccidentManage,
                ScreenName.HreAccidentManageViewDetail,
                'TopTabAccidentManage'
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Hre_ProfileAPI/New_GetProfileAccidentPortal',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreAllAccidentManage],
                    rowConfig = _configList[EnumName.E_Row],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreAccidentManageViewDetail],
                    valueField = ['ID', 'ProfileName', 'ImagePath', 'OrgStructureName'];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail && rowConfig)
                    [...rowConfig, ...configDetail].forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    IsManager: true,
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleHrePartyAndUnionManage = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreAllPartyAndUnion,
                ScreenName.HreHirePartyAndUnion,
                ScreenName.HreStopPartyAndUnion,
                ScreenName.HreWaitPartyAndUnion,
                ScreenName.HrePartyAndUnionViewDetail,
                'TopTabPartyAndUnionManage'
            ],
            getDataList: (dataBody, payload) => {
                console.log(dataBody, 'dataBody');
                return HttpService.Post(
                    '[URI_CENTER]/api/Hre_ProfilePartyUnionAPI/GetProfilePartyUnionList',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreAllPartyAndUnion],
                    rowConfig = _configList ? _configList[EnumName.E_Row] : null,
                    filter = _configList ? _configList[EnumName.E_Filter] : null,
                    configDetail = ConfigListDetail.value[ScreenName.HrePartyAndUnionViewDetail]
                        ? ConfigListDetail.value[ScreenName.HreInforContactViewDetail]
                        : null,
                    valueField = ['ID', 'ProfileName', 'ImagePath', 'OrgStructureName'];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail && rowConfig)
                    [...rowConfig, ...configDetail].forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    IsManager: true,
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleHreMovementHistory = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreAllMovementHistory,
                ScreenName.HreHireMovementHistory,
                ScreenName.HreStopMovementHistory,
                ScreenName.HreWaitMovementHistory,
                ScreenName.HreMovementHistoryViewDetail,
                'TopTabHreMovementHistory'
            ],
            getDataList: (dataBody, payload) => {
                console.log(dataBody, 'dataBody');
                return HttpService.Post(
                    '[URI_CENTER]/api/Hre_ProfileAPI/New_GetProfileWorkHistoryPortal',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreAllMovementHistory],
                    rowConfig = _configList ? _configList[EnumName.E_Row] : null,
                    filter = _configList ? _configList[EnumName.E_Filter] : null,
                    configDetail = ConfigListDetail.value[ScreenName.HreMovementHistoryViewDetail]
                        ? ConfigListDetail.value[ScreenName.HreInforContactViewDetail]
                        : null,
                    valueField = ['ID', 'ProfileName', 'ImagePath', 'OrgStructureName'];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail && rowConfig)
                    [...rowConfig, ...configDetail].forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    IsManager: true,
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleHreConcurrentManage = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreAllConcurrentManage,
                ScreenName.HreHireConcurrentManage,
                ScreenName.HreStopConcurrentManage,
                ScreenName.HreWaitConcurrentManage,
                ScreenName.HreConcurrentManageViewDetail,
                'TopTabConcurrentManage'
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Hre_ProfileAPI/New_GetProfile_ConCurrentPortal',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreAllConcurrentManage],
                    rowConfig = _configList[EnumName.E_Row],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreConcurrentManageViewDetail],
                    valueField = ['ID', 'ProfileName', 'ImagePath', 'OrgStructureName'];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail && rowConfig)
                    [...rowConfig, ...configDetail].forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    IsManager: true,
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleHreDisciplineManage = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreAllDisciplineManage,
                ScreenName.HreHireDisciplineManage,
                ScreenName.HreStopDisciplineManage,
                ScreenName.HreWaitDisciplineManage,
                ScreenName.HreDisciplineManageViewDetail,
                'TopTabDisciplineManage'
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Hre_Discipline/New_GetDisciplinePortal',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreAllDisciplineManage],
                    rowConfig = _configList[EnumName.E_Row],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreDisciplineManageViewDetail],
                    valueField = ['ID', 'ProfileName', 'ImagePath', 'OrgStructureName'];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail && rowConfig)
                    [...rowConfig, ...configDetail].forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    IsManager: true,
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleHreTaxPayManage = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreAllTaxPayManage,
                ScreenName.HreHireTaxPayManage,
                ScreenName.HreStopTaxPayManage,
                ScreenName.HreWaitTaxPayManage,
                ScreenName.HreTaxPayManageViewDetail,
                'TopTabTaxPayManage'
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Hre_TaxInfo/GetAllDataGirdTax',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreAllTaxPayManage],
                    rowConfig = _configList[EnumName.E_Row],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreTaxPayManageViewDetail],
                    valueField = ['ID', 'ProfileName', 'ImagePath', 'OrgStructureName'];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail && rowConfig)
                    [...rowConfig, ...configDetail].forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    IsManager: true,
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleHreInsuranceManage = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreAllInsuranceManage,
                ScreenName.HreHireInsuranceManage,
                ScreenName.HreStopInsuranceManage,
                ScreenName.HreWaitInsuranceManage,
                ScreenName.HreInsuranceManageViewDetail,
                'TopTabInsuranceManage'
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Hre_ProfileAPI/New_GetProfileInsurancePortal',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreAllInsuranceManage],
                    rowConfig = _configList[EnumName.E_Row],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreInsuranceManageViewDetail],
                    valueField = ['ID', 'ProfileName', 'ImagePath', 'OrgStructureName'];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail && rowConfig)
                    [...rowConfig, ...configDetail].forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    IsManager: true,
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleEvalutionContract = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreAllEvalutionContract,
                ScreenName.HreDoneEvalutionContract,
                ScreenName.HreWaitEvalutionContract,
                ScreenName.HreEvalutionContractViewDetail,
                'TopTabEvalutionContract'
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Hre_Contract/GetDataGridPerformanceEvaContract',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreWaitEvalutionContract],
                    rowConfig = _configList[EnumName.E_Row],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreEvalutionContractViewDetail],
                    valueField = ['ID', 'ProfileName', 'ImagePath', 'OrgStructureName'];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail && rowConfig)
                    [...rowConfig, ...configDetail].forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    IsManager: true,
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region [module/attendance/attSubmitWorkingOvertime]
const handleGetDataSubmitWorkingOvertime = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.AttSubmitWorkingOvertime,
                ScreenName.AttSaveTempSubmitWorkingOvertime,
                ScreenName.AttCanceledSubmitWorkingOvertime,
                ScreenName.AttApproveSubmitWorkingOvertime,
                ScreenName.AttApprovedSubmitWorkingOvertime,
                ScreenName.AttConfirmedSubmitWorkingOvertime,
                ScreenName.AttRejectSubmitWorkingOvertime,
                ScreenName.AttSubmitWorkingOvertimeViewDetail,
                ScreenName.AttSubmitWorkingOvertimeAddOrEdit
            ],
            getDataList: (dataBody, payload) => {
                console.log(dataBody, 'dataBody');
                
                return HttpService.Post(
                    dataBody.api ?? '[URI_CENTER]/api/Att_OvertimePlan/New_PlanOvertimeByFilterHandle_App',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.AttSubmitWorkingOvertime],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.AttSubmitWorkingOvertime],
                    valueField = [
                        'ID',
                        'Status',
                        'ApproveHours',
                        'RegisterHours',
                        'ConfirmHours',
                        'WorkDateRoot',
                        'InTime',
                        'OutTime',
                        'Rate',
                        'RequestCancelStatus',
                        'itemStatusCancel',
                        'StatusView',
                        'WarningViolation',
                        'ReasonOT',
                        'DateCreate',
                        'DateApprove',
                        'ApprovalDate',
                        'DateUpdate',
                        'DateReject',
                        'DateCancel',
                        'ProfileName'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                configDetail.forEach(item => {
                    if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                        valueField.push(item.Name);
                    }
                });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleGetDataApproveWorkingOvertime = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.AttCanceledWorkingOvertime,
                ScreenName.AttRejectWorkingOvertime,
                ScreenName.AttApprovedWorkingOvertime,
                ScreenName.AttApprovedWorkingOvertimeViewDetail,
                ScreenName.AttApproveWorkingOvertime
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Att_OvertimePlan/New_PlanGetOvertimeApprovedByFilterHandle_App',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.AttApproveWorkingOvertime],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.AttApproveWorkingOvertime],
                    valueField = [
                        'ID',
                        'ImagePath',
                        'SalaryClassName',
                        'OrgStructureName',
                        'PositionName',
                        'Status',
                        'ApproveHours',
                        'RegisterHours',
                        'ConfirmHours',
                        'WorkDateRoot',
                        'InTime',
                        'OutTime',
                        'Rate',
                        'RequestCancelStatus',
                        'itemStatusCancel',
                        'itemStatus',
                        'StatusView',
                        'WarningViolation',
                        'ReasonOT',
                        'DateCreate',
                        'DateApprove',
                        'ApprovalDate',
                        'DateUpdate',
                        'DateReject',
                        'DateCancel',
                        'ProfileName'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                configDetail.forEach(item => {
                    if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                        valueField.push(item.Name);
                    }
                });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region [module/humanResource/hreTerminationOfWork]
const handleGetDataSubmitTerminationOfWork = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreSubmitTerminationOfWork,
                ScreenName.HreSubmitTerminationOfWorkViewDetail,
                ScreenName.HreSubmitTerminationOfWorkAddOrEdit
            ],
            getDataList: (dataBody, payload) => {
                console.log(dataBody, 'dataBody');
                return HttpService.Post(
                    '[URI_CENTER]/api/Hre_StopWorking/New_GetStopWorkingNewPortal',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreSubmitTerminationOfWork],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreSubmitTerminationOfWork],
                    valueField = [
                        'ID',
                        'Status',
                        'TypeOfStopName',
                        'ResignReasonName',
                        'OtherReason',
                        'LastWorkingDay',
                        'DateStop',
                        'RequestDate',
                        'DecisionNo',
                        'Attachment',
                        'Note',
                        'PersonRequestingChangeName',
                        'DateChangeRequest',
                        'ReasonRequestingChange',
                        'DeclineReason',
                        'StatusView'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail) {
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });
                }

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleGetDataApproveTerminationOfWork = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreCanceledTerminationOfWork,
                ScreenName.HreRejectTerminationOfWork,
                ScreenName.HreApprovedTerminationOfWork,
                ScreenName.HreApproveTerminationOfWorkViewDetail,
                ScreenName.HreApproveTerminationOfWork
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Hre_StopWorking/New_GetStopWorkingApprovedNewPortal',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreApproveTerminationOfWork],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreApproveTerminationOfWork],
                    valueField = [
                        'ID',
                        'ImagePath',
                        'SalaryClassName',
                        'OrgStructureName',
                        'PositionName',
                        'Status',
                        'ApproveHours',
                        'RegisterHours',
                        'ConfirmHours',
                        'WorkDateRoot',
                        'InTime',
                        'OutTime',
                        'Rate',
                        'RequestCancelStatus',
                        'itemStatusCancel',
                        'itemStatus',
                        'StatusView',
                        'WarningViolation',
                        'ReasonOT',
                        'DateCreate',
                        'DateApprove',
                        'ApprovalDate',
                        'DateUpdate',
                        'DateReject',
                        'DateCancel'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail) {
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });
                }

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region [module/salaryV3/salPITFinalization]
const handleGetDataSalSubmitPITFinalization = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.SalSubmitPITFinalization,
                ScreenName.SalCanceledSubmitPITFinalization,
                ScreenName.SalWaitingConfirmSubmitPITFinalization,
                ScreenName.SalSaveTempSubmitPITFinalization,
                ScreenName.SalRejectedSubmitPITFinalization,
                ScreenName.SalConfirmedSubmitPITFinalization,
                ScreenName.SalSubmitPITAmountViewDetail,
                ScreenName.SalSubmitPITFinalizationAddOrEdit
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Sal_PITFinalizationDelegatee/New_GetPersonalPITFinalizationDelegateeHandle',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.SalSubmitPITFinalization],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.SalSubmitPITFinalizationViewDetail],
                    valueField = [
                        'ID,Year,RegisterTypeView,CodeTax,UserConfirm,DateConfirm,StatusView,Note,FileAttachment,Nationality,UserReject,DateReject,DeclineReason,UserCancel,DateCancel,CommentCancel,IsPITFinalization,IsExportTax,IsTaxableIncome,IsTransferCompany,IsTaxCurrentIncome,OrgStructureName,PositionName,CompanyName,PayrollGroupName,ProfileName,CodeEmp,AbilityTitleVNI,WorkPlaceName,LaborTypeView,SalaryClassName,DateHire,DateQuit,EmployeeGroupName'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail) {
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });
                }

                let _params = {
                    IsPortalNew: true,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region [module/attendanceV3/attRosterShiftChange]
const handleGetDataSubmitShiftChange = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.AttSubmitShiftChange,
                ScreenName.AttSaveTempSubmitShiftChange,
                ScreenName.AttCanceledSubmitShiftChange,
                ScreenName.AttApproveSubmitShiftChange,
                ScreenName.AttApprovedSubmitShiftChange,
                ScreenName.AttRejectSubmitShiftChange,
                ScreenName.AttSubmitShiftChangeViewDetail,
                ScreenName.AttSubmitShiftChangeAddOrEdit
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Att_Roster/GetRosterByFilter',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.AttSubmitShiftChange],
                    filter = _configList[EnumName.E_Filter] ?? [],
                    configDetail = ConfigListDetail.value[ScreenName.AttSubmitShiftChangeViewDetail],
                    valueField = [
                        'ID',
                        'Status',
                        'ProfileName',
                        'ProfileName2',
                        'StrChangeDate',
                        'AlternateDate',
                        'RegisterHours',
                        'ChangeShiftTypeView',
                        'MonShiftName_Old',
                        'TueShiftName_Old',
                        'WedShiftName_Old',
                        'ThuShiftName_Old',
                        'FriShiftName_Old',
                        'SatShiftName_Old',
                        'SunShiftName_Old',
                        'MonShiftName',
                        'TueShiftName',
                        'WedShiftName',
                        'ThuShiftName',
                        'FriShiftName',
                        'SatShiftName',
                        'SunShiftName',
                        'WorkDateRoot',
                        'CurrentApprover',
                        'OutTime',
                        'Comment',
                        'StatusView'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                configDetail.forEach(item => {
                    if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                        valueField.push(item.Name);
                    }
                });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleGetDataApproveShiftChange = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.AttAllTakeShiftChange,
                ScreenName.AttCanceledShiftChange,
                ScreenName.AttRejectShiftChange,
                ScreenName.AttApprovedShiftChange,
                ScreenName.AttApproveShiftChangeViewDetail,
                ScreenName.AttApproveShiftChange
            ],
            getDataList: (dataBody, payload) => {
                console.log(dataBody, 'dataBody');

                return HttpService.Post(
                    '[URI_CENTER]/api/Att_Roster/GetRosterApproveChangeShiftByFilter',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.AttApproveShiftChange],
                    filter = _configList[EnumName.E_Filter] ?? [],
                    configDetail = ConfigListDetail.value[ScreenName.AttApproveShiftChange],
                    valueField = [
                        'ID',
                        'ImagePath',
                        'SalaryClassName',
                        'OrgStructureName',
                        'PositionName',
                        'Status',
                        'ApproveHours',
                        'RegisterHours',
                        'ConfirmHours',
                        'WorkDateRoot',
                        'InTime',
                        'OutTime',
                        'Rate',
                        'RequestCancelStatus',
                        'itemStatusCancel',
                        'itemStatus',
                        'StatusView',
                        'WarningViolation',
                        'ReasonOT',
                        'DateCreate',
                        'DateApprove',
                        'ApprovalDate',
                        'DateUpdate',
                        'DateReject',
                        'DateCancel'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail)
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region [module/attendance/attSubmitTakeDailyTask]
const handleGetDataSubmitTakeDailyTask = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.AttSubmitTakeDailyTask,
                ScreenName.AttSaveTempSubmitTakeDailyTask,
                ScreenName.AttCanceledSubmitTakeDailyTask,
                ScreenName.AttApproveSubmitTakeDailyTask,
                ScreenName.AttApprovedSubmitTakeDailyTask,
                ScreenName.AttRejectSubmitTakeDailyTask,
                ScreenName.AttSubmitTakeDailyTaskViewDetail,
                ScreenName.AttSubmitTakeDailyTaskAddOrEdit
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Att_Roster/New_GetPersonalProfileTimeSheetHandle',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.AttSubmitTakeDailyTask],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.AttSubmitTakeDailyTask],
                    valueField = [
                        'ID',
                        'ImagePath',
                        'OrgStructureName',
                        'PositionName',
                        'Status',
                        'ApproveHours',
                        'JobTypeName',
                        'OrgStructureTransName',
                        'ShopTransName',
                        'OvertimeTypeID1Name',
                        'OvertimeTypeID2Name',
                        'OvertimeTypeID3Name',
                        'Note',
                        'WorkDate',
                        'RequestCancelStatus',
                        'itemStatusCancel',
                        'itemStatus',
                        'StatusView',
                        'WarningViolation',
                        'DateCreate',
                        'DateApprove',
                        'ApprovalDate',
                        'DateUpdate',
                        'DateReject',
                        'DateCancel'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                configDetail.forEach(item => {
                    if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                        valueField.push(item.Name);
                    }
                });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleGetDataApproveTakeDailyTask = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.AttCanceledTakeDailyTask,
                ScreenName.AttRejectTakeDailyTask,
                ScreenName.AttApprovedTakeDailyTask,
                ScreenName.AttApprovedTakeDailyTaskViewDetail,
                ScreenName.AttApproveTakeDailyTask
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Att_Roster/New_GetProfileTimeSheetByUserProcess',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.AttApproveTakeDailyTask],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.AttApproveTakeDailyTask],
                    valueField = [
                        'ID',
                        'ImagePath',
                        'SalaryClassName',
                        'OrgStructureName',
                        'PositionName',
                        'Status',
                        'ApproveHours',
                        'JobTypeName',
                        'OrgStructureTransName',
                        'ShopTransName',
                        'OvertimeTypeID1Name',
                        'OvertimeTypeID2Name',
                        'OvertimeTypeID3Name',
                        'Note',
                        'WorkDate',
                        'RequestCancelStatus',
                        'itemStatusCancel',
                        'itemStatus',
                        'StatusView',
                        'WarningViolation',
                        'DateCreate',
                        'DateApprove',
                        'ApprovalDate',
                        'DateUpdate',
                        'DateReject',
                        'DateCancel'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                configDetail.forEach(item => {
                    if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                        valueField.push(item.Name);
                    }
                });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region [module/humanResourceV3/hreRecruitment/hreProcessingCandidateApplications]
const handleGetDataProcessingCandidateApplications = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HrePendingProcessingCandidateApplications,
                ScreenName.HreProcesedProcessingCandidateApplications,
                ScreenName.HreProcessingCandidateApplicationsViewDetail,
                ScreenName.HreCandidateInformation
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Rec_CandidateProfile/New_GetCandidateProfileApproveByFilterHandle',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HrePendingProcessingCandidateApplications],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreProcessingCandidateApplicationsViewDetail],
                    valueField = [
                        'ID', 'Percent', 'CodeCandidate', 'CandidateName', 'Mobile', 'CompanyName', 'SalaryLast', 'JobVacancyName', 'SourceAds', 'DateOfBirth', 'GenderView', 'Email', 'PositionLast', 'DateApply', 'WorkPlaceName', 'Age', 'Experience', 'FileAttachment', 'StatusView', 'TagID', 'TagName'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail)
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region [module/humanResourceV3/hreRecruitment/hreApproveRecruitmentProposal]
const handleGetDataApproveRecruitmentProposal = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HrePendingApproveRecruitmentProposal,
                ScreenName.HreProcesedApproveRecruitmentProposal,
                ScreenName.HreApproveRecruitmentProposalViewDetail
            ],
            getDataList: (dataBody, payload) => {
                console.log(dataBody, 'dataBody');

                return HttpService.Post(
                    '[URI_CENTER]/api/Rec_RecruitmentFlyer/GetCandidateRecruitmentFlyerApproveGrid',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HrePendingApproveRecruitmentProposal],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreApproveRecruitmentProposalViewDetail],
                    valueField = [
                        'ID', 'CodeCandidate', 'CandidateName', 'StatusView', 'Phone', 'PositionName', 'ProbationDate', 'FileAttachment'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail)
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region [module/humanResourceV3/hreRecruitment/HreCandidateProfile]
const handleGetDataCandidateProfile = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreCandidateProfile,
                ScreenName.HreCandidateProfileViewDetail
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Rec_CandidateProfile/New_GetCandidateProfileByFilterHandle',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.AttSubmitTakeBusinessTrip],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreProcessingCandidateApplicationsViewDetail],
                    valueField = [
                        'ID', 'Percent', 'CodeCandidate', 'CandidateName', 'Mobile', 'CompanyName', 'SalaryLast', 'JobVacancyName', 'SourceAds', 'DateOfBirth', 'GenderView', 'Email', 'PositionLast', 'DateApply', 'WorkPlaceName', 'Age', 'Experience', 'FileAttachment', 'StatusView'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail)
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region [module/HumanResourceV3/RecruitmentProposalProcessing]
const handleGetDataRecruitmentProposalProcessing = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreWaitRecruitmentProposalProcessing,
                ScreenName.HreDoneRecruitmentProposalProcessing,
                ScreenName.HreRecruitmentProposalProcessingViewDetail
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Rec_RequirementRecruitmentNew/New_GetRequirementRecruitmentApprove',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreWaitRecruitmentProposalProcessing],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreRecruitmentProposalProcessing],
                    valueField = [
                        'ID',
                        'RequirementRecruitmentName',
                        'UserSubmitName',
                        'DateRequest',
                        'TotalJobvacancy',
                        'TotalQuantity',
                        'JobvacancyItems',
                        'StatusView',
                        'CompanyName',
                        'OrgStructureName',
                        'RecruitmentReasonView'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                configDetail.forEach(item => {
                    if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                        valueField.push(item.Name);
                    }
                });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region [module/attV3/AttLeaveDayReplacement]
const handleGetDataWaitConfirmAttLeaveDayReplacement = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.AttWaitConfirmLeaveDayReplacement,
                ScreenName.AttConfirmedLeaveDayReplacement,
                ScreenName.AttLeaveDayReplacementViewDetail
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Att_LeaveDay/GetListDayOffToNeedReplacement',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.AttSubmitTakeLeaveDay],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.AttSubmitTakeLeaveDay],
                    valueField = [
                        'ID',
                        'RequirementRecruitmentName',
                        'UserSubmitName',
                        'DateRequest',
                        'TotalJobvacancy',
                        'TotalQuantity',
                        'JobvacancyItems',
                        'StatusView',
                        'CompanyName'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                configDetail.forEach(item => {
                    if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                        valueField.push(item.Name);
                    }
                });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

const handleGetDataConfirmedAttLeaveDayReplacement = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.AttWaitConfirmLeaveDayReplacement,
                ScreenName.AttConfirmedLeaveDayReplacement,
                ScreenName.AttLeaveDayReplacementViewDetail
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]api/Att_LeaveDay/GetListConfirmReplacement',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.AttSubmitTakeBusinessTrip],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.AttSubmitTakeBusinessTrip],
                    valueField = [
                        'ID',
                        'RequirementRecruitmentName',
                        'UserSubmitName',
                        'DateRequest',
                        'TotalJobvacancy',
                        'TotalQuantity',
                        'JobvacancyItems',
                        'StatusView',
                        'CompanyName'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                configDetail.forEach(item => {
                    if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                        valueField.push(item.Name);
                    }
                });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region [module/humanResourceV3/hreRecruitment/hreReceiveJob]
const handleGetDataReceiveJob = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreWaitingReceiveJob,
                ScreenName.HreRefuseReceiveJob,
                ScreenName.HreReceiveJobViewDetail
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Rec_CandidateProfile/New_GetCandidateProfileWaitingHireByFilterHandle',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreWaitingReceiveJob],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreReceiveJobViewDetail],
                    valueField = [
                        'ID', 'CandidateName', 'StatusView', 'Mobile', 'Email', 'RecruitmentPositionName', 'DomainName', 'RecruitmentCompanyName', 'ProbationDay', 'NumberProbationDay', 'SalaryView', 'ProgressTask'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail)
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region [module/HumanResourceV3/ProcessingPostingPlan]
const handleGetDataProcessingPostingPlan = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreWaitProcessingPostingPlan,
                ScreenName.HreDoneProcessingPostingPlan,
                ScreenName.HreProcessingPostingPlanViewDetail
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Rec_JobPostingPlan/GetJobPostingPlanProcess',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreWaitProcessingPostingPlan],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreProcessingPostingPlan],
                    valueField = [
                        'ID',
                        'RequirementRecruitmentName',
                        'UserSubmitName',
                        'DateRequest',
                        'TotalJobvacancy',
                        'TotalQuantity',
                        'JobvacancyItems',
                        'StatusView',
                        'CompanyName',
                        'OrgStructureName',
                        'RecruitmentReasonView'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                configDetail.forEach(item => {
                    if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                        valueField.push(item.Name);
                    }
                });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region [module/attendanceV3/hreRecruitment/hreApproveRecruitmentProposal]
const handleGetDataJobPosting = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.HreInProcessJobPosting,
                ScreenName.HreStopJobPosting,
                ScreenName.HreOutDateJobPosting,
                ScreenName.HreJobPostingViewDetail
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Rec_ComposePostingDetail/GetComposePostingDetailByFilterHandle',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.HreInProcessJobPosting],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.HreJobPostingViewDetail],
                    valueField = [
                        'ID', 'CodeCandidate', 'CandidateName', 'StatusView', 'Phone', 'PositionName', 'ProbationDate', 'FileAttachment'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail)
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region [module/humanResourceV3/attDelegationApproval]
const handleGetDataDelegationApproval = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.AttSubmitDelegationApproval,
                ScreenName.AttWaitConfirmSubmitDelegationApproval,
                ScreenName.AttRejectSubmitDelegationApproval,
                ScreenName.AttConfirmedSubmitDelegationApproval,
                ScreenName.AttCanceledSubmitDelegationApproval,
                ScreenName.AttSubmitDelegationApprovalViewDetail
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_HR]/Att_GetData/New_GetDelegateApproveList',
                    {
                        ...dataBody,
                        UserID: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.userid : null,
                        UserSubmit: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.userid : null
                    },
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.AttSubmitDelegationApproval],
                    orderBy = _configList[EnumName.E_Order],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.AttSubmitDelegationApprovalViewDetail],
                    valueField = [
                        'ID', 'CodeCandidate', 'CandidateName', 'StatusView', 'Phone', 'PositionName', 'ProbationDate', 'FileAttachment'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail)
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    IsPortalNew: true,
                    sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};
//#endregion

const handleGetDataConfirmDelegationApproval = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.AttCanceledDelegationApproval,
                ScreenName.AttRejectDelegationApproval,
                ScreenName.AttConfirmedDelegationApproval,
                ScreenName.AttConfirmDelegationApprovalViewDetail,
                ScreenName.AttConfirmDelegationApproval
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_HR]/Sys_GetData/GetSysDelegateApproveConfirmationApproved',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.AttApproveTakeDailyTask],
                    filter = _configList[EnumName.E_Filter],
                    configDetail = ConfigListDetail.value[ScreenName.AttApproveTakeDailyTask],
                    valueField = [
                        'ID',
                        'ImagePath',
                        'PositionName',
                        'Status',
                        'Note',
                        'RequestCancelStatus',
                        'itemStatusCancel',
                        'itemStatus',
                        'StatusView',
                        'WarningViolation',
                        'DateCreate',
                        'DateApprove',
                        'ApprovalDate',
                        'DateUpdate',
                        'DateReject',
                        'DateCancel',
                        'UserDelegateName',
                        'DataTypeDelegateView',
                        'DateFrom',
                        'DateTo',
                        'UserName'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                configDetail.forEach(item => {
                    if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                        valueField.push(item.Name);
                    }
                });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(','),
                    UserSubmit: dataVnrStorage.currentUser?.info?.ProfileID,
                    UserID: dataVnrStorage.currentUser?.headers?.userid
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

//#region [module/AttendanceV3/LeaveFundManageDetail]
const handleGetDataLeaveFundSeniorBonusViewDetail = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.AttLeaveFundSeniorBonusViewDetail,
                ScreenName.AttLeaveFundCompensatoryViewDetail,
                ScreenName.AttLeaveFundManagement
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Att_LeaveDay/GetSeniorBonusDetail',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.AttLeaveFundSeniorBonusViewDetail],
                    orderBy = _configList[EnumName.E_Order] ?? [],
                    filter = _configList[EnumName.E_Filter] ?? [],
                    configDetail = ConfigListDetail.value[ScreenName.AttLeaveFundSeniorBonusViewDetail] ?? [],
                    valueField = [
                        'ID', 'SeniorityYears', 'Remain', 'Used', 'AnlLeaveDays', 'DateReceived', 'ExpiryDate', 'SeniorityDate'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail)
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    IsPortalNew: true,
                    sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};
//#endregion

const handleGetDataLeaveFundCompensatoryViewDetail = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.AttLeaveFundSeniorBonusViewDetail,
                ScreenName.AttLeaveFundCompensatoryViewDetail,
                ScreenName.AttLeaveFundManagement
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Att_LeaveDay/GetConpensationDetailGrid',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.AttLeaveFundCompensatoryViewDetail],
                    orderBy = _configList[EnumName.E_Order] ?? [],
                    filter = _configList[EnumName.E_Filter] ?? [],
                    configDetail = ConfigListDetail.value[ScreenName.AttLeaveFundCompensatoryViewDetail] ?? [],
                    valueField = [
                        'ID', 'WorkDateRoot', 'DateApprove', 'ApproveHours', 'CompLeaveHours', 'RemainCompLeaveHours', 'DateExpired'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                if (configDetail)
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                let _params = {
                    IsPortalNew: true,
                    sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

//#region [module/attV3/AttConfirmShiftChange]
const handleGetDataConfirmAttConfirmShiftChange = ({ keyTask, payload }) => {
    try {
        const api = {
            taskNameScreen: [
                ScreenName.AttWaitConfirmShiftChange,
                ScreenName.AttConfirmedShiftChange,
                ScreenName.AttRejectedShiftChange,
                ScreenName.AttConfirmShiftChangeViewDetail
            ],
            getDataList: (dataBody, payload) => {
                return HttpService.Post(
                    '[URI_CENTER]/api/Att_Roster/GetRosterConfirm',
                    dataBody,
                    null,
                    payload.reload ? payload.reload : null
                );
            },
            getParamsDefault: () => {
                const _configList = ConfigList.value[ScreenName.AttSubmitShiftChange],
                    filter = _configList[EnumName.E_Filter] ?? [],
                    configDetail = ConfigListDetail.value[ScreenName.AttSubmitShiftChange],
                    valueField = [
                        'ID',
                        'Status',
                        'ProfileName',
                        'ProfileName2',
                        'StrChangeDate',
                        'AlternateDate',
                        'RegisterHours',
                        'ChangeShiftTypeView',
                        'MonShiftName_Old',
                        'TueShiftName_Old',
                        'WedShiftName_Old',
                        'ThuShiftName_Old',
                        'FriShiftName_Old',
                        'SatShiftName_Old',
                        'SunShiftName_Old',
                        'MonShiftName',
                        'TueShiftName',
                        'WedShiftName',
                        'ThuShiftName',
                        'FriShiftName',
                        'SatShiftName',
                        'SunShiftName',
                        'WorkDateRoot',
                        'CurrentApprover',
                        'OutTime',
                        'Comment',
                        'StatusView'
                    ];

                // Lấy đúng fields trong màn hình chi tiết.
                configDetail.forEach(item => {
                    if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                        valueField.push(item.Name);
                    }
                });

                let _params = {
                    IsPortalNew: true,
                    // sort: orderBy,
                    filter: filter,
                    page: 1,
                    pageSize: 20,
                    take: 20,
                    skip: 0,
                    group: [],
                    dataSourceRequestString: 'page=1&pageSize=20',
                    ValueFields: valueField.join(',')
                };
                return _params;
            }
        };
        handleDataListModuleCommon(api, keyTask, payload);
    } catch (error) {
        console.log(error);
    }
};

export default {
    // V3
    //#region [module/compliment]
    [EnumTask.KT_HistoryOfComComplimented]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.HistoryOfComComplimented],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Com_GetData/GetComplimentHistoryPraised',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.HistoryOfComComplimented],
                        filter = _configList[EnumName.E_Filter];

                    let _params = {
                        IsPortalNew: true,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ValueFields: 'id,ProfileName,CriteriaName,RecordDate,Point,Note'
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },

    [EnumTask.KT_HistoryOfComComplimenting]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.HistoryOfComComplimenting],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Com_GetData/GetComplimentHistoryPraisedBy',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.HistoryOfComComplimenting],
                        filter = _configList[EnumName.E_Filter];

                    let _params = {
                        IsPortalNew: true,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ValueFields: 'id,ProfileName,CriteriaName,RecordDate,Point,Note'
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_HistoryConversion]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.HistoryConversion],
                getDataList: (dataBody, payload) => {
                    console.log(dataBody, 'dataBody');
                    return HttpService.Post(
                        '[URI_HR]/Com_GetData/GetComplimentHistoryExchange',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.HistoryConversion],
                        filter = _configList[EnumName.E_Filter];

                    let _params = {
                        IsPortalNew: true,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ValueFields: 'id,ProfileName,CriteriaName,RecordDate,Point,Note'
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },

    [EnumTask.KT_RankingPersonal]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.RankingPersonal],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Com_GetData/GetComplimentRankIndividual',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.RankingPersonal],
                        filter = _configList[EnumName.E_Filter];

                    let _params = {
                        IsPortalNew: true,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ValueFields: 'id,ProfileName,CriteriaName,RecordDate,Point,Note'
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_RankingPeopleGiving]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.RankingPeopleGiving],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Com_GetData/GetComplimentRankPraiser',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.RankingPeopleGiving],
                        filter = _configList[EnumName.E_Filter];

                    let _params = {
                        IsPortalNew: true,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ValueFields: 'id,ProfileName,CriteriaName,RecordDate,Point,Note'
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_RankingDepartment]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.RankingDepartment],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Com_GetData/GetComplimentRankDepartment',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.RankingDepartment],
                        filter = _configList[EnumName.E_Filter];

                    let _params = {
                        IsPortalNew: true,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ValueFields: 'id,ProfileName,CriteriaName,RecordDate,Point,Note'
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_RankingCriteria]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.RankingCriteria],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Com_GetData/GetComplimentRankCriteria',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.RankingCriteria],
                        filter = _configList[EnumName.E_Filter];

                    let _params = {
                        IsPortalNew: true,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ValueFields: 'id,ProfileName,CriteriaName,RecordDate,Point,Note'
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    // V3
    //#region [module/attendance/attSubmitWorkingOvertime]
    // màn hình đăng ký kế hoạch tăng ca
    [EnumTask.KT_AttSubmitWorkingOvertime]: async ({ keyTask, payload }) => {
        handleGetDataSubmitWorkingOvertime({ keyTask, payload });
    },
    [EnumTask.KT_AttSaveTempSubmitWorkingOvertime]: async ({ keyTask, payload }) => {
        handleGetDataSubmitWorkingOvertime({ keyTask, payload });
    },
    [EnumTask.KT_AttCanceledSubmitWorkingOvertime]: async ({ keyTask, payload }) => {
        handleGetDataSubmitWorkingOvertime({ keyTask, payload });
    },
    [EnumTask.KT_AttApproveSubmitWorkingOvertime]: async ({ keyTask, payload }) => {
        handleGetDataSubmitWorkingOvertime({ keyTask, payload });
    },
    [EnumTask.KT_AttApprovedSubmitWorkingOvertime]: async ({ keyTask, payload }) => {
        handleGetDataSubmitWorkingOvertime({ keyTask, payload });
    },
    [EnumTask.KT_AttConfirmedSubmitWorkingOvertime]: async ({ keyTask, payload }) => {
        handleGetDataSubmitWorkingOvertime({ keyTask, payload });
    },
    [EnumTask.KT_AttRejectSubmitWorkingOvertime]: async ({ keyTask, payload }) => {
        handleGetDataSubmitWorkingOvertime({ keyTask, payload });
    },

    // mành hình duyệt kế hoạch tăng ca
    [EnumTask.KT_AttApproveWorkingOvertime]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApproveWorkingOvertime,
                    ScreenName.AttApproveWorkingOvertimeViewDetail,
                    ScreenName.AttApprovedWorkingOvertime
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_CENTER]/api/Att_OvertimePlan/New_PlanOvertimeApproveByFilterHandle_App',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveWorkingOvertime],
                        filter = _configList[EnumName.E_Filter],
                        configDetail = ConfigListDetail.value[ScreenName.AttApproveWorkingOvertime],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'Status',
                            'ApproveHours',
                            'RegisterHours',
                            'ConfirmHours',
                            'WorkDateRoot',
                            'InTime',
                            'OutTime',
                            'Rate',
                            'RequestCancelStatus',
                            'itemStatusCancel',
                            'itemStatus',
                            'StatusView',
                            'WarningViolation',
                            'ReasonOT',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel',
                            'ProfileName'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortalNew: true,
                        // sort: orderBy,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedWorkingOvertime]: async ({ keyTask, payload }) => {
        handleGetDataApproveWorkingOvertime({ keyTask, payload });
    },
    [EnumTask.KT_AttRejectWorkingOvertime]: async ({ keyTask, payload }) => {
        handleGetDataApproveWorkingOvertime({ keyTask, payload });
    },
    [EnumTask.KT_AttCanceledWorkingOvertime]: async ({ keyTask, payload }) => {
        handleGetDataApproveWorkingOvertime({ keyTask, payload });
    },
    [EnumTask.KT_AttAllWorkingOvertime]: ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttAllWorkingOvertime,
                    ScreenName.AttApproveWorkingOvertimeViewDetail,
                    ScreenName.AttApproveWorkingOvertime
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_CENTER]/api/Att_OvertimePlan/New_PlanOvertimeApproveAndAfterBrowsing_App',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveWorkingOvertime],
                        filter = _configList[EnumName.E_Filter],
                        configDetail = ConfigListDetail.value[ScreenName.AttApproveWorkingOvertime],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'Status',
                            'ApproveHours',
                            'RegisterHours',
                            'ConfirmHours',
                            'WorkDateRoot',
                            'InTime',
                            'OutTime',
                            'Rate',
                            'RequestCancelStatus',
                            'itemStatusCancel',
                            'itemStatus',
                            'StatusView',
                            'WarningViolation',
                            'ReasonOT',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel',
                            'ProfileName'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortalNew: true,
                        // sort: orderBy,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/attendanceV3/attTakeLateEarlyAllowed]
    [EnumTask.KT_AttSubmitTakeLateEarlyAllowed]: async ({ keyTask, payload }) => {
        handleGetDataSubmitTakeLateEarlyAllowed({ keyTask, payload });
    },
    [EnumTask.KT_AttSaveTempSubmitTakeLateEarlyAllowed]: async ({ keyTask, payload }) => {
        handleGetDataSubmitTakeLateEarlyAllowed({ keyTask, payload });
    },
    [EnumTask.KT_AttApproveSubmitTakeLateEarlyAllowed]: async ({ keyTask, payload }) => {
        handleGetDataSubmitTakeLateEarlyAllowed({ keyTask, payload });
    },
    [EnumTask.KT_AttApprovedSubmitTakeLateEarlyAllowed]: async ({ keyTask, payload }) => {
        handleGetDataSubmitTakeLateEarlyAllowed({ keyTask, payload });
    },
    [EnumTask.KT_AttRejectSubmitTakeLateEarlyAllowed]: async ({ keyTask, payload }) => {
        handleGetDataSubmitTakeLateEarlyAllowed({ keyTask, payload });
    },
    [EnumTask.KT_AttCanceledSubmitTakeLateEarlyAllowed]: async ({ keyTask, payload }) => {
        handleGetDataSubmitTakeLateEarlyAllowed({ keyTask, payload });
    },

    // mành hình duyệt trễ sớm
    [EnumTask.KT_AttApproveTakeLateEarlyAllowed]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApproveTakeLateEarlyAllowed,
                    ScreenName.AttApproveTakeLateEarlyAllowedViewDetail,
                    ScreenName.AttApprovedTakeLateEarlyAllowed
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_CENTER]/api/Att_LateEarlyAllowed/GetLateEarlyAllowedApproveByFilterHandle_App',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveTakeLateEarlyAllowed],
                        filter = _configList[EnumName.E_Filter],
                        configDetail = ConfigListDetail.value[ScreenName.AttApproveTakeLateEarlyAllowed],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'Status',
                            'ApproveHours',
                            'RegisterHours',
                            'ConfirmHours',
                            'WorkDateRoot',
                            'InTime',
                            'OutTime',
                            'Rate',
                            'RequestCancelStatus',
                            'itemStatusCancel',
                            'itemStatus',
                            'StatusView',
                            'WarningViolation',
                            'ReasonOT',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel',
                            'ProfileName'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortalNew: true,
                        // sort: orderBy,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedTakeLateEarlyAllowed]: async ({ keyTask, payload }) => {
        handleGetDataApproveTakeLateEarlyAllowed({ keyTask, payload });
    },
    [EnumTask.KT_AttRejectTakeLateEarlyAllowed]: async ({ keyTask, payload }) => {
        handleGetDataApproveTakeLateEarlyAllowed({ keyTask, payload });
    },
    [EnumTask.KT_AttCanceledTakeLateEarlyAllowed]: async ({ keyTask, payload }) => {
        handleGetDataApproveTakeLateEarlyAllowed({ keyTask, payload });
    },
    [EnumTask.KT_AttAllTakeLateEarlyAllowed]: ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttAllTakeLateEarlyAllowed,
                    ScreenName.AttApproveTakeLateEarlyAllowedViewDetail,
                    ScreenName.AttApproveTakeLateEarlyAllowed
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_CENTER]/api/Att_LateEarlyAllowed/GetLateEarlyAllowedApproveAndAfterBrowsingByFilterHandle_App',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveTakeLateEarlyAllowed],
                        filter = _configList[EnumName.E_Filter],
                        configDetail = ConfigListDetail.value[ScreenName.AttApproveTakeLateEarlyAllowed],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'Status',
                            'ApproveHours',
                            'RegisterHours',
                            'ConfirmHours',
                            'WorkDateRoot',
                            'InTime',
                            'OutTime',
                            'Rate',
                            'RequestCancelStatus',
                            'itemStatusCancel',
                            'itemStatus',
                            'StatusView',
                            'WarningViolation',
                            'ReasonOT',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortalNew: true,
                        // sort: orderBy,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    [EnumTask.KT_Permission_RequestDataConfig]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: ScreenName.Permission,
                getDataConfig: (payload) => {
                    let _userLogin = dataVnrStorage.currentUser.headers.userlogin,
                        languageApp = dataVnrStorage.languageApp,
                        _deviceID = dataVnrStorage.deviceID ? dataVnrStorage.deviceID : '';

                    let lstRequest = [],
                        indexConfig = {};

                    if (payload && payload.isGetConfigApp) {
                        indexConfig['E_CONFIG_APP'] = 0;
                        lstRequest.push(HttpService.Get('[URI_POR]/Portal/GetConfigApp'));
                    }

                    if (payload && payload.isGetConfigAppByUser) {
                        indexConfig['E_CONFIG_APP_USER'] = lstRequest.length;
                        lstRequest.push(HttpService.Get(`[URI_POR]/Portal/GetConfigAppByUser?userLogin=${_userLogin}&deviceID=` + _deviceID));
                    }

                    if (payload && payload.isGetLang) {
                        indexConfig['E_CONFIG_LANG'] = lstRequest.length;
                        lstRequest.push(
                            HttpService.Get(`[URI_POR]/Portal/GetLangMobile?langcode=${languageApp}`)
                            // HttpService.Get(`[URI_POR]/Portal/GetLangApp?langCode=${languageApp}`),
                        );
                    }

                    return HttpService.MultiRequest(lstRequest);
                },
                compareReloadDashboard: (oldDash, newDash) => {
                    if (
                        Vnr_Function.compare(oldDash, newDash) === false &&
                        DashboardApi.reloadDashboard &&
                        typeof DashboardApi.reloadDashboard === 'function'
                    ) {
                        DashboardApi.reloadDashboard();
                    }
                },
                compareReloadDrawer: (oldDawer, newDawer) => {
                    if (
                        Vnr_Function.compare(oldDawer, newDawer) === false &&
                        DrawerApi.reloadDrawer &&
                        typeof DrawerApi.reloadDrawer === 'function'
                    ) {
                        DrawerApi.reloadDrawer();
                    }
                }
            };

            // Đã chạy xong. Bắt buộc chờ task chạy xong mới được chạy lại chống sapam
            TaskIsRuning.listTaskRunning[keyTask] = false;

            const dataListLocal = await getDataLocal(keyTask),
                dataLocal = dataListLocal ? dataListLocal[payload.keyQuery] : null;

            // Lay du lieu cho list (server,local)
            const getDataConfig = await api.getDataConfig(payload),
                indexConfig = {};

            let countRequest = 0;
            if (payload && payload.isGetConfigApp) {
                indexConfig['E_CONFIG_APP'] = 0;
                countRequest += 1;
            }
            if (payload && payload.isGetConfigAppByUser) {
                indexConfig['E_CONFIG_APP_USER'] = countRequest;
                countRequest += 1;
            }
            if (payload && payload.isGetLang) {
                indexConfig['E_CONFIG_LANG'] = countRequest;
            }

            if (dataLocal) {
                if (indexConfig['E_CONFIG_LANG'] !== undefined && indexConfig['E_CONFIG_LANG'] < 3) {
                    if (indexConfig['E_CONFIG_LANG'] == 2) {
                        // isGetConfigApp, isGetConfigAppByUser, isGetLang
                    } else if (indexConfig['E_CONFIG_LANG'] == 1) {
                        if (indexConfig['E_CONFIG_APP_USER'] !== undefined && indexConfig['E_CONFIG_APP_USER'] == 0) {
                            // isGetConfigAppByUser, isGetLang
                            getDataConfig.splice(0, 0, dataLocal[0]);
                        } else {
                            // isGetConfigApp, isGetLang
                            getDataConfig.splice(1, 0, dataLocal[1]);
                        }
                    } else if (indexConfig['E_CONFIG_LANG'] == 0) {
                        // isGetLang
                        getDataConfig.splice(0, 0, dataLocal[0]);
                        getDataConfig.splice(1, 0, dataLocal[1]);
                    }
                } else if (indexConfig['E_CONFIG_APP_USER'] !== undefined && indexConfig['E_CONFIG_APP_USER'] < 2) {
                    if (indexConfig['E_CONFIG_APP_USER'] == 1) {
                        // isGetConfigApp, isGetConfigAppByUser
                        getDataConfig[2] = dataLocal[2];
                        // getDataConfig[3] = dataLocal[3];
                    } else if (indexConfig['E_CONFIG_APP_USER'] == 0) {
                        // isGetConfigAppByUser
                        getDataConfig.splice(0, 0, dataLocal[0]);
                        getDataConfig[2] = dataLocal[2];
                        // getDataConfig[3] = dataLocal[3];
                    }
                } else if (indexConfig['E_CONFIG_APP'] !== undefined && indexConfig['E_CONFIG_APP'] == 0) {
                    // isGetConfigApp
                    getDataConfig[1] = dataLocal[1];
                    getDataConfig[2] = dataLocal[2];
                    //getDataConfig[3] = dataLocal[3];
                }
            }

            if (getDataConfig && getDataConfig != null) {
                const resSave = await saveDataLocal(keyTask, {
                    ...{
                        [EnumName.E_PRIMARY_DATA]: getDataConfig
                    }
                });

                if (resSave.actionStatus) {
                    if (api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                        store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                    } else {
                        if (getDataConfig[0]) {
                            let configApp = { ...getDataConfig[0] };
                            let configListDetailRes = JSON.parse(configApp[2]);
                            ConfigList.value = JSON.parse(configApp[0]);
                            ConfigListFilter.value = JSON.parse(configApp[1]);
                            ConfigListDetail.value = configListDetailRes;
                            ConfigListDetail.configAlign = configListDetailRes.StyleLineViewDetail ? configListDetailRes.StyleLineViewDetail : 'E_ALIGN_LAYOUT';
                            ConfigField.value = JSON.parse(configApp[3]);
                            ConfigMappingSalary.value = JSON.parse(configApp[4]);

                            //config chart
                            if (configApp[5]) {
                                ConfigChart.value = JSON.parse(configApp[5]);
                            }
                        }

                        //config lang VN or EN or ... chỉ lấy file lang ngôn ngữ đang dùng
                        if (getDataConfig[2]) {
                            setDataLang(getDataConfig[2], dataVnrStorage.languageApp);
                        }

                        //config navigate
                        if (getDataConfig[1]) {
                            let configAppByUser = { ...getDataConfig[1] };
                            ConfigDashboard.value = configAppByUser[0];
                            ConfigDrawer.value = configAppByUser[1];
                            PermissionForAppMobile.value = configAppByUser[2];
                            if (dataListLocal && dataListLocal[EnumName.E_PRIMARY_DATA]) {
                                const configAppByUserLocal = dataListLocal[EnumName.E_PRIMARY_DATA][1];

                                api.compareReloadDashboard(configAppByUserLocal[0], configAppByUser[0]);
                                api.compareReloadDrawer(configAppByUserLocal[1], configAppByUser[1]);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            //
        }
    },
    [EnumTask.KT_AttCheckInGPS]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.AttCheckInGPS],
                getParamsDefault: () => {
                    return {};
                },
                getDataList: () => {
                    const dataBody = {
                            ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                            timelog: moment().format('YYYY-MM-DD 00:00:00')
                        },
                        dataBodyAllowCheckingByCoordinates = {
                            key: 'HRM_ATT_WORKDAY_SUMMARY_ISALLOWCHECKINGPSBYCOORDINATES'
                        },
                        dataBodyGetConfigPhoto = {
                            key: 'HRM_ATT_WORKDAY_SUMMARY_CONFIGPHOTOGRAPCHECKINGPS'
                        };

                    const listrequest = [
                        HttpService.Get(
                            '[URI_HR]//Att_GetData/GetSettingByKey?Key=HRM_ATT_WORKDAY_SUMMARY_ISVALIDATEENOUGHINOUT'
                        ),
                        HttpService.Post('[URI_HR]/Att_GetData/GetWorkPlaceByProfileID', dataBody),
                        HttpService.Post('[URI_HR]/Por_GetData/GetConfigByKey', dataBodyAllowCheckingByCoordinates),
                        HttpService.Post(
                            '[URI_HR]/Por_GetData/GetConfigByKey',
                            dataBodyGetConfigPhoto
                        )
                        // HttpService.Post(
                        //     '[URI_HR]/Por_GetData/Get_TAMScanLogOrderTimeLogDesc',
                        //     { ProfileID: dataVnrStorage.currentUser.info.ProfileID },
                        // )
                    ];
                    return HttpService.MultiRequest(listrequest);
                }
            };

            if (typeof payload === 'object') payload.dataChange = true;

            const getDataConfigLocal = await getDataLocal(keyTask);
            const getDataServer = await api.getDataList();

            // Đã chạy xong. Bắt buộc chờ task chạy xong mới được chạy lại chống sapam
            TaskIsRuning.listTaskRunning[keyTask] = false;

            if (getDataServer) {
                // reload
                if (
                    getDataConfigLocal !== null &&
                    getDataConfigLocal[EnumName.E_PRIMARY_DATA] !== EnumName.E_EMPTYDATA
                ) {
                    if (payload.isCompare === true) {
                        //So sánh 2 dữ liệu khác nhau thì reload lại danh sách
                        let isEqual = Vnr_Function.compare(
                            [...getDataServer],
                            getDataConfigLocal[EnumName.E_PRIMARY_DATA],
                            value => {
                                return typeof value === 'string' && value.includes('Date') ? false : true;
                            }
                        );

                        // console.log(isEqual, 'isEqual')
                        if (!isEqual) {
                            const resSave = await saveDataLocal(keyTask, {
                                ...getDataConfigLocal,
                                ...{
                                    [EnumName.E_PRIMARY_DATA]: [...getDataServer]
                                }
                            });

                            // sau khi lưu thành công và đang ở màn hình hiện tại thì reload
                            if (
                                resSave.actionStatus &&
                                api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                            ) {
                                store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                            }
                        } else {
                            // bằng flase khi dữ liệu giống nhau
                            payload.dataChange = false;
                            store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                        }
                    } else {
                        const resSave = await saveDataLocal(keyTask, {
                            ...getDataConfigLocal,
                            ...{
                                [EnumName.E_PRIMARY_DATA]: [...getDataServer]
                            }
                        });

                        if (
                            resSave.actionStatus &&
                            api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                        ) {
                            store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                        }
                    }
                } else {
                    // chưa có dữ liệu dưới local thì lưu và reload lại danh sách
                    const resSave = await saveDataLocal(keyTask, {
                        ...getDataLocal,
                        ...{
                            [payload.keyQuery]: [...getDataServer]
                        }
                    });
                    if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                        store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                    }
                }
            } else {
                // khi không có dữ liệu thì lưu là emplty data
                const resSave = await saveDataLocal(keyTask, {
                    ...getDataLocal,
                    ...{
                        [payload.keyQuery]: EnumName.E_EMPTYDATA
                    }
                });
                if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                    store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                }
            }
            // handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttTSLCheckInOutWifi]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.AttTSLCheckInOutWifi],
                getParamsDefault: () => {
                    return {};
                },
                getDataList: () => {
                    const dataBody = {
                        ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                        timelog: moment().format('YYYY-MM-DD 00:00:00')
                    };

                    const listrequest = [
                        HttpService.Post('[URI_HR]/Att_GetData/GetWorkPlaceByProfileID', dataBody)
                        // HttpService.Post(
                        //    '[URI_HR]/Por_GetData/Get_TAMScanLogOrderTimeLogDesc',
                        //    { ProfileID: dataVnrStorage.currentUser.info.ProfileID },
                        // )
                    ];
                    return HttpService.MultiRequest(listrequest);
                }
            };

            if (typeof payload === 'object') payload.dataChange = true;

            const getDataConfigLocal = await getDataLocal(keyTask);
            const getDataServer = await api.getDataList();

            // Đã chạy xong. Bắt buộc chờ task chạy xong mới được chạy lại chống sapam
            TaskIsRuning.listTaskRunning[keyTask] = false;

            if (getDataServer) {
                // reload
                if (
                    getDataConfigLocal !== null &&
                    getDataConfigLocal[EnumName.E_PRIMARY_DATA] !== EnumName.E_EMPTYDATA
                ) {
                    if (payload.isCompare === true) {
                        //So sánh 2 dữ liệu khác nhau thì reload lại danh sách
                        let isEqual = Vnr_Function.compare(
                            [...getDataServer],
                            getDataConfigLocal[EnumName.E_PRIMARY_DATA],
                            value => {
                                return typeof value === 'string' && value.includes('Date') ? false : true;
                            }
                        );

                        // console.log(isEqual, 'isEqual')
                        if (!isEqual) {
                            const resSave = await saveDataLocal(keyTask, {
                                ...getDataConfigLocal,
                                ...{
                                    [EnumName.E_PRIMARY_DATA]: [...getDataServer]
                                }
                            });

                            // sau khi lưu thành công và đang ở màn hình hiện tại thì reload
                            if (
                                resSave.actionStatus &&
                                api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                            ) {
                                store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                            }
                        } else {
                            // bằng flase khi dữ liệu giống nhau
                            payload.dataChange = false;
                            store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                        }
                    } else {
                        const resSave = await saveDataLocal(keyTask, {
                            ...getDataConfigLocal,
                            ...{
                                [EnumName.E_PRIMARY_DATA]: [...getDataServer]
                            }
                        });

                        if (
                            resSave.actionStatus &&
                            api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                        ) {
                            store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                        }
                    }
                } else {
                    // chưa có dữ liệu dưới local thì lưu và reload lại danh sách
                    const resSave = await saveDataLocal(keyTask, {
                        ...getDataLocal,
                        ...{
                            [payload.keyQuery]: getDataServer
                        }
                    });
                    if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                        store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                    }
                }
            } else {
                // khi không có dữ liệu thì lưu là emplty data
                const resSave = await saveDataLocal(keyTask, {
                    ...getDataLocal,
                    ...{
                        [payload.keyQuery]: EnumName.E_EMPTYDATA
                    }
                });
                if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                    store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                }
            }
            // handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttTSLCheckInOutNFC]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.AttTSLCheckInOutNFC, ScreenName.AttCheckInGPS],
                getParamsDefault: () => {
                    return {};
                },
                getDataList: () => {
                    const dataBody = {
                        ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                        timelog: moment().format('YYYY-MM-DD 00:00:00')
                    };

                    const listrequest = [
                        HttpService.Post('[URI_HR]/Att_GetData/GetWorkPlaceByProfileID', dataBody),
                        HttpService.Post('[URI_HR]/Por_GetData/Get_TAMScanLogOrderTimeLogDesc', {
                            ProfileID: dataVnrStorage.currentUser.info.ProfileID
                        })
                    ];
                    return HttpService.MultiRequest(listrequest);
                }
            };

            if (typeof payload === 'object') payload.dataChange = true;

            const getDataConfigLocal = await getDataLocal(keyTask);
            const getDataServer = await api.getDataList();

            // Đã chạy xong. Bắt buộc chờ task chạy xong mới được chạy lại chống sapam
            TaskIsRuning.listTaskRunning[keyTask] = false;

            if (getDataServer) {
                // reload
                if (
                    getDataConfigLocal !== null &&
                    getDataConfigLocal[EnumName.E_PRIMARY_DATA] !== EnumName.E_EMPTYDATA
                ) {
                    if (payload.isCompare === true) {
                        //So sánh 2 dữ liệu khác nhau thì reload lại danh sách
                        let isEqual = Vnr_Function.compare(
                            [...getDataServer],
                            getDataConfigLocal[EnumName.E_PRIMARY_DATA],
                            value => {
                                return typeof value === 'string' && value.includes('Date') ? false : true;
                            }
                        );

                        // console.log(isEqual, 'isEqual')
                        if (!isEqual) {
                            const resSave = await saveDataLocal(keyTask, {
                                ...getDataConfigLocal,
                                ...{
                                    [EnumName.E_PRIMARY_DATA]: [...getDataServer]
                                }
                            });

                            // sau khi lưu thành công và đang ở màn hình hiện tại thì reload
                            if (
                                resSave.actionStatus &&
                                api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                            ) {
                                store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                            }
                        } else {
                            // bằng flase khi dữ liệu giống nhau
                            payload.dataChange = false;
                            store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                        }
                    } else {
                        const resSave = await saveDataLocal(keyTask, {
                            ...getDataConfigLocal,
                            ...{
                                [EnumName.E_PRIMARY_DATA]: [...getDataServer]
                            }
                        });

                        if (
                            resSave.actionStatus &&
                            api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                        ) {
                            store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                        }
                    }
                } else {
                    // chưa có dữ liệu dưới local thì lưu và reload lại danh sách
                    const resSave = await saveDataLocal(keyTask, {
                        ...getDataLocal,
                        ...{
                            [payload.keyQuery]: getDataServer
                        }
                    });
                    if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                        store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                    }
                }
            } else {
                // khi không có dữ liệu thì lưu là emplty data
                const resSave = await saveDataLocal(keyTask, {
                    ...getDataLocal,
                    ...{
                        [payload.keyQuery]: EnumName.E_EMPTYDATA
                    }
                });
                if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                    store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                }
            }
            // handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttCheckInGPS_AVN]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.AttCheckInGPS],
                getParamsDefault: () => {
                    return {};
                },
                getDataList: () => {
                    const dataBody = {
                        ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                        timelog: moment().format('YYYY-MM-DD 00:00:00')
                    };
                    // return HttpService.Post(
                    //    '[URI_HR]/Att_GetData/GetWorkPlaceByProfileID',
                    //    dataBody,
                    // )
                    const listrequest = [
                        // HttpService.Get(
                        //    '[URI_HR]//Att_GetData/GetSettingByKey?Key=HRM_ATT_WORKDAY_SUMMARY_ISVALIDATEENOUGHINOUT',
                        // ),
                        HttpService.Post('[URI_HR]/Att_GetData/GetWorkPlaceByProfileID', dataBody)
                        // HttpService.Post(
                        //    '[URI_HR]/Por_GetData/GetConfigByKey',
                        //    dataBodyAllowCheckingByMAC,
                        // ),
                    ];
                    return HttpService.MultiRequest(listrequest);
                }
            };

            if (typeof payload === 'object') payload.dataChange = true;

            const getDataConfigLocal = await getDataLocal(keyTask);
            const getDataServer = await api.getDataList();

            // Đã chạy xong. Bắt buộc chờ task chạy xong mới được chạy lại chống sapam
            TaskIsRuning.listTaskRunning[keyTask] = false;

            if (getDataServer) {
                // reload
                if (
                    getDataConfigLocal !== null &&
                    getDataConfigLocal[EnumName.E_PRIMARY_DATA] !== EnumName.E_EMPTYDATA
                ) {
                    if (payload.isCompare === true) {
                        //So sánh 2 dữ liệu khác nhau thì reload lại danh sách
                        let isEqual = Vnr_Function.compare(
                            [...getDataServer],
                            getDataConfigLocal[EnumName.E_PRIMARY_DATA],
                            value => {
                                return typeof value === 'string' && value.includes('Date') ? false : true;
                            }
                        );

                        // console.log(isEqual, 'isEqual')
                        if (!isEqual) {
                            const resSave = await saveDataLocal(keyTask, {
                                ...getDataConfigLocal,
                                ...{
                                    [EnumName.E_PRIMARY_DATA]: [...getDataServer]
                                }
                            });

                            // sau khi lưu thành công và đang ở màn hình hiện tại thì reload
                            if (
                                resSave.actionStatus &&
                                api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                            ) {
                                store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                            }
                        } else {
                            // bằng flase khi dữ liệu giống nhau
                            payload.dataChange = false;
                            store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                        }
                    } else {
                        const resSave = await saveDataLocal(keyTask, {
                            ...getDataConfigLocal,
                            ...{
                                [EnumName.E_PRIMARY_DATA]: [...getDataServer]
                            }
                        });

                        if (
                            resSave.actionStatus &&
                            api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                        ) {
                            store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                        }
                    }
                } else {
                    // chưa có dữ liệu dưới local thì lưu và reload lại danh sách
                    const resSave = await saveDataLocal(keyTask, {
                        ...getDataLocal,
                        ...{
                            [payload.keyQuery]: getDataServer
                        }
                    });
                    if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                        store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                    }
                }
            } else {
                // khi không có dữ liệu thì lưu là emplty data
                const resSave = await saveDataLocal(keyTask, {
                    ...getDataLocal,
                    ...{
                        [payload.keyQuery]: EnumName.E_EMPTYDATA
                    }
                });
                if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                    store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                }
            }
            // handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_Workday]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.WorkDay, ScreenName.WorkDayV2, 'Home'],
                getCutOffDurationByMonthYear: (_Month, _Year) => {
                    const dataBody = {
                        Month: _Month,
                        Year: _Year
                    };
                    return HttpService.Post('[URI_HR]/Att_GetData/GetCutOffDurationByMonthYear', dataBody);
                },
                getDataWorkDay: cutOffDurationByMonthYear => {
                    const dataBody = {
                        ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                        CutOffDurationID: cutOffDurationByMonthYear
                    };

                    return HttpService.Post('[URI_HR]/Att_GetData/GetDataWorkdayPortalNewApp', dataBody);
                }
            };

            // Đã chạy xong. Bắt buộc chờ task chạy xong mới được chạy lại chống sapam
            TaskIsRuning.listTaskRunning[keyTask] = false;

            if (typeof payload === 'object') payload.dataChange = true;

            const date = new Date(),
                currentMonth = payload && payload.Month ? payload.Month : parseInt(moment(date).format('MM')),
                currentYear = payload && payload.Month ? payload.Year : parseInt(moment(date).format('YYYY'));

            const getDataWorkDayLocal = await getDataLocal(keyTask);
            // không có internet
            if (HttpService.checkConnectInternet() === false) {
                if (getDataWorkDayLocal != null && getDataWorkDayLocal[payload.keyQuery] != null) {
                    if (api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                        store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                    }
                } else {
                    const resSave = await saveDataLocal(keyTask, {
                        ...getDataWorkDayLocal,
                        ...{
                            [payload.keyQuery]: EnumName.E_EMPTYDATA
                        }
                    });
                    if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                        store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                    }
                }
                return;
            }

            // lay CutOffDurationID
            let getCutOffDuration = null;
            if (payload.CutOffDurationID) {
                // Vào từ Notification
                getCutOffDuration = [
                    {
                        ID: payload.CutOffDurationID
                    }
                ];
            } else {
                getCutOffDuration = await api.getCutOffDurationByMonthYear(currentMonth, currentYear);
            }

            if (getCutOffDuration && getCutOffDuration[0] && getCutOffDuration[0].ID) {
                let cutOffDurationByMonthYear = getCutOffDuration[0].ID;
                // Lay du lieu cho list (server,local)
                const getDataWorkDay = await api.getDataWorkDay(cutOffDurationByMonthYear);

                if (getDataWorkDay) {
                    //Filter
                    if (payload && payload.keyQuery === EnumName.E_FILTER) {
                        const resSave = await saveDataLocal(keyTask, {
                            ...getDataWorkDayLocal,
                            ...{
                                [EnumName.E_FILTER]: getDataWorkDay
                            }
                        });
                        if (
                            resSave.actionStatus &&
                            api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                        ) {
                            store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                        }
                    }
                    // reload
                    else if (
                        getDataWorkDayLocal !== null &&
                        getDataWorkDayLocal[EnumName.E_PRIMARY_DATA] !== EnumName.E_EMPTYDATA
                    ) {
                        if (payload.isCompare === true) {
                            //So sánh 2 dữ liệu khác nhau thì reload lại danh sách
                            let isEqual = Vnr_Function.compare(
                                getDataWorkDay,
                                getDataWorkDayLocal[EnumName.E_PRIMARY_DATA],
                                value => {
                                    return value.TitleWeek != null ? false : true;
                                }
                            );

                            if (!isEqual) {
                                const resSave = await saveDataLocal(keyTask, {
                                    ...getDataWorkDayLocal,
                                    ...{
                                        [EnumName.E_PRIMARY_DATA]: getDataWorkDay
                                    }
                                });

                                // sau khi lưu thành công và đang ở màn hình hiện tại thì reload
                                if (
                                    resSave.actionStatus &&
                                    api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                                ) {
                                    store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                                }
                            } else {
                                // bằng flase khi dữ liệu giống nhau
                                payload.dataChange = false;
                                store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                            }
                        } else {
                            const resSave = await saveDataLocal(keyTask, {
                                ...getDataWorkDayLocal,
                                ...{
                                    [EnumName.E_PRIMARY_DATA]: getDataWorkDay
                                }
                            });

                            if (
                                resSave.actionStatus &&
                                api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                            ) {
                                store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                            }
                            // payload.dataChange = true;
                            // store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                        }
                    } else {
                        // chưa có dữ liệu dưới local thì lưu và reload lại danh sách
                        const resSave = await saveDataLocal(keyTask, {
                            ...getDataWorkDayLocal,
                            ...{
                                [payload.keyQuery]: getDataWorkDay
                            }
                        });
                        if (
                            resSave.actionStatus &&
                            api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                        ) {
                            store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                        }
                    }
                } else {
                    // khi không có dữ liệu thì lưu là emplty data
                    const resSave = await saveDataLocal(keyTask, {
                        ...getDataWorkDayLocal,
                        ...{
                            [payload.keyQuery]: EnumName.E_EMPTYDATA
                        }
                    });
                    if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                        store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                    }
                }
            } else if (getCutOffDuration !== undefined) {
                // khi không có dữ liệu thì lưu là emplty data
                const resSave = await saveDataLocal(keyTask, {
                    ...getDataWorkDayLocal,
                    ...{
                        [payload.keyQuery]: EnumName.E_EMPTYDATA
                    }
                });
                if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                    store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttWorkDayCalendar]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.AttWorkDayCalendar, ScreenName.WorkDay],
                getDataWorkDay: cutOffDurationByMonthYear => {
                    const dataBody = {
                        ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                        CutOffDurationID: cutOffDurationByMonthYear
                    };

                    return HttpService.Post('[URI_CENTER]/api/Att_Workday/GetListDataWorkdayForProfile', dataBody);
                }
            };

            // Đã chạy xong. Bắt buộc chờ task chạy xong mới được chạy lại chống sapam
            TaskIsRuning.listTaskRunning[keyTask] = false;
            if (typeof payload === 'object') payload.dataChange = true;

            const getDataWorkDayLocal = await getDataLocal(keyTask);
            // không có internet
            if (HttpService.checkConnectInternet() === false) {
                if (getDataWorkDayLocal != null && getDataWorkDayLocal[payload.keyQuery] != null) {
                    if (api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                        store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                    }
                } else {
                    const resSave = await saveDataLocal(keyTask, {
                        ...getDataWorkDayLocal,
                        ...{
                            [payload.keyQuery]: EnumName.E_EMPTYDATA
                        }
                    });
                    if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                        store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                    }
                }
                return;
            }

            // lay CutOffDurationID
            let getCutOffDuration = payload.CutOffDurationID;
            if (getCutOffDuration) {
                // Lay du lieu cho list (server,local)
                const getDataWorkDay = await api.getDataWorkDay(getCutOffDuration);

                if (getDataWorkDay) {
                    //Filter
                    if (payload && payload.keyQuery === EnumName.E_FILTER) {
                        const resSave = await saveDataLocal(keyTask, {
                            ...getDataWorkDayLocal,
                            ...{
                                [EnumName.E_FILTER]: getDataWorkDay
                            }
                        });
                        if (
                            resSave.actionStatus &&
                            api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                        ) {
                            store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                        }
                    }
                    // reload
                    else if (
                        getDataWorkDayLocal !== null &&
                        getDataWorkDayLocal[EnumName.E_PRIMARY_DATA] !== EnumName.E_EMPTYDATA
                    ) {
                        if (payload.isCompare === true) {
                            //So sánh 2 dữ liệu khác nhau thì reload lại danh sách
                            let isEqual = Vnr_Function.compare(
                                getDataWorkDay,
                                getDataWorkDayLocal[EnumName.E_PRIMARY_DATA],
                                value => {
                                    return value.TitleWeek != null ? false : true;
                                }
                            );

                            if (!isEqual) {
                                const resSave = await saveDataLocal(keyTask, {
                                    ...getDataWorkDayLocal,
                                    ...{
                                        [EnumName.E_PRIMARY_DATA]: getDataWorkDay
                                    }
                                });

                                // sau khi lưu thành công và đang ở màn hình hiện tại thì reload
                                if (
                                    resSave.actionStatus &&
                                    api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                                ) {
                                    store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                                }
                            } else {
                                // bằng flase khi dữ liệu giống nhau
                                payload.dataChange = false;
                                store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                            }
                        } else {
                            const resSave = await saveDataLocal(keyTask, {
                                ...getDataWorkDayLocal,
                                ...{
                                    [EnumName.E_PRIMARY_DATA]: getDataWorkDay
                                }
                            });

                            if (
                                resSave.actionStatus &&
                                api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                            ) {
                                store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                            }
                            // payload.dataChange = true;
                            // store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                        }
                    } else {
                        // chưa có dữ liệu dưới local thì lưu và reload lại danh sách
                        const resSave = await saveDataLocal(keyTask, {
                            ...getDataWorkDayLocal,
                            ...{
                                [payload.keyQuery]: getDataWorkDay
                            }
                        });
                        if (
                            resSave.actionStatus &&
                            api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                        ) {
                            store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                        }
                    }
                } else {
                    // khi không có dữ liệu thì lưu là emplty data
                    const resSave = await saveDataLocal(keyTask, {
                        ...getDataWorkDayLocal,
                        ...{
                            [payload.keyQuery]: EnumName.E_EMPTYDATA
                        }
                    });
                    if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                        store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                    }
                }
            } else if (getCutOffDuration !== undefined) {
                // khi không có dữ liệu thì lưu là emplty data
                const resSave = await saveDataLocal(keyTask, {
                    ...getDataWorkDayLocal,
                    ...{
                        [payload.keyQuery]: EnumName.E_EMPTYDATA
                    }
                });
                if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                    store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttendanceCalendarDetail]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.AttendanceCalendarDetail],
                getCutOffDurationByMonthYear: (_Month, _Year) => {
                    const dataBody = {
                        Month: _Month,
                        Year: _Year
                    };
                    return HttpService.Post('[URI_HR]/Att_GetData/GetCutOffDurationByMonthYear', dataBody);
                },
                getDataWorkDay: cutOffDurationByMonthYear => {
                    const dataBody = {
                        ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                        CutOffDurationID: cutOffDurationByMonthYear
                    };
                    return HttpService.MultiRequest([
                        HttpService.Post('[URI_HR]/Att_GetData/GetDataAttendanceTablePortalApp', dataBody),
                        HttpService.Post('[URI_HR]/Att_GetData/New_GetAttendanceTableByProIDandCutOID', dataBody)
                    ]);
                }
            };

            // Đã chạy xong. Bắt buộc chờ task chạy xong mới được chạy lại chống sapam
            TaskIsRuning.listTaskRunning[keyTask] = false;

            if (typeof payload === 'object') payload.dataChange = true;

            const date = new Date(),
                currentMonth = payload && payload.Month ? payload.Month : parseInt(moment(date).format('MM')),
                currentYear = payload && payload.Month ? payload.Year : parseInt(moment(date).format('YYYY'));

            const getDataWorkDayLocal = await getDataLocal(keyTask);
            // không có internet
            if (HttpService.checkConnectInternet() === false) {
                if (getDataWorkDayLocal != null && getDataWorkDayLocal[payload.keyQuery] != null) {
                    if (api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                        store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                    }
                } else {
                    const resSave = await saveDataLocal(keyTask, {
                        ...getDataWorkDayLocal,
                        ...{
                            [payload.keyQuery]: EnumName.E_EMPTYDATA
                        }
                    });
                    if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                        store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                    }
                }
                return;
            }
            // lay CutOffDurationID
            let getCutOffDuration = null;
            if (payload.CutOffDurationID) {
                // Vào từ Notification
                getCutOffDuration = [
                    {
                        ID: payload.CutOffDurationID
                    }
                ];
            } else {
                getCutOffDuration = await api.getCutOffDurationByMonthYear(currentMonth, currentYear);
            }

            if (getCutOffDuration && getCutOffDuration[0] && getCutOffDuration[0].ID) {
                let cutOffDurationByMonthYear = getCutOffDuration[0].ID;

                // Lay du lieu cho list (server,local)
                let getDataWorkDay = {
                    cutOffDuration: cutOffDurationByMonthYear
                };

                const getDataWorkDayAndByID = await api.getDataWorkDay(cutOffDurationByMonthYear);

                if (getDataWorkDayAndByID[0]) {
                    getDataWorkDay = {
                        ...getDataWorkDay,
                        ...getDataWorkDayAndByID[0],
                        cutOffDuration: cutOffDurationByMonthYear
                    };
                }
                if (getDataWorkDayAndByID[1]) {
                    getDataWorkDay = {
                        ...getDataWorkDay,
                        ListAttendanceTableID: getDataWorkDayAndByID[1]
                    };
                }

                if (getDataWorkDay) {
                    //Filter
                    if (payload && payload.keyQuery === EnumName.E_FILTER) {
                        const resSave = await saveDataLocal(keyTask, {
                            ...getDataWorkDayLocal,
                            ...{
                                [EnumName.E_FILTER]: getDataWorkDay
                            }
                        });
                        if (
                            resSave.actionStatus &&
                            api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                        ) {
                            store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                        }
                    }
                    // reload
                    else if (
                        getDataWorkDayLocal !== null &&
                        getDataWorkDayLocal[EnumName.E_PRIMARY_DATA] !== EnumName.E_EMPTYDATA
                    ) {
                        if (payload.isCompare === true) {
                            //So sánh 2 dữ liệu khác nhau thì reload lại danh sách
                            let isEqual = Vnr_Function.compare(
                                getDataWorkDay,
                                getDataWorkDayLocal[EnumName.E_PRIMARY_DATA],
                                value => {
                                    return value.TitleWeek != null ? false : true;
                                }
                            );

                            if (!isEqual) {
                                const resSave = await saveDataLocal(keyTask, {
                                    ...getDataWorkDayLocal,
                                    ...{
                                        [EnumName.E_PRIMARY_DATA]: getDataWorkDay
                                    }
                                });

                                // sau khi lưu thành công và đang ở màn hình hiện tại thì reload
                                if (
                                    resSave.actionStatus &&
                                    api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                                ) {
                                    store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                                }
                            } else {
                                // bằng flase khi dữ liệu giống nhau
                                payload.dataChange = false;
                                store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                            }
                        } else {
                            const resSave = await saveDataLocal(keyTask, {
                                ...getDataWorkDayLocal,
                                ...{
                                    [EnumName.E_PRIMARY_DATA]: getDataWorkDay
                                }
                            });

                            if (
                                resSave.actionStatus &&
                                api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                            ) {
                                store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                            }
                            // payload.dataChange = true;
                            // store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                        }
                    } else {
                        // chưa có dữ liệu dưới local thì lưu và reload lại danh sách
                        const resSave = await saveDataLocal(keyTask, {
                            ...getDataWorkDayLocal,
                            ...{
                                [payload.keyQuery]: getDataWorkDay
                            }
                        });
                        if (
                            resSave.actionStatus &&
                            api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                        ) {
                            store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                        }
                    }
                } else {
                    // khi không có dữ liệu thì lưu là emplty data
                    const resSave = await saveDataLocal(keyTask, {
                        ...getDataWorkDayLocal,
                        ...{
                            [payload.keyQuery]: EnumName.E_EMPTYDATA
                        }
                    });
                    if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                        store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                    }
                }
            } else if (getCutOffDuration !== undefined) {
                // khi không có dữ liệu thì lưu là emplty data
                const resSave = await saveDataLocal(keyTask, {
                    ...getDataWorkDayLocal,
                    ...{
                        [payload.keyQuery]: EnumName.E_EMPTYDATA
                    }
                });
                if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                    store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttendanceCalenderDetailHistory]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttendanceCalenderDetailHistory,
                    ScreenName.AttendanceCalenderDetailHistoryDetail
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/GetConfirmHistoryAttendanceTable',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    let _params = {
                        IsPortal: true,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#region [module/attendance/attTSLRegister
    [EnumTask.KT_AttSubmitTSLRegister]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttSubmitTSLRegister,
                    ScreenName.AttSubmitTSLRegisterViewDetail,
                    ScreenName.AttSubmitTSLRegisterAddOrEdit
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_GetPersonalSubmitRegistedTamScanLog',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttSubmitTSLRegister],
                        orderBy = _configList[EnumName.E_Order],
                        configDetail = ConfigListDetail.value[ScreenName.AttSubmitTSLRegister],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'WarningViolation',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel',
                            'Status',
                            'itemStatus',
                            'StatusView',
                            // -- //
                            'Type',
                            'TimeLog',
                            'IsCheckApp',
                            'ShopNamebyGPS',
                            'ShopNamebyGPS',
                            'TAMScanReasonMissName'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApproveTSLRegister]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApproveTSLRegister,
                    ScreenName.AttApproveTSLRegisterViewDetail,
                    ScreenName.AttApprovedTSLRegister
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_GetTamScanLog_WillBeApproveByUser',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveTSLRegister],
                        orderBy = _configList[EnumName.E_Order],
                        configDetail = ConfigListDetail.value[ScreenName.AttApproveTSLRegister],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'WarningViolation',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel',
                            'Status',
                            'itemStatus',
                            'StatusView',
                            // -- //
                            'Type',
                            'TimeLog',
                            'IsCheckApp',
                            'ShopNamebyGPS',
                            'ShopNamebyGPS',
                            'TAMScanReasonMissName'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedTSLRegister]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApprovedTSLRegister,
                    ScreenName.AttApprovedTSLRegisterViewDetail,
                    ScreenName.AttApproveTSLRegister
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_Get_TamScanLog_WaitingApproveByUser',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApprovedTSLRegister],
                        orderBy = _configList[EnumName.E_Order],
                        configDetail = ConfigListDetail.value[ScreenName.AttApprovedTSLRegister],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'WarningViolation',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel',
                            'Status',
                            'itemStatus',
                            'StatusView',
                            // -- //
                            'Type',
                            'TimeLog',
                            'IsCheckApp',
                            'ShopNamebyGPS',
                            'ShopNamebyGPS',
                            'TAMScanReasonMissName'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/attendanceV3/attTSLRegisterV3

    // đăng ký quên chấm công
    [EnumTask.KT_AttSubmitTamScanLogRegister]: async ({ keyTask, payload }) => {
        handleGetDataSubmitTamScanLogRegister({ keyTask, payload });
    },
    [EnumTask.KT_AttSaveTempSubmitTamScanLogRegister]: async ({ keyTask, payload }) => {
        handleGetDataSubmitTamScanLogRegister({ keyTask, payload });
    },
    [EnumTask.KT_AttRejectSubmitTamScanLogRegister]: async ({ keyTask, payload }) => {
        handleGetDataSubmitTamScanLogRegister({ keyTask, payload });
    },
    [EnumTask.KT_AttCanceledSubmitTamScanLogRegister]: async ({ keyTask, payload }) => {
        handleGetDataSubmitTamScanLogRegister({ keyTask, payload });
    },
    [EnumTask.KT_AttApproveSubmitTamScanLogRegister]: async ({ keyTask, payload }) => {
        handleGetDataSubmitTamScanLogRegister({ keyTask, payload });
    },
    [EnumTask.KT_AttApprovedSubmitTamScanLogRegister]: async ({ keyTask, payload }) => {
        handleGetDataSubmitTamScanLogRegister({ keyTask, payload });
    },

    // màn hình duyệt quên chấm công
    [EnumTask.KT_AttApproveTamScanLogRegister]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttAllTamScanLogRegister,
                    ScreenName.AttCanceledTamScanLogRegister,
                    ScreenName.AttRejectTamScanLogRegister,
                    ScreenName.AttApprovedTamScanLogRegister,
                    ScreenName.AttApproveTamScanLogRegisterViewDetail,
                    ScreenName.AttApproveTamScanLogRegister
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_CENTER]/api/Att_TAMScanLogRegister/New_GetTamScanLog_WillBeApproveByUserHandle_App',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveTamScanLogRegister],
                        filter = _configList[EnumName.E_Filter],
                        configDetail = ConfigListDetail.value[ScreenName.AttApproveTamScanLogRegister],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'WarningViolation',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel',
                            'Status',
                            'itemStatus',
                            'StatusView',
                            // -- //
                            'Type',
                            'TimeLog',
                            'IsCheckApp',
                            'ShopNamebyGPS',
                            'TAMScanReasonMissName',
                            'ProfileName'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortalNew: true,
                        // sort: orderBy,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        Status: null,
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedTamScanLogRegister]: async ({ keyTask, payload }) => {
        handleGetDataApproveTamScanLogRegister({ keyTask, payload });
    },
    [EnumTask.KT_AttRejectTamScanLogRegister]: async ({ keyTask, payload }) => {
        handleGetDataApproveTamScanLogRegister({ keyTask, payload });
    },
    [EnumTask.KT_AttCanceledTamScanLogRegister]: async ({ keyTask, payload }) => {
        handleGetDataApproveTamScanLogRegister({ keyTask, payload });
    },
    [EnumTask.KT_AttAllTamScanLogRegister]: ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttAllTamScanLogRegister,
                    ScreenName.AttCanceledTamScanLogRegister,
                    ScreenName.AttRejectTamScanLogRegister,
                    ScreenName.AttApprovedTamScanLogRegister,
                    ScreenName.AttApproveTamScanLogRegisterViewDetail,
                    ScreenName.AttApproveTamScanLogRegister
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_CENTER]/api/Att_TAMScanLogRegister/New_GetTamScanLog_WillBeApproveAndAfterBrowsing_App',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveTamScanLogRegister],
                        filter = _configList[EnumName.E_Filter],
                        configDetail = ConfigListDetail.value[ScreenName.AttApproveTamScanLogRegister],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'WarningViolation',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel',
                            'Status',
                            'itemStatus',
                            'StatusView',
                            // -- //
                            'HoursFrom',
                            'HoursTo',
                            'DateStart',
                            'DateEnd',
                            'LeaveDays',
                            'CodeStatistic',
                            'Comment',
                            'RequestCancelStatus',
                            'itemStatusCancel',
                            'ProfileName'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortalNew: true,
                        // sort: orderBy,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/attendance/attRoster]
    [EnumTask.KT_AttSubmitRoster]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttSubmitRoster,
                    ScreenName.AttSubmitRosterViewDetail,
                    ScreenName.AttSubmitRosterAddOrEdit
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_GetPersonalsubmitRoster',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttSubmitRoster],
                        orderBy = _configList[EnumName.E_Order],
                        configDetail = ConfigListDetail.value[ScreenName.AttSubmitRoster],
                        valueField = [
                            'ID',
                            'SalaryClassName',
                            'PositionName',
                            'TypeView',
                            'CodeEmp',
                            'ProfileName',
                            'DateStart',
                            'DateEnd',
                            'MonShiftName',
                            'TueShiftName',
                            'WedShiftName',
                            'ThuShiftName',
                            'FriShiftName',
                            'SatShiftName',
                            'SunShiftName',
                            'StatusView'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApproveRoster]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApproveRoster,
                    ScreenName.AttApproveRosterViewDetail,
                    ScreenName.AttApprovedRoster
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_Get_Roster_WillBeApproveByUser',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveRoster],
                        orderBy = _configList[EnumName.E_Order],
                        configDetail = ConfigListDetail.value[ScreenName.AttApproveRoster],
                        valueField = [
                            'ID',
                            'SalaryClassName',
                            'PositionName',
                            'TypeView',
                            'CodeEmp',
                            'ProfileName',
                            'DateStart',
                            'DateEnd',
                            'MonShiftName',
                            'TueShiftName',
                            'WedShiftName',
                            'ThuShiftName',
                            'FriShiftName',
                            'SatShiftName',
                            'SunShiftName',
                            'StatusView'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedRoster]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApprovedRoster,
                    ScreenName.AttApprovedRosterViewDetail,
                    ScreenName.AttApproveRoster
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_GetWaitingApproveRosterByUser',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApprovedRoster],
                        orderBy = _configList[EnumName.E_Order],
                        configDetail = ConfigListDetail.value[ScreenName.AttApprovedRoster],
                        valueField = [
                            'ID',
                            'SalaryClassName',
                            'PositionName',
                            'TypeView',
                            'CodeEmp',
                            'ProfileName',
                            'DateStart',
                            'DateEnd',
                            'MonShiftName',
                            'TueShiftName',
                            'WedShiftName',
                            'ThuShiftName',
                            'FriShiftName',
                            'SatShiftName',
                            'SunShiftName',
                            'StatusView'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/attendance/attRosterGroupByEmp]
    [EnumTask.KT_AttSubmitRosterGroupByEmp]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttSubmitRosterGroupByEmp,
                    ScreenName.AttSubmitRosterGroupByEmpViewDetail,
                    ScreenName.AttSubmitRosterGroupByEmpAddOrEdit
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_ListRosterGroupByEmp',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttSubmitRosterGroupByEmp],
                        orderBy = _configList[EnumName.E_Order],
                        configDetail = ConfigListDetail.value[ScreenName.AttSubmitRosterGroupByEmp],
                        valueField = [
                            'ID',
                            'ProfileName',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'ApprovalDate',
                            'DateUpdate',
                            'JobTitleName',
                            'RosterGroupTypeName',
                            // -- //
                            'DateStart',
                            'DateEnd',
                            'Note',
                            'StatusView',
                            'FirstApproverName',
                            'MidApproverName',
                            'NextApproverName',
                            'LastApproverName'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ValueFields: valueField.join(','),
                        UserSubmit: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.ProfileID : null
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApproveRosterGroupByEmp]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApproveRosterGroupByEmp,
                    ScreenName.AttApproveRosterGroupByEmpViewDetail,
                    ScreenName.AttApprovedRosterGroupByEmp
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_RosterGroupByEmpApprove',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveRosterGroupByEmp],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedRosterGroupByEmp]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApprovedRosterGroupByEmp,
                    ScreenName.AttApprovedRosterGroupByEmpViewDetail,
                    ScreenName.AttApproveRosterGroupByEmp
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_WaitingApprovedRosterGroupByEmp',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApprovedRosterGroupByEmp],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/attendance/attLeaveDay]
    [EnumTask.KT_AttSubmitLeaveDay]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttSubmitLeaveDay,
                    ScreenName.AttSubmitLeaveDayViewDetail,
                    ScreenName.AttSubmitLeaveDayAddOrEdit
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_GetLeaveDayByFilter',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttSubmitLeaveDay],
                        orderBy = _configList[EnumName.E_Order],
                        configDetail = ConfigListDetail.value[ScreenName.AttSubmitLeaveDay],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'WarningViolation',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel',
                            'Status',
                            'itemStatus',
                            'StatusView',
                            // -- //
                            'HoursFrom',
                            'HoursTo',
                            'DateStart',
                            'DateEnd',
                            'LeaveDays',
                            'CodeStatistic',
                            'Comment',
                            'RequestCancelStatus',
                            'itemStatusCancel'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApproveLeaveDay]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApproveLeaveDay,
                    ScreenName.AttApproveLeaveDayViewDetail,
                    ScreenName.AttApprovedLeaveDay
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_GetLeaveDayApproveByFilter',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveLeaveDay],
                        orderBy = _configList[EnumName.E_Order],
                        configDetail = ConfigListDetail.value[ScreenName.AttApproveLeaveDay],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'WarningViolation',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel',
                            'Status',
                            'itemStatus',
                            'StatusView',
                            // -- //
                            'HoursFrom',
                            'HoursTo',
                            'DateStart',
                            'DateEnd',
                            'LeaveDays',
                            'CodeStatistic',
                            'Comment',
                            'RequestCancelStatus',
                            'itemStatusCancel'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedLeaveDay]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApprovedLeaveDay,
                    ScreenName.AttApprovedLeaveDayViewDetail,
                    ScreenName.AttApproveLeaveDay
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_GetLeaveDayApprovedByFilter',
                        dataBody,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApprovedLeaveDay],
                        orderBy = _configList[EnumName.E_Order],
                        configDetail = ConfigListDetail.value[ScreenName.AttApprovedLeaveDay],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'WarningViolation',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel',
                            'Status',
                            'itemStatus',
                            'StatusView',
                            // -- //
                            'HoursFrom',
                            'HoursTo',
                            'DateStart',
                            'DateEnd',
                            'LeaveDays',
                            'CodeStatistic',
                            'Comment',
                            'RequestCancelStatus',
                            'itemStatusCancel'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/attendanceV3/attTakeLeaveDay]
    // Đăng ký ngày nghỉ
    [EnumTask.KT_AttSubmitTakeLeaveDay]: ({ keyTask, payload }) => {
        handleGetDataSubmitTakeLeveaDay({ keyTask, payload });
    },
    [EnumTask.KT_AttSaveTempSubmitTakeLeaveDay]: ({ keyTask, payload }) => {
        handleGetDataSubmitTakeLeveaDay({ keyTask, payload });
    },
    [EnumTask.KT_AttCanceledSubmitTakeLeaveDay]: ({ keyTask, payload }) => {
        handleGetDataSubmitTakeLeveaDay({ keyTask, payload });
    },
    [EnumTask.KT_AttApproveSubmitTakeLeaveDay]: ({ keyTask, payload }) => {
        handleGetDataSubmitTakeLeveaDay({ keyTask, payload });
    },
    [EnumTask.KT_AttApprovedSubmitTakeLeaveDay]: ({ keyTask, payload }) => {
        handleGetDataSubmitTakeLeveaDay({ keyTask, payload });
    },
    [EnumTask.KT_AttRejectSubmitTakeLeaveDay]: ({ keyTask, payload }) => {
        handleGetDataSubmitTakeLeveaDay({ keyTask, payload });
    },

    // Duyệt ngày nghỉ
    [EnumTask.KT_AttApproveTakeLeaveDay]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApproveTakeLeaveDay,
                    ScreenName.AttApproveTakeLeaveDayViewDetail,
                    ScreenName.AttApprovedTakeLeaveDay
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_CENTER]/api/Att_LeaveDay/New_GetLeaveDayApproveByFilterHandle_App',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveTakeLeaveDay],
                        filter = _configList[EnumName.E_Filter],
                        configDetail = ConfigListDetail.value[ScreenName.AttApproveTakeLeaveDay],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'WarningViolation',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel',
                            'Status',
                            'itemStatus',
                            'StatusView',
                            // -- //
                            'HoursFrom',
                            'HoursTo',
                            'DateStart',
                            'DateEnd',
                            'LeaveDays',
                            'CodeStatistic',
                            'Comment',
                            'RequestCancelStatus',
                            'itemStatusCancel'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortalNew: true,
                        // sort: orderBy,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedTakeLeaveDay]: ({ keyTask, payload }) => {
        handleGetDataApproveTakeLeaveDay({ keyTask, payload });
    },
    [EnumTask.KT_AttRejectTakeLeaveDay]: ({ keyTask, payload }) => {
        handleGetDataApproveTakeLeaveDay({ keyTask, payload });
    },
    [EnumTask.KT_AttCanceledTakeLeaveDay]: ({ keyTask, payload }) => {
        handleGetDataApproveTakeLeaveDay({ keyTask, payload });
    },
    [EnumTask.KT_AttAllTakeLeaveDay]: ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttAllTakeLeaveDay,
                    ScreenName.AttApprovedTakeLeaveDayViewDetail,
                    ScreenName.AttApproveTakeLeaveDay
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_CENTER]/api/Att_LeaveDay/New_GetLeaveDayApproveAndAfterBrowsingByFilterHandle_App',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveTakeLeaveDay],
                        filter = _configList[EnumName.E_Filter],
                        configDetail = ConfigListDetail.value[ScreenName.AttApproveTakeLeaveDay],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'WarningViolation',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel',
                            'Status',
                            'itemStatus',
                            'StatusView',
                            // -- //
                            'HoursFrom',
                            'HoursTo',
                            'DateStart',
                            'DateEnd',
                            'LeaveDays',
                            'CodeStatistic',
                            'Comment',
                            'RequestCancelStatus',
                            'itemStatusCancel',
                            'ProfileName'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortalNew: true,
                        // sort: orderBy,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/attendanceV3/attTakeBusinessTrip]
    [EnumTask.KT_AttSubmitTakeBusinessTrip]: async ({ keyTask, payload }) => {
        handleGetDataSubmitTakeBusinessTrip({ keyTask, payload });
    },
    [EnumTask.KT_AttSaveTempSubmitTakeBusinessTrip]: ({ keyTask, payload }) => {
        handleGetDataSubmitTakeBusinessTrip({ keyTask, payload });
    },
    [EnumTask.KT_AttCanceledSubmitTakeBusinessTrip]: ({ keyTask, payload }) => {
        handleGetDataSubmitTakeBusinessTrip({ keyTask, payload });
    },
    [EnumTask.KT_AttApproveSubmitTakeBusinessTrip]: ({ keyTask, payload }) => {
        handleGetDataSubmitTakeBusinessTrip({ keyTask, payload });
    },
    [EnumTask.KT_AttApprovedSubmitTakeBusinessTrip]: ({ keyTask, payload }) => {
        handleGetDataSubmitTakeBusinessTrip({ keyTask, payload });
    },
    [EnumTask.KT_AttRejectSubmitTakeBusinessTrip]: ({ keyTask, payload }) => {
        handleGetDataSubmitTakeBusinessTrip({ keyTask, payload });
    },
    [EnumTask.KT_AttApproveTakeBusinessTrip]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApproveTakeBusinessTrip,
                    ScreenName.AttApproveTakeBusinessTripViewDetail,
                    ScreenName.AttApprovedTakeBusinessTrip
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_CENTER]/api/Att_BussinessTravel/New_GetBusinessTravelApproveByFilterHandle_App',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveTakeBusinessTrip],
                        filter = _configList[EnumName.E_Filter],
                        configDetail = ConfigListDetail.value[ScreenName.AttApproveTakeBusinessTrip],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'WarningViolation',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel',
                            'Status',
                            'itemStatus',
                            'StatusView',
                            // -- //
                            'DateStart',
                            'DateEnd',
                            'LeaveDayTypeName',
                            'TotalBussinessDays',
                            'DataNote',
                            'ProfileName'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortalNew: true,
                        // sort: orderBy,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedTakeBusinessTrip]: async ({ keyTask, payload }) => {
        handleGetDataApproveTakeBusinessTrip({ keyTask, payload });
    },
    [EnumTask.KT_AttRejectTakeBusinessTrip]: ({ keyTask, payload }) => {
        handleGetDataApproveTakeBusinessTrip({ keyTask, payload });
    },
    [EnumTask.KT_AttCanceledTakeBusinessTrip]: ({ keyTask, payload }) => {
        handleGetDataApproveTakeBusinessTrip({ keyTask, payload });
    },
    [EnumTask.KT_AttAllTakeBusinessTrip]: ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttAllTakeBusinessTrip,
                    ScreenName.AttApprovedTakeBusinessTripViewDetail,
                    ScreenName.AttApproveTakeBusinessTrip
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_CENTER]/api/Att_BussinessTravel/New_GetBusinessTravelApproveAndAfterBrowsingByFilterHandle_App',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveTakeBusinessTrip],
                        filter = _configList[EnumName.E_Filter],
                        configDetail = ConfigListDetail.value[ScreenName.AttApproveTakeBusinessTrip],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'WarningViolation',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel',
                            'Status',
                            'itemStatus',
                            'StatusView',
                            // -- //
                            'DateStart',
                            'DateEnd',
                            'LeaveDayTypeName',
                            'TotalBussinessDays',
                            'DataNote',
                            'ProfileName'
                        ];
                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });
                    let _params = {
                        IsPortalNew: true,
                        // sort: orderBy,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#endregion

    //#region [module/attendance/attLeaveDayCancel]
    [EnumTask.KT_AttSubmitLeaveDayCancel]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttSubmitLeaveDayCancel,
                    ScreenName.AttSubmitLeaveDayCancelViewDetail,
                    ScreenName.AttSubmitLeaveDayCancelAddOrEdit
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Por_GetData/Get_Att_RequireCancel',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttSubmitLeaveDayCancel],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApproveLeaveDayCancel]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApproveLeaveDayCancel,
                    ScreenName.AttApproveLeaveDayCancelViewDetail,
                    ScreenName.AttApprovedLeaveDayCancel
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Por_GetData/Get_Att_RequireCancelApprove',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveLeaveDayCancel],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        SysUserID: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.userid : null
                    };
                    console.log(_params, '_params');
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedLeaveDayCancel]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApprovedLeaveDayCancel,
                    ScreenName.AttApprovedLeaveDayCancelViewDetail,
                    ScreenName.AttApproveLeaveDayCancel
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Por_GetData/Get_Att_RequireCancelApproved',
                        dataBody,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApprovedLeaveDayCancel],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        SysUserID: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.userid : null
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/attendance/attSubmitOvertime]
    [EnumTask.KT_AttSubmitOvertime]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttSubmitOvertime,
                    ScreenName.AttSubmitOvertimeViewDetail,
                    ScreenName.AttSubmitOvertimeAddOrEdit
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_GetOvertimeByFilter',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttSubmitOvertime],
                        orderBy = _configList[EnumName.E_Order],
                        configDetail = ConfigListDetail.value[ScreenName.AttSubmitOvertime],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'WarningViolation',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel',
                            'Status',
                            'itemStatus',
                            'StatusView',
                            // -- //
                            'ApproveHours',
                            'ConfirmHours',
                            'RegisterHours',
                            'WorkDateRoot',
                            'OutTime',
                            'InTime',
                            'Rate',
                            'ReasonOT'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ValueFields: valueField.join(',')
                    };

                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApproveOvertime]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApproveOvertime,
                    ScreenName.AttApproveOvertimeViewDetail,
                    ScreenName.AttApprovedOvertime
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/GetListOvertimeWaittingApproveMobile',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveOvertime],
                        orderBy = _configList[EnumName.E_Order],
                        configDetail = ConfigListDetail.value[ScreenName.AttApproveOvertime],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'WarningViolation',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel',
                            'Status',
                            'itemStatus',
                            'StatusView',
                            // -- //
                            'ApproveHours',
                            'ConfirmHours',
                            'RegisterHours',
                            'WorkDateRoot',
                            'OutTime',
                            'InTime',
                            'Rate',
                            'ReasonOT',
                            'ReasonOT'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        IsReCheck: false,
                        IsWaitting: false,
                        ValueFields: valueField.join(',')
                        //IsAll: true,
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedOvertime]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApprovedOvertime,
                    ScreenName.AttApprovedOvertimeViewDetail,
                    ScreenName.AttApproveOvertime
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_GetOvertimeApprovedByFilter',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApprovedOvertime],
                        orderBy = _configList[EnumName.E_Order],
                        configDetail = ConfigListDetail.value[ScreenName.AttApprovedOvertime],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'WarningViolation',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel',
                            'Status',
                            'itemStatus',
                            'StatusView',
                            // -- //
                            'ApproveHours',
                            'ConfirmHours',
                            'RegisterHours',
                            'WorkDateRoot',
                            'OutTime',
                            'InTime',
                            'Rate',
                            'ReasonOT',
                            'ReasonOT'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/attendance/attLateEarlyAllowed]
    [EnumTask.KT_AttSubmitLateEarlyAllowed]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttSubmitLateEarlyAllowed,
                    ScreenName.AttSubmitLateEarlyAllowedViewDetail,
                    ScreenName.AttSubmitLateEarlyAllowedAddOrEdit
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_LateEarlyAllowed_Portal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttSubmitLateEarlyAllowed],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApproveLateEarlyAllowed]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApproveLateEarlyAllowed,
                    ScreenName.AttApproveLateEarlyAllowedViewDetail,
                    ScreenName.AttApprovedLateEarlyAllowed
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_GetLateEarlyAllowedByFilter',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveLateEarlyAllowed],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedLateEarlyAllowed]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApprovedLateEarlyAllowed,
                    ScreenName.AttApprovedLateEarlyAllowedViewDetail,
                    ScreenName.AttApproveLateEarlyAllowed
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_GetLateEarlyAllowedByFilter_WaittingApproved',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApprovedLateEarlyAllowed],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/attendance/attPlanOvertime]
    [EnumTask.KT_AttSubmitPlanOvertime]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttSubmitPlanOvertime,
                    ScreenName.AttSubmitPlanOvertimeViewDetail,
                    ScreenName.AttSubmitPlanOvertimeAddOrEdit
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_PlanOvertimeByFilter',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttSubmitPlanOvertime],
                        orderBy = _configList[EnumName.E_Order],
                        configDetail = ConfigListDetail.value[ScreenName.AttSubmitPlanOvertime],
                        valueField = [
                            'ID',
                            'Status',
                            'ApproveHours',
                            'RegisterHours',
                            'ConfirmHours',
                            'WorkDateRoot',
                            'InTime',
                            'OutTime',
                            'Rate',
                            'RequestCancelStatus',
                            'itemStatusCancel',
                            'StatusView',
                            'WarningViolation',
                            'ReasonOT',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovePlanOvertime]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApprovePlanOvertime,
                    ScreenName.AttApprovePlanOvertimeViewDetail,
                    ScreenName.AttApprovedPlanOvertime
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_PlanOvertimeApproveByFilter',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApprovePlanOvertime],
                        orderBy = _configList[EnumName.E_Order],
                        configDetail = ConfigListDetail.value[ScreenName.AttApprovePlanOvertime],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'Status',
                            'ApproveHours',
                            'RegisterHours',
                            'ConfirmHours',
                            'WorkDateRoot',
                            'InTime',
                            'OutTime',
                            'Rate',
                            'RequestCancelStatus',
                            'itemStatusCancel',
                            'itemStatus',
                            'StatusView',
                            'WarningViolation',
                            'ReasonOT',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    if (configDetail)
                        configDetail.forEach(item => {
                            if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                                valueField.push(item.Name);
                            }
                        });

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedPlanOvertime]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApprovedPlanOvertime,
                    ScreenName.AttApprovedPlanOvertimeViewDetail,
                    ScreenName.AttApprovePlanOvertime
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_PlanGetOvertimeApprovedByFilter',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApprovedPlanOvertime],
                        orderBy = _configList[EnumName.E_Order],
                        configDetail = ConfigListDetail.value[ScreenName.AttApprovedPlanOvertime],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'Status',
                            'ApproveHours',
                            'RegisterHours',
                            'ConfirmHours',
                            'WorkDateRoot',
                            'InTime',
                            'OutTime',
                            'Rate',
                            'RequestCancelStatus',
                            'itemStatusCancel',
                            'itemStatus',
                            'StatusView',
                            'WarningViolation',
                            'ReasonOT',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/attendance/attPlanOvertimeCancel]
    [EnumTask.KT_AttSubmitPlanOvertimeCancel]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttSubmitPlanOvertimeCancel,
                    ScreenName.AttSubmitPlanOvertimeCancelViewDetail,
                    ScreenName.AttSubmitPlanOvertimeCancelAddOrEdit
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_GetRequestCancalationOvertimePlan',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttSubmitPlanOvertimeCancel],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovePlanOvertimeCancel]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApprovePlanOvertimeCancel,
                    ScreenName.AttApprovePlanOvertimeCancelViewDetail,
                    ScreenName.AttApprovedPlanOvertimeCancel
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_GetRequestCancalationOTPlan_Approve',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApprovePlanOvertimeCancel],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedPlanOvertimeCancel]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApprovedPlanOvertimeCancel,
                    ScreenName.AttApprovedPlanOvertimeCancelViewDetail,
                    ScreenName.AttApprovePlanOvertimeCancel
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_GetWaitingApprovedRequestCancalationOTPlan',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApprovedPlanOvertimeCancel],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    // add new by nhan

    //#region [module/attendance/attRegisterVehicle]
    [EnumTask.KT_AttSubmitRegisterVehicle]: async ({ keyTask, payload }) => {
        console.log('123');
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttSubmitRegisterVehicle,
                    ScreenName.AttSubmitRegisterVehicleViewDetail,
                    ScreenName.AttSubmitRegisterVehicleAddOrEdit
                ],

                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/GetRegisterVehiclePortal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttSubmitRegisterVehicle],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApproveRegisterVehicle]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApproveRegisterVehicle,
                    ScreenName.AttApproveRegisterVehicleViewDetail,
                    ScreenName.AttApprovedRegisterVehicle
                ],
                // change API  New_PlanOvertimeApproveByFilter
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_GetRegisterVehicleByFilter',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveRegisterVehicle],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedRegisterVehicle]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApprovedRegisterVehicle,
                    ScreenName.AttApprovedRegisterVehicleViewDetail,
                    ScreenName.AttApproveRegisterVehicle
                ],
                // change API   New_PlanGetOvertimeApprovedByFilter
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_GetRegisterVehicleForTabApprovaledByFilter',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApprovedRegisterVehicle],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/salary/taxInformationRegister]
    [EnumTask.KT_TaxSubmitTaxInformationRegister]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.TaxSubmitTaxInformationRegister,
                    ScreenName.TaxSubmitTaxInformationRegisterViewDetail,
                    ScreenName.TaxSubmitTaxInformationRegisterAddOrEdit
                ],

                getDataList: (dataBody, payload) => {
                    console.log(dataBody, 'dataBody');
                    return HttpService.Post(
                        '[URI_HR]/Sal_GetData/GetSalTaxInformationRegisterPortal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.TaxSubmitTaxInformationRegister],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApproveTaxInformationRegister]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.TaxApproveTaxInformationRegister,
                    ScreenName.TaxApproveTaxInformationRegisterViewDetail,
                    ScreenName.TaxApprovedTaxInformationRegister
                ],

                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Sal_GetData/GetSalTaxInformationRegisterPortal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.TaxApproveTaxInformationRegister],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        strStatus: 'E_PendingSend,E_Transferred,E_Valid,E_Invalid,E_SubmitTemp,E_Rejected'
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedTaxInformationRegister]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.TaxApprovedTaxInformationRegister,
                    ScreenName.TaxApprovedTaxInformationRegisterViewDetail,
                    ScreenName.TaxApproveTaxInformationRegister
                ],

                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Sal_GetData/GetSalTaxInformationRegisterPortal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.TaxApprovedTaxInformationRegister],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        strStatus: 'E_Confirmed'
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/gểnalInfo/profileInfo/realtive]
    [EnumTask.KT_RelativeConfirmed]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.RelativeConfirmed,
                    ScreenName.RelativeConfirmedViewDetail,
                    ScreenName.RelativeWaitConfirm
                ],

                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Hre_GetData/GetListRelativeByProfileID',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.RelativeConfirmed],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_RelativeWaitConfirm]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.RelativeWaitConfirm,
                    ScreenName.RelativeWaitConfirmViewDetail,
                    ScreenName.RelativeConfirmed
                ],

                getDataList: (dataBody, payload) => {
                    console.log(dataBody, 'dataBody');
                    return HttpService.Post(
                        '[URI_HR]/Hre_GetData/GetHre_RelativesComebineAllGrid',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.RelativeWaitConfirm],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/gểnalInfo/profileInfo/passport]
    [EnumTask.KT_PassportConfirmed]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.PassportConfirmed,
                    ScreenName.PassportConfirmedViewDetail,
                    ScreenName.PassportWaitConfirm
                ],

                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        `[URI_HR]/Hre_GetDataV2/GetListPassportByProfileID?profileID=${dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
                        }`,
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.PassportConfirmed],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_PassportWaitConfirm]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.PassportWaitConfirm,
                    ScreenName.PassportWaitConfirmViewDetail,
                    ScreenName.PassportConfirmed
                ],

                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Hre_GetDataV2/GetHre_Passport',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.PassportWaitConfirm],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/gểnalInfo/profileInfo/dependant]
    [EnumTask.KT_DependantConfirmed]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.DependantConfirmed,
                    ScreenName.DependantConfirmedViewDetail,
                    ScreenName.DependantWaitConfirm
                ],

                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Hre_GetData/GetDependantListByProfileIDByModel',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.RelativeConfirmed],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_DependantWaitConfirm]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.DependantWaitConfirm,
                    ScreenName.DependantWaitConfirmViewDetail,
                    ScreenName.DependantConfirmed
                ],

                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Hre_GetData/GetHre_DependantByDataStatus_ForAllList',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.RelativeWaitConfirm],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/salary/SalPITFinalization]
    [EnumTask.KT_SalApprovePITFinalization]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.SalApprovePITFinalization,
                    ScreenName.SalApprovePITFinalizationViewDetail,
                    ScreenName.SalApprovePITFinalizationAddOrEdit
                ],

                getDataList: (dataBody, payload) => {
                    console.log(dataBody, 'dataBody');
                    return HttpService.Post(
                        '[URI_HR]/Sal_GetData/GetSalPITFinalizationDelegateeList_Portal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.SalApprovePITFinalization],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        strStatus: 'E_WAITINGCONFIRM,E_CANCEL,E_TEMPSAVE,E_REJECT'
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_SalApprovedPITFinalization]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.SalApprovedPITFinalization,
                    ScreenName.SalApprovedPITFinalizationViewDetail,
                    ScreenName.SalApprovedPITFinalizationAddOrEdit
                ],

                getDataList: (dataBody, payload) => {
                    console.log(dataBody, 'dataBody');
                    return HttpService.Post(
                        '[URI_HR]/Sal_GetData/GetSalPITFinalizationDelegateeList_Portal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.SalApprovedPITFinalization],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        strStatus: 'E_CONFIRMED'
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/generalinfo/Household]
    [EnumTask.KT_HouseholdConfirmed]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.HouseholdConfirmed,
                    ScreenName.HouseholdConfirmedViewDetail,
                    ScreenName.HouseholdAddOrEdit
                ],

                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/GetSalHreHouseholdInfo',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    let _params = {
                        profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_HouseholdWaitConfirm]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.HouseholdWaitConfirm,
                    ScreenName.HouseholdWaitConfirmViewDetail,
                    ScreenName.HouseholdAddOrEdit
                ],

                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/GetHre_HouseholdInfoByDataStatus_Total',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    let _params = {
                        profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_HouseholdAddRelative]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.HouseholdConfirmed,
                    ScreenName.HouseholdConfirmedViewDetail,
                    ScreenName.HouseholdAddOrEdit,
                    ScreenName.HouseholdAddRelative
                ],

                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Por_GetData/GetRelativesList',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    let _params = {
                        ProfileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },

    //#endregion

    //#region [module/GeneralInfo/AttPaidLeave]
    [EnumTask.KT_AttPaidLeave]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.AttPaidLeave],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/GetAnnualInYear',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    let _params = {
                        profileID: dataVnrStorage.currentUser.info.ProfileID,
                        year: new Date().getFullYear()
                    };
                    return _params;
                }
            };

            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/GeneralInfo/WorkingExperience]
    [EnumTask.KT_WorkingExperienceConfirmed]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.WorkingExperienceConfirmed,
                    ScreenName.WorkingExperienceConfirmedViewDetail,
                    ScreenName.WorkingExperienceAddOrEdit
                ],

                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Hre_GetData/GetListWorkingExperienceByProfileID',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    let _params = {
                        profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_WorkingExperienceWaitConfirm]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.WorkingExperienceWaitConfirm,
                    ScreenName.WorkingExperienceWaitConfirmViewDetail,
                    ScreenName.WorkingExperienceAddOrEdit
                ],

                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Hre_GetData/GetHre_WorkingExperience',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    let _params = {
                        profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/salary/SalSubmitPITAmount]
    [EnumTask.KT_SalSubmitPITAmount]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.SalSubmitPITAmount, ScreenName.SalSubmitPITAmountViewDetail],
                getDataList: (dataBody, payload) => {
                    return HttpService.MultiRequest([
                        HttpService.Post(
                            '[URI_HR]/Sal_GetData/GetPITFinalizationByYearForApp',
                            dataBody,
                            null,
                            payload.reload ? payload.reload : null
                        ),
                        HttpService.Post(
                            '[URI_HR]/Hre_GetData/New_GetPITAmountByProfileIDPortal',
                            dataBody,
                            null,
                            payload.reload ? payload.reload : null
                        )
                    ]);
                },
                getParamsDefault: () => {
                    const date = new Date(),
                        currentYear = parseInt(moment(date).format('YYYY'));

                    let _params = {
                        ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                        Year: new Date().getFullYear(),
                        MonthYearFrom: `01/${currentYear}`,
                        MonthYearTo: `12/${currentYear}`
                    };

                    return _params;
                }
            };

            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/attendance/attLeaveDay/AttConfirmLeaveDay]
    [EnumTask.KT_AttConfirmLeaveDay]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.AttConfirmLeaveDay],
                getDataList: (dataBody, payload) => {
                    return HttpService.Get(
                        `[URI_HR]/Att_GetData/GetListLeaveDayDetailByAttendanceTable?ProfileID=${dataBody.profileID
                        }&Year=${dataBody.year}`,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    let _params = {
                        profileID: dataVnrStorage.currentUser.info.ProfileID,
                        year: new Date().getFullYear()
                    };
                    return _params;
                }
            };

            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/Notification/NtfOverview]
    // [EnumTask.KT_NtfOverview]: async ({
    //     keyTask,
    //     payload,
    // }) => {
    //     try {
    //         const api = {
    //             taskNameScreen: [
    //                 ScreenName.NtfOverview,
    //                 ScreenName.NtfPersonal,
    //                 ScreenName.NtfManage,
    //             ],
    //             getDataList: (dataBody, payload) => {
    //                 return HttpService.Post(
    //                     '[URI_HR]/Por_GetData/Get_SysNotification_App',
    //                     dataBody,
    //                     null,
    //                     payload.reload ? payload.reload : null
    //                 );
    //             },
    //             getParamsDefault: () => {
    //                 // const _configList =
    //                 //     ConfigList.value[ScreenName.AttApproveTSLRegister],
    //                 //     orderBy = _configList[EnumName.E_Order];

    //                 let _params = {
    //                     EnumRule: null,
    //                     Page: 1,
    //                     PageSize: 20,
    //                 };
    //                 return _params;
    //             },
    //         };
    //         handleDataListModuleCommon(api, keyTask, payload);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // },
    [EnumTask.KT_NtfPersonal]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.Notification,
                    ScreenName.NtfOverview,
                    ScreenName.NtfPersonal,
                    ScreenName.NtfManage
                ],
                getDataList: (dataBody, payload) => {
                    if (ConfigVersionBuild.value === '080834') {
                        return HttpService.Post(
                            '[URI_HR]/Por_GetData/Get_SysNotification_App',
                            dataBody,
                            null,
                            payload.reload ? payload.reload : null
                        );
                    } else {
                        return HttpService.Post(
                            '[URI_HR]/Por_GetData/Get_SysNotification',
                            dataBody,
                            null,
                            payload.reload ? payload.reload : null
                        );
                    }
                },
                getParamsDefault: () => {
                    // const _configList =
                    //     ConfigList.value[ScreenName.AttApproveTSLRegister],
                    //     orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        EnumRule: 'E_PERSONAL',
                        Page: 1,
                        PageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    // [EnumTask.KT_NtfManage]: async ({ keyTask, payload }) => {
    //   try {
    //     const api = {
    //       taskNameScreen: [
    //         ScreenName.NtfOverview,
    //         ScreenName.NtfPersonal,
    //         ScreenName.NtfManage,
    //       ],
    //       getDataList: (dataBody, payload) => {
    //         return HttpService.Post(
    //           '[URI_HR]/Por_GetData/Get_SysNotification',
    //           dataBody,
    //           null,
    //           payload.reload ? payload.reload : null,
    //         );
    //       },
    //       getParamsDefault: () => {
    //         // const _configList =
    //         //     ConfigList.value[ScreenName.AttApproveTSLRegister],
    //         //     orderBy = _configList[EnumName.E_Order];

    //         let _params = {
    //           EnumRule: 'E_MANAGER',
    //           Page: 1,
    //           PageSize: 20,
    //         };
    //         return _params;
    //       },
    //     };
    //     handleDataListModuleCommon(api, keyTask, payload);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    //#endregion

    //#region [module/attendance/attBusinessTravel]
    [EnumTask.KT_AttSubmitBusinessTravel]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttSubmitBusinessTravel,
                    ScreenName.AttSubmitBusinessTravelViewDetail,
                    ScreenName.AttSubmitBusinessTravelAddOrEdit
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_BussinessTravel_Portal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttSubmitBusinessTravel],
                        orderBy = _configList ? _configList[EnumName.E_Order] : null;

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApproveBusinessTravel]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApproveBusinessTravel,
                    ScreenName.AttApproveBusinessTravelViewDetail,
                    ScreenName.AttApprovedBusinessTravel
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_BussinessTravelApprove',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveBusinessTravel],
                        orderBy = _configList ? _configList[EnumName.E_Order] : null;
                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedBusinessTravel]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApprovedBusinessTravel,
                    ScreenName.AttApprovedBusinessTravelViewDetail,
                    ScreenName.AttApproveBusinessTravel
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_WaitingApprovedBussinessTravel',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApprovedBusinessTravel],
                        orderBy = _configList ? _configList[EnumName.E_Order] : null;

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/attendance/attBusinessTravelCancel]
    [EnumTask.KT_AttSubmitBusinessTravelCancel]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttSubmitBusinessTravelCancel,
                    ScreenName.AttSubmitBusinessTravelCancelViewDetail,
                    ScreenName.AttSubmitBusinessTravelCancelAddOrEdit
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_GetRequestCancelationBusinessTravel',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttSubmitBusinessTravelCancel],
                        orderBy = _configList ? _configList[EnumName.E_Order] : null;

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApproveBusinessTravelCancel]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApproveBusinessTravelCancel,
                    ScreenName.AttApproveBusinessTravelCancelViewDetail,
                    ScreenName.AttApprovedBusinessTravelCancel
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_RequestCancelationBussinessTravel_Approve',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveBusinessTravelCancel],
                        orderBy = _configList ? _configList[EnumName.E_Order] : null;
                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        SysUserID: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.userid : null,
                        UserSubmit: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.userid : null
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedBusinessTravelCancel]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApprovedBusinessTravelCancel,
                    ScreenName.AttApprovedBusinessTravelCancelViewDetail,
                    ScreenName.AttApproveBusinessTravelCancel
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_WaitingRequestCancelationBusinessTravel',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApprovedBusinessTravelCancel],
                        orderBy = _configList ? _configList[EnumName.E_Order] : null;

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        SysUserID: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.userid : null,
                        UserSubmit: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.userid : null
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/attendance/attBusinessTrip]
    [EnumTask.KT_AttSubmitBusinessTrip]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttSubmitBusinessTrip,
                    ScreenName.AttSubmitBusinessTripViewDetail,
                    ScreenName.AttSubmitBusinessTripAddOrEdit
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_GetBusinessTravelByFilter',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveBusinessTrip],
                        orderBy = _configList ? _configList[EnumName.E_Order] : null;

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApproveBusinessTrip]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApproveBusinessTrip,
                    ScreenName.AttApproveBusinessTripViewDetail,
                    ScreenName.AttApprovedBusinessTrip
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_GetBusinessTravelApproveByFilter',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveBusinessTrip],
                        orderBy = _configList ? _configList[EnumName.E_Order] : null;
                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedBusinessTrip]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApprovedBusinessTrip,
                    ScreenName.AttApprovedBusinessTripViewDetail,
                    ScreenName.AttApproveBusinessTrip
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/New_GetBusinessTravelApproveddByFilter',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApprovedBusinessTrip],
                        orderBy = _configList ? _configList[EnumName.E_Order] : null;

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/attendance/attBusinessTravelTransfer]
    [EnumTask.KT_AttSubmitBusinessTravelTransfer]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttSubmitBusinessTravelTransfer,
                    ScreenName.AttSubmitBusinessTravelTransferViewDetail,
                    ScreenName.AttSubmitBusinessTripAddOrEdit
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_BusinessTravelTransfer_Portal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttSubmitBusinessTravelTransfer],
                        orderBy = _configList[EnumName.E_Order];
                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };

                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApproveBusinessTravelTransfer]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApproveBusinessTravelTransfer,
                    ScreenName.AttApproveBusinessTravelTransferViewDetail,
                    ScreenName.AttApprovedBusinessTravelTransfer
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_BusinessTravelTransferApprove',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveBusinessTravelTransfer],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };

                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedBusinessTravelTransfer]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApprovedBusinessTravelTransfer,
                    ScreenName.AttApprovedBusinessTravelTransferViewDetail,
                    ScreenName.AttApproveBusinessTravelTransfer
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_WaitingApprovedBusinessTravelTransfer',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApprovedBusinessTravelTransfer],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/attendance/attPregnancy]
    [EnumTask.KT_AttSubmitPregnancy]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttSubmitPregnancy,
                    ScreenName.AttSubmitPregnancyViewDetail,
                    ScreenName.AttSubmitPregnancyAddOrEdit
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_PregnancyRegister_Portal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttSubmitPregnancy],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovePregnancy]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApprovePregnancy,
                    ScreenName.AttApprovePregnancyViewDetail,
                    ScreenName.AttApprovedPregnancy
                ],
                getDataList: (dataBody, payload) => {
                    console.log(dataBody, 'KT_AttApprovedPregnancy');
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_PregnancyRegister_PortalApprove',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApprovePregnancy],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        IsReCheck: false,
                        IsWaitting: false
                        //IsAll: true,
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedPregnancy]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApprovedPregnancy,
                    ScreenName.AttApprovedPregnancyViewDetail,
                    ScreenName.AttApprovePregnancy
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_WaitingApprovedPregnancyRegisterPortal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApprovedPregnancy],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/evaluate/evaCapacity]
    [EnumTask.KT_EvaEmployee]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.EvaEmployee,
                    ScreenName.EvaEmployeeViewDetail,
                    ScreenName.EvaEmployeeAddOrEdit
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_PregnancyRegister_Portal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.EvaEmployee],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_EvaSubmitManager]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.EvaSubmitManager, ScreenName.EvaSubmitManagerViewDetail],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_PregnancyRegister_PortalApprove',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.EvaSubmitManager],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        IsReCheck: false,
                        IsWaitting: false
                        //IsAll: true,
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_EvaCapacityDetailWatting]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.EvaCapacityDetailWatting, ScreenName.EvaCapacityDetailWattingViewDetail],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_PregnancyRegister_Portal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.EvaEmployee],
                        orderBy = _configList[EnumName.E_Order];
                    console.log('KT_EvaCapacityDetailWatting');
                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_EvaCapacityDetailConfirmed]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.EvaCapacityDetailConfirmed,
                    ScreenName.EvaCapacityDetailConfirmedViewDetail
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_PregnancyRegister_Portal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.EvaEmployee],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/attendance/attShiftSubstitution]
    [EnumTask.KT_AttSubmitShiftSubstitution]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttSubmitShiftSubstitution,
                    ScreenName.AttSubmitShiftSubstitutionViewDetail,
                    ScreenName.AttSubmitShiftSubstitutionAddOrEdit
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_ShiftSubstitution_Portal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttSubmitShiftSubstitution],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        UserSubmit: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.ProfileID : null
                    };

                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttWaitConfirmShiftSubstitution]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttWaitConfirmShiftSubstitution,
                    ScreenName.AttWaitConfirmShiftSubstitutionViewDetail
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_ShiftSubstitution_Confirm_Portal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttWaitConfirmShiftSubstitution],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        UserSubmit: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.ProfileID : null
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttWaitConfirmedShiftSubstitution]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttWaitConfirmedShiftSubstitution,
                    ScreenName.AttWaitConfirmedShiftSubstitutionViewDetail
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_ShiftSubstitution_Confirmed_Portal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttWaitConfirmedShiftSubstitution],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        UserSubmit: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.ProfileID : null
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApproveShiftSubstitution]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApproveShiftSubstitution,
                    ScreenName.AttApproveShiftSubstitutionViewDetail,
                    ScreenName.AttApprovedShiftSubstitution
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_ShiftSubstitution_Approve_Portal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveShiftSubstitution],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        UserSubmit: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.ProfileID : null
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedShiftSubstitution]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApprovedShiftSubstitution,
                    ScreenName.AttApprovedShiftSubstitutionViewDetail,
                    ScreenName.AttApproveShiftSubstitution
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/Get_Att_WaitingApproverShiftSubstitution_Portal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApprovedShiftSubstitution],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        UserSubmit: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.ProfileID : null
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/humanResource/hreEvaluationDoc]
    [EnumTask.KT_HreApproveEvaluationDoc]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.HreApproveEvaluationDoc,
                    ScreenName.HreApproveEvaluationDocViewDetail,
                    ScreenName.HreApprovedEvaluationDoc
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Por_GetData/Get_EvaluationDocument_Approve_Portal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.HreApproveEvaluationDoc],
                        orderBy = _configList[EnumName.E_Order];

                    console.log(orderBy, 'orderBy');
                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_HreApprovedEvaluationDoc]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.HreApprovedEvaluationDoc,
                    ScreenName.HreApprovedEvaluationDocViewDetail,
                    ScreenName.HreApproveEvaluationDoc
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Por_GetData/Get_EvaluationDocument_Approved_Portal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.HreApprovedEvaluationDoc],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        UserSubmit: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.ProfileID : null
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/humanResource/hreViolation]
    [EnumTask.KT_HreApproveViolation]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.HreApproveViolation,
                    ScreenName.HreApproveViolationViewDetail,
                    ScreenName.HreApprovedViolation
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Por_GetData/Get_ViolationApprove_Portal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.HreApproveViolation],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_HreApprovedViolation]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.HreApprovedViolation,
                    ScreenName.HreApprovedViolationViewDetail,
                    ScreenName.HreApproveViolation
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Por_GetData/Get_ViolationApproved_Portal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.HreApprovedViolation],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/generalInfo/GeneralInfo]
    [EnumTask.KT_GeneralInfomation]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.GeneralInfo,
                    ScreenName.TopTabProfileBasicInfo,
                    ScreenName.TopTabProfilePersonalInfo,
                    ScreenName.TopTabProfileContactInfo,
                    ScreenName.TopTabProfileBasicInfoUpdate,
                    ScreenName.TopTabProfileContactInfoUpdate,
                    ScreenName.TopTabProfilePersonalInfoUpdate
                ],
                getDataList: payload => {
                    const listRequests = [
                        HttpService.Post('[URI_HR]/Por_GetData/NewPortal_GetProfile'),
                        HttpService.Post('[URI_HR]/Por_GetData/NewPortalGetRequestInfoByTableChange', {
                            ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                            TableChange: 'Hre_Profile,Hre_ProfileMoreInfo,Med_AnnualHealth'
                        })
                    ];

                    return HttpService.MultiRequest(listRequests, payload.reload ? payload.reload : null);
                },
                getParamsDefault: () => {
                    return {};
                }
            };

            const dataListLocal = await getDataLocal(keyTask);
            // không có internet
            if (HttpService.checkConnectInternet() === false) {
                // Đã chạy xong. Bắt buộc chờ task chạy xong mới được chạy lại chống sapam
                TaskIsRuning.listTaskRunning[keyTask] = false;

                // console.log(dataListLocal, 'dataListLocal')
                if (dataListLocal != null && dataListLocal[payload.keyQuery] != null) {
                    store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                } else {
                    const resSave = await saveDataLocal(keyTask, {
                        ...dataListLocal,
                        ...{
                            [payload.keyQuery]: EnumName.E_EMPTYDATA
                        }
                    });
                    if (resSave.actionStatus) {
                        store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                    }
                }
                return;
            }

            const getCacheReload = await HttpService.Get('[URI_HR]/Por_GetData/getCacheReloadProfileInfo');

            // Đã chạy xong. Bắt buộc chờ task chạy xong mới được chạy lại chống sapam
            TaskIsRuning.listTaskRunning[keyTask] = false;

            if (getCacheReload == true || getCacheReload == 'true' || getCacheReload == 'True') {
                payload.dataChange = true;
                const getDataServer = await api.getDataList(payload);
                const resSave = await saveDataLocal(keyTask, {
                    ...dataListLocal,
                    ...{
                        [EnumName.E_PRIMARY_DATA]: [...getDataServer]
                    }
                });

                // sau khi lưu thành công và đang ở màn hình hiện tại thì reload
                if (resSave.actionStatus) {
                    store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                }
            } else {
                payload.dataChange = false;
                // dữ liệu không thay dổi , get loacal
                if (
                    dataListLocal != null &&
                    dataListLocal[payload.keyQuery] != null &&
                    dataListLocal[payload.keyQuery] !== EnumName.E_EMPTYDATA
                ) {
                    store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                } else {
                    payload.dataChange = true;
                    const getDataServer = await api.getDataList(payload);
                    const resSave = await saveDataLocal(keyTask, {
                        ...dataListLocal,
                        ...{
                            [EnumName.E_PRIMARY_DATA]: [...getDataServer]
                        }
                    });

                    if (resSave.actionStatus) {
                        store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                    }
                }
            }

            // handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_TopTabHisProfileBasicInfo]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.TopTabHisProfileBasicInfo,
                    ScreenName.TopTabHisProfilePersonalInfo,
                    ScreenName.TopTabHisProfileContactInfo
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Get(
                        `[URI_HR]/Hre_GetDataV2/GetHre_PersonalContact_TempGird?profileID=${dataVnrStorage.currentUser.info.ProfileID
                        }`,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    return {
                        profileID: dataVnrStorage.currentUser.info.ProfileID
                    };
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_TopTabHisProfilePersonalInfo]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.TopTabHisProfileBasicInfo,
                    ScreenName.TopTabHisProfilePersonalInfo,
                    ScreenName.TopTabHisProfileContactInfo
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Get(
                        `[URI_HR]/Hre_GetDataV2/GetHre_PersonalContact_TempGird?profileID=${dataVnrStorage.currentUser.info.ProfileID
                        }`,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    return {
                        profileID: dataVnrStorage.currentUser.info.ProfileID
                    };
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_TopTabHisProfileContactInfo]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.TopTabHisProfileBasicInfo,
                    ScreenName.TopTabHisProfilePersonalInfo,
                    ScreenName.TopTabHisProfileContactInfo
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Get(
                        `[URI_HR]/Hre_GetDataV2/GetHre_PersonalContactHR3_TempGird?profileID=${dataVnrStorage.currentUser.info.ProfileID
                        }`,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    return {
                        profileID: dataVnrStorage.currentUser.info.ProfileID
                    };
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_WorkPosition]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.WorkHistory, ScreenName.WorkPosition],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Por_GetData/NewPortal_GetProfile',
                        null,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    return null;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_WorkHistory]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.WorkHistory, ScreenName.WorkPosition],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Hre_GetData/GetWorkHistoryViewPortalByProfileID',
                        null,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    return null;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_Reward]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.Reward, ScreenName.RewardViewDetail, ScreenName.GeneralInfoReward],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/GetListRewardProfileID',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    return {
                        profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
                    };
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_Discipline]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.Discipline,
                    ScreenName.DisciplineViewDetail,
                    ScreenName.GeneralInfoDiscipline
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Att_GetData/GetListDisciplineProfileID',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    return {
                        profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
                    };
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/Setting/AppendixInfomation]
    [EnumTask.KT_AppendixInfomation]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.AppendixInfomation, ScreenName.AppendixInfomationViewDetail],
                getListFolder: () => {
                    return HttpService.Get('[URI_POR]/New_Sys_AppendixInformation/GetFolders', null, null);
                },
                getParamsDefault: () => {
                    return null;
                }
            };

            if (typeof payload === 'object') payload.dataChange = true;

            const getDataAppendixLocal = await getDataLocal(keyTask);
            // không có internet
            if (HttpService.checkConnectInternet() === false) {
                // Đã chạy xong. Bắt buộc chờ task chạy xong mới được chạy lại chống sapam
                TaskIsRuning.listTaskRunning[keyTask] = false;
                if (getDataAppendixLocal != null && getDataAppendixLocal[payload.keyQuery] != null) {
                    if (api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                        store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                    }
                } else {
                    const resSave = await saveDataLocal(keyTask, {
                        ...getDataAppendixLocal,
                        ...{
                            [payload.keyQuery]: EnumName.E_EMPTYDATA
                        }
                    });
                    if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                        store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                    }
                }
                return;
            }
            const getListFolder = await api.getListFolder();

            // Đã chạy xong. Bắt buộc chờ task chạy xong mới được chạy lại chống sapam
            TaskIsRuning.listTaskRunning[keyTask] = false;

            if (getListFolder && getListFolder.length > 0) {
                // Lay du lieu cho list (server,local)
                const lstRequest = [];
                getListFolder.forEach(folder => {
                    lstRequest.push(HttpService.Get(`[URI_POR]/New_Sys_AppendixInformation/GetFiles?folder=${folder}`));
                });

                const getListFolderDetail = await HttpService.MultiRequest(lstRequest);

                const getDataAppendix = {
                    listKey: getListFolder,
                    listValues: getListFolderDetail
                };
                //  debugger
                if (getDataAppendix) {
                    //Filter
                    if (payload && payload.keyQuery === EnumName.E_FILTER) {
                        const resSave = await saveDataLocal(keyTask, {
                            ...getDataAppendixLocal,
                            ...{
                                [EnumName.E_FILTER]: getDataAppendix
                            }
                        });
                        if (
                            resSave.actionStatus &&
                            api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                        ) {
                            store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                        }
                    }
                    // reload
                    else if (
                        getDataAppendixLocal !== null &&
                        getDataAppendixLocal[EnumName.E_PRIMARY_DATA] !== EnumName.E_EMPTYDATA
                    ) {
                        if (payload.isCompare === true) {
                            //So sánh 2 dữ liệu khác nhau thì reload lại danh sách
                            let isEqual = Vnr_Function.compare(
                                getDataAppendix,
                                getDataAppendixLocal[EnumName.E_PRIMARY_DATA],
                                value => {
                                    return value.TitleWeek != null ? false : true;
                                }
                            );

                            if (!isEqual) {
                                const resSave = await saveDataLocal(keyTask, {
                                    ...getDataAppendixLocal,
                                    ...{
                                        [EnumName.E_PRIMARY_DATA]: getDataAppendix
                                    }
                                });

                                // sau khi lưu thành công và đang ở màn hình hiện tại thì reload
                                if (
                                    resSave.actionStatus &&
                                    api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                                ) {
                                    store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                                }
                            } else {
                                // bằng flase khi dữ liệu giống nhau
                                payload.dataChange = false;
                                store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                            }
                        } else {
                            const resSave = await saveDataLocal(keyTask, {
                                ...getDataAppendixLocal,
                                ...{
                                    [EnumName.E_PRIMARY_DATA]: getDataAppendix
                                }
                            });

                            if (
                                resSave.actionStatus &&
                                api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                            ) {
                                store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                            }
                            // payload.dataChange = true;
                            // store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                        }
                    } else {
                        // chưa có dữ liệu dưới local thì lưu và reload lại danh sách
                        const resSave = await saveDataLocal(keyTask, {
                            ...getDataAppendixLocal,
                            ...{
                                [payload.keyQuery]: getDataAppendix
                            }
                        });
                        if (
                            resSave.actionStatus &&
                            api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1
                        ) {
                            store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                        }
                    }
                } else {
                    // khi không có dữ liệu thì lưu là emplty data
                    const resSave = await saveDataLocal(keyTask, {
                        ...getDataAppendixLocal,
                        ...{
                            [payload.keyQuery]: EnumName.E_EMPTYDATA
                        }
                    });
                    if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                        store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                    }
                }
            } else {
                // khi không có dữ liệu thì lưu là emplty data
                const resSave = await saveDataLocal(keyTask, {
                    ...getDataAppendixLocal,
                    ...{
                        [payload.keyQuery]: EnumName.E_EMPTYDATA
                    }
                });
                if (resSave.actionStatus && api.taskNameScreen.indexOf(DrawerServices.getCurrentScreen()) > -1) {
                    store.dispatch(lazyLoadingReducer.actions.reloadScreen(keyTask, payload));
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/salary/salUnusualAllowance]
    [EnumTask.KT_SalSubmitUnusualAllowanceKeyTask]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.SalSubmitUnusualAllowance, ScreenName.SalSubmitUnusualAllowanceViewDetail],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Sal_GetData/GetUnusualEDEventListPortal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.SalSubmitUnusualAllowance],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/salary/salPaymentCostRegister]
    [EnumTask.KT_SalSubmitPaymentCostRegisterKeyTask]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.SalSubmitPaymentCostRegister,
                    ScreenName.SalSubmitPaymentCostRegisterViewDetail,
                    ScreenName.SalSubmitPaymentCostRegisterAddOrEdit,
                    ScreenName.SalSubmitPaymentCostRegisterAddPay
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Sal_GetData/GetSalPaymentCostRegisterList_Portal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.SalSubmitPaymentCostRegister],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_SalFeeCheck]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.SalFeeCheck,
                    ScreenName.SalFeeCheckViewDetail,
                    ScreenName.SalFeeCheckAddOrEdit
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Sal_GetData/GetSalPaymentCostListForFeeCheck/',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.SalFeeCheck],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },

    [EnumTask.KT_SalWaitApprovePaymentCostRegister]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.SalWaitApprovePaymentCostRegister,
                    ScreenName.SalApprovePaymentCostRegister,
                    ScreenName.SalApprovedPaymentCostRegister,
                    ScreenName.SalApprovePaymentCostRegisterViewDetail
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Sal_GetData/GetSalPaymentcostRegisterWaitingApprovedPortal/',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.SalWaitApprovePaymentCostRegister],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ValueFields: 'ID,CodeEmp,ProfileName,OrgStructureName,PositionName,JobTitleName,PaymentPeriodName,RequestPeriodName,TotalAmount,DataNote,StatusView,UserInfoFirstApproverName1,UserInfoNextApproverName2,UserInfoMidApproverName3,UserInfoLastApporoverName4,_1,HT03'
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },

    [EnumTask.KT_SalApprovedPaymentCostRegister]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.SalWaitApprovePaymentCostRegister,
                    ScreenName.SalApprovePaymentCostRegister,
                    ScreenName.SalApprovedPaymentCostRegister,
                    ScreenName.SalApprovePaymentCostRegisterViewDetail
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Sal_GetData/GetSalPaymentcostRegisterApprovedPortal/',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.SalApprovedPaymentCostRegister],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ValueFields: 'ID,CodeEmp,ProfileName,OrgStructureName,PositionName,JobTitleName,PaymentPeriodName,RequestPeriodName,TotalAmount,DataNote,StatusView,UserInfoFirstApproverName1,UserInfoNextApproverName2,UserInfoMidApproverName3,UserInfoLastApporoverName4,_1,HT03'
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/salary/Salary]
    [EnumTask.KT_Salary]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.Salary, ScreenName.SalaryMonthDetail, ScreenName.SalaryViewDetail],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Sal_GetData/GetReportForYear',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    let _params = {
                        Year: new Date().getFullYear(),
                        ProfileID: dataVnrStorage.currentUser.info.ProfileID
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/salary/SalRewardPayslip] [URI_HR]/Sal_GetData/GetRewardPayslipFormPayslipByProfile_ForApp
    [EnumTask.KT_SalRewardPayslip]: async ({ keyTask, payload }) => {
        console.log('List task');
        try {
            const api = {
                taskNameScreen: [ScreenName.SalRewardPayslip, 'Home'],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        `[URI_HR]/Cat_GetData/GetMultiCatRewardPeriod_Portal?RewardPeriodYear=${dataBody.year}`,
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    let _params = {
                        year: new Date().getFullYear(),
                        //  ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                        text: ''
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion
    //#endregion

    //#region [module/humanResource/hreSurveyEmployee]
    [EnumTask.KT_HreSurveyEmployee]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.HreSurveyEmployee, ScreenName.HreSurveyEmployeeViewDetail],
                getDataList: (dataBody, payload) => {
                    let serviceEndpointApi = null,
                        profileID = null;

                    if (dataVnrStorage?.apiConfig?.serviceEndpointApi)
                        serviceEndpointApi = dataVnrStorage?.apiConfig?.serviceEndpointApi;

                    if (dataVnrStorage?.currentUser?.info?.ProfileID) {
                        profileID = dataVnrStorage?.currentUser?.info?.ProfileID;
                    }

                    if (profileID && serviceEndpointApi) {
                        return HttpService.Get(
                            `${serviceEndpointApi}/api/Sur_SurveyProfile/GetSurveyAPPList?profileID=${profileID}`,
                            null,
                            payload.reload ? payload.reload : null
                        );
                    }
                },
                getParamsDefault: () => {
                    let _params = {
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_HreSurveyHistory]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.HreSurveyHistory, ScreenName.HreSurveyHistoryViewDetail],
                getDataList: (dataBody, payload) => {
                    let surveyEndpointApi = null;

                    if (dataVnrStorage.apiConfig && dataVnrStorage.apiConfig.surveyEndpointApi)
                        surveyEndpointApi = dataVnrStorage.apiConfig.surveyEndpointApi;

                    return HttpService.Post(
                        `${surveyEndpointApi}/api/survey/list-history`,
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    let userID = dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.userid : null;
                    let _params = {
                        creatorId: userID,
                        filter: { logic: 'and', filters: [] },
                        group: [],
                        page: 1,
                        pageSize: 20,
                        skip: 0,
                        sort: [],
                        take: 50,
                        type: 'survey'
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    // add new by nhan

    //#region [module/humanResource/HreWorkHistorySalary]
    [EnumTask.KT_HreSubmitWorkHistorySalary]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.HreSubmitWorkHistorySalary,
                    ScreenName.HreSubmitWorkHistorySalaryViewDetail,
                    ScreenName.HreSubmitWorkHistorySalaryAddOrEdit
                ],

                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Por_GetData/NewPortal_GetWorkHistoryList',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.HreSubmitWorkHistorySalary],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };

            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_HreApproveWorkHistorySalary]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.HreApproveWorkHistorySalary,
                    ScreenName.HreApproveWorkHistorySalaryViewDetail,
                    ScreenName.HreApprovedWorkHistorySalary
                ],
                // change API  New_PlanOvertimeApproveByFilter
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Por_GetData/NewPortal_GetWorkHistoryListApprove',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.HreApproveWorkHistorySalary],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_HreApprovedWorkHistorySalary]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.HreApprovedWorkHistorySalary,
                    ScreenName.HreApprovedWorkHistorySalaryViewDetail,
                    ScreenName.HreApproveWorkHistorySalary
                ],
                // change API
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Por_GetData/NewPortal_GetWorkHistoryListApproved',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.HreApprovedWorkHistorySalary],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/humanResource/hreEventCalendar]
    [EnumTask.KT_HreEventCalendar]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.HreEventCalendar],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_CENTER]/api/Att_GetData/GetDataCalendarDashboard',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    let _params = {
                        Month: moment()
                            .startOf('month')
                            .format('YYYY-MM-DD'),
                        FilterText: '',
                        page: 1,
                        pageSize: 20,
                        take: 20, //lấy 20 item
                        skip: 0,
                        dataSourceRequestString: 'page=1&pageSize=20'
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/humanResource/attRequirementRecruitment]

    [EnumTask.KT_HreSubmitRequirementRecruitment]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.HreSubmitRequirementRecruitment,
                    ScreenName.HreSubmitRequirementRecruitmentViewDetail,
                    ScreenName.HreSubmitRequirementRecruitmentAddOrEdit
                ],

                getDataList: (dataBody, payload) => {
                    console.log({ dataBody, payload }, '{dataBody, payload}');
                    return HttpService.Post(
                        '[URI_HR]/Por_GetData/Get_Rec_RequirementRecuitment',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.HreSubmitRequirementRecruitment],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_HreApproveRequirementRecruitment]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.HreApproveRequirementRecruitment,
                    ScreenName.HreApproveRequirementRecruitmentViewDetail,
                    ScreenName.HreApprovedRequirementRecruitment
                ],
                // change API  New_PlanOvertimeApproveByFilter
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Por_GetData/Portal_GetListRequirementRecruitmentByUserApprove',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.HreApproveRequirementRecruitment],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_HreApprovedRequirementRecruitment]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.HreApprovedRequirementRecruitment,
                    ScreenName.HreApprovedRequirementRecruitmentViewDetail,
                    ScreenName.HreApproveRequirementRecruitment
                ],
                // change API
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Por_GetData/Portal_GetListRequirementRecruitmentByUserApproved',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.HreApprovedRequirementRecruitment],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },

    //#endregion

    // end add new by nhan

    //#region [module/insurance]
    [EnumTask.KT_InsInsuranceRecord]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.InsInsuranceRecord,
                    ScreenName.InsInsuranceRecordViewDetail,
                    ScreenName.InsInsuranceRecordWaiting,
                    ScreenName.InsInsuranceRecordWaitingViewDetail
                ],
                getDataList: (dataBody, payload) => {
                    console.log(dataBody, 'dataBody');
                    return HttpService.Post(
                        '[URI_HR]/Ins_GetData/GetInsuranceRecordList_Portal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.InsInsuranceRecord],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                        UserLoginPortal: dataVnrStorage.currentUser.info.ProfileID
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_InsInsuranceRecordWaiting]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.InsInsuranceRecord,
                    ScreenName.InsInsuranceRecordViewDetail,
                    ScreenName.InsInsuranceRecordWaiting,
                    ScreenName.InsInsuranceRecordWaitingViewDetail
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Ins_GetData/GetInsuranceRecordWaitingList',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.InsInsuranceRecordWaiting],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                        UserLoginPortal: dataVnrStorage.currentUser.info.ProfileID
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_InsSubmitChangeInsInfoRegister]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.InsSubmitChangeInsInfoRegister,
                    ScreenName.InsSubmitChangeInsInfoRegisterViewDetail,
                    ScreenName.InsSubmitChangeInsInfoRegisterAddOrEdit
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Ins_GetData/GetIns_ChangeInsInfoRegisterList',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.InsSubmitChangeInsInfoRegister],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                        UserLoginPortal: dataVnrStorage.currentUser.info.ProfileID
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/generalInfo/Medical]
    [EnumTask.KT_MedImmunization]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.MedImmunization,
                    ScreenName.MedImmunizationAddOrEdit,
                    ScreenName.MedImmunizationViewDetail
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Med_GetData/GetListMedImmunizationRecordPortal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    let _params = {
                        ProfileID: dataVnrStorage.currentUser.info.ProfileID
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_MedAnnualHealth]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.MedAnnualHealth,
                    ScreenName.MedAnnualHealthAddOrEdit,
                    ScreenName.MedAnnualHealthViewDetail
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Med_GetData/GetAnnualHealthListPortal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    let _params = {
                        ProfileID: dataVnrStorage.currentUser.info.ProfileID
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_MedHistoryMedical]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.MedHistoryMedical,
                    ScreenName.MedHistoryMedicalAddOrEdit,
                    ScreenName.MedHistoryMedicalViewDetail
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Med_GetData/GetHistoryMedicalListPortal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    let _params = {
                        ProfileID: dataVnrStorage.currentUser.info.ProfileID
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/other]
    [EnumTask.KT_NewsSlider]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.NewsSlider],
                getDataList: (dataBody, payload) => {
                    console.log(dataBody, 'dataBody');
                    return HttpService.Post(
                        '[URI_HR]/Por_GetData/Get_NewsByDate',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    let _params = {};
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/generalinfo/BankAccount]
    [EnumTask.KT_BankAccountConfirmed]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.BankAccountConfirmed,
                    ScreenName.BankAccountConfirmedViewDetail,
                    ScreenName.BankAccountAddOrEdit
                ],

                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Sal_GetData/GetAccountInforApprovedByProfileIDForApp',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    let _params = {
                        profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_BankAccountConfirm]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.BankAccountConfirm,
                    ScreenName.BankAccountConfirmViewDetail,
                    ScreenName.BankAccountAddOrEdit
                ],

                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Sal_GetData/GetAccountInforUnConfirmByProfileIDForApp',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    let _params = {
                        profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion
    //#region [module/hreProfileCard/HreProfileCard]
    [EnumTask.KT_HreSubmitProfileCard]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.HreSubmitProfileCard,
                    ScreenName.HreSubmitProfileCardViewDetail,
                    ScreenName.HreSubmitProfileCardAddOrEdit
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Por_GetData/Get_ProfileCardListPortal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.HreSubmitProfileCard],
                        orderBy = _configList[EnumName.E_Order],
                        configDetail = ConfigListDetail.value[ScreenName.HreSubmitProfileCard],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'WarningViolation',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel',
                            'Status',
                            'itemStatus',
                            'StatusView'
                            // -- //
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail &&
                        configDetail.length > 0 &&
                        configDetail.forEach(item => {
                            if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                                valueField.push(item.Name);
                            }
                        });

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_HreApproveProfileCard]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.HreApproveProfileCard,
                    ScreenName.HreApproveProfileCardViewDetail,
                    ScreenName.HreApprovedProfileCard
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Por_GetData/Get_ProfileCardListPortal_Approve',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.HreApproveProfileCard],
                        orderBy = _configList[EnumName.E_Order],
                        configDetail = ConfigListDetail.value[ScreenName.HreApproveProfileCard],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'WarningViolation',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel',
                            'Status',
                            'itemStatus',
                            'StatusView'
                            // -- //
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail &&
                        configDetail.length > 0 &&
                        configDetail.forEach(item => {
                            if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                                valueField.push(item.Name);
                            }
                        });

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_HreApprovedProfileCard]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.HreApprovedProfileCard,
                    ScreenName.HreApprovedProfileCardViewDetail,
                    ScreenName.HreApproveProfileCard
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Por_GetData/Get_ProfileCardListPortal_Approved',
                        dataBody,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.HreApprovedProfileCard],
                        orderBy = _configList[EnumName.E_Order],
                        configDetail = ConfigListDetail.value[ScreenName.HreApprovedProfileCard],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'WarningViolation',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel',
                            'Status',
                            'itemStatus',
                            'StatusView'
                            // -- //
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail &&
                        configDetail.length > 0 &&
                        configDetail.forEach(item => {
                            if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                                valueField.push(item.Name);
                            }
                        });

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/gểnalInfo/profileInfo/Qualification]
    [EnumTask.KT_QualificationConfirmed]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.QualificationConfirmed,
                    ScreenName.QualificationWaitConfirmViewDetail,
                    ScreenName.QualificationWaitConfirm
                ],

                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        `[URI_HR]/Hre_GetData/GetQualificationID?profileID=${dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
                        }`,
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.QualificationConfirmed],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        model: {
                            ProfileID: dataVnrStorage.currentUser.info
                                ? dataVnrStorage.currentUser.info.ProfileID
                                : null
                        }
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_QualificationWaitConfirm]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.QualificationWaitConfirm,
                    ScreenName.QualificationWaitConfirmViewDetail,
                    ScreenName.QualificationConfirmed
                ],

                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        `[URI_HR]/Hre_GetData/GetHre_ProfileQualificationByDataStatus?profileID=${dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
                        }`,
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.QualificationWaitConfirm],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        model: {
                            ProfileID: dataVnrStorage.currentUser.info
                                ? dataVnrStorage.currentUser.info.ProfileID
                                : null
                        }
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/gểnalInfo/profileInfo/computerLevel]
    [EnumTask.KT_ComputerLevelConfirmed]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.ComputerLevelConfirmed,
                    ScreenName.ComputerLevelConfirmedViewDetail,
                    ScreenName.ComputerLevelWaitConfirm
                ],

                getDataList: (dataBody, payload) => {
                    console.log(dataBody, 'dataBody');
                    return HttpService.Post(
                        `[URI_HR]/Hre_GetData/GetListComputerLevelByProfileID?profileID=${dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
                        }`,
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.ComputerLevelConfirmed],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                        // model: {
                        //    ProfileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null,
                        // }
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_ComputerLevelWaitConfirm]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.ComputerLevelWaitConfirm,
                    ScreenName.ComputerLevelWaitConfirmViewDetail,
                    ScreenName.ComputerLevelConfirmed
                ],

                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        `[URI_HR]/Hre_GetData/GetHre_ComputerLevel?profileID=${dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
                        }`,
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.ComputerLevelWaitConfirm],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/gểnalInfo/profileInfo/workPermit]
    [EnumTask.KT_WorkPermit]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.WorkPermit, ScreenName.WorkPermitViewDetail],

                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Hre_GetData/GetWorkPermitByProfileIDKaizen',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.WorkPermit],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        model: {
                            ProfileID: dataVnrStorage.currentUser.info
                                ? dataVnrStorage.currentUser.info.ProfileID
                                : null
                        }
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/gểnalInfo/profileInfo/ResidenceCard]
    [EnumTask.KT_ResidenceCard]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.ResidenceCard, ScreenName.ResidenceCardViewDetail],

                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Hre_GetData/GetResidenceCardByModel',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.ResidenceCard],
                        orderBy = _configList[EnumName.E_Order];

                    let _params = {
                        IsPortal: true,
                        sort: orderBy,
                        page: 1,
                        pageSize: 20,
                        model: {
                            ProfileID: dataVnrStorage.currentUser.info
                                ? dataVnrStorage.currentUser.info.ProfileID
                                : null
                        }
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region ContractHistory
    [EnumTask.KT_ContractHistoryAll]: ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.ContractHistoryAll,
                    ScreenName.ContractHistoryAllViewDetail,
                    ScreenName.ContractHistoryConfirmed,
                    ScreenName.ContractHistoryConfirmedViewDetail,
                    ScreenName.ContractHistoryWaitConfirm,
                    ScreenName.ContractHistoryWaitConfirmViewDetail
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_CENTER]/api/Hre_Contract/GetListHistoryContract',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.ContractHistoryAll],
                        filter = _configList[EnumName.E_Filter],
                        configDetail = ConfigListDetail.value[ScreenName.ContractHistoryAllViewDetail],
                        valueField = [
                            'PositionName',
                            'SalaryClassName',
                            'EmployeeTypeName',
                            'WorkPlaceName',
                            'JobTitleName',
                            'OrgStructureName',
                            'DurationView',
                            'StatusEvaView',
                            'NumberExtend',
                            'ContractTypeName',
                            'ProfileID',
                            'ContractNo',
                            'ContractTypeID',
                            'DateSigned',
                            'DateStart',
                            'DateEnd',
                            'TotalRow',
                            'ID'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    if (configDetail)
                        configDetail.forEach(item => {
                            if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                                valueField.push(item.Name);
                            }
                        });

                    let _params = {
                        // sort: orderBy,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_ContractHistoryWaitConfirm]: ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.ContractHistoryAll,
                    ScreenName.ContractHistoryAllViewDetail,
                    ScreenName.ContractHistoryConfirmed,
                    ScreenName.ContractHistoryConfirmedViewDetail,
                    ScreenName.ContractHistoryWaitConfirm,
                    ScreenName.ContractHistoryWaitConfirmViewDetail
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_CENTER]/api/Hre_Contract/GetListHistoryContract',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.ContractHistoryWaitConfirm],
                        filter = _configList[EnumName.E_Filter],
                        configDetail = ConfigListDetail.value[ScreenName.ContractHistoryWaitConfirmViewDetail],
                        valueField = [
                            'PositionName',
                            'SalaryClassName',
                            'EmployeeTypeName',
                            'WorkPlaceName',
                            'JobTitleName',
                            'OrgStructureName',
                            'DurationView',
                            'StatusEvaView',
                            'NumberExtend',
                            'ContractTypeName',
                            'ProfileID',
                            'ContractNo',
                            'ContractTypeID',
                            'DateSigned',
                            'DateStart',
                            'DateEnd',
                            'TotalRow',
                            'ID'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    if (configDetail)
                        configDetail.forEach(item => {
                            if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                                valueField.push(item.Name);
                            }
                        });

                    let _params = {
                        // sort: orderBy,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        StatusEva: 'E_SUBMIT,E_APPROVED1,E_APPROVED2,E_APPROVED3',
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_ContractHistoryConfirmed]: ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.ContractHistoryAll,
                    ScreenName.ContractHistoryAllViewDetail,
                    ScreenName.ContractHistoryConfirmed,
                    ScreenName.ContractHistoryConfirmedViewDetail,
                    ScreenName.ContractHistoryWaitConfirm,
                    ScreenName.ContractHistoryWaitConfirmViewDetail
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_CENTER]/api/Hre_Contract/GetListHistoryContract',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.ContractHistoryConfirmed],
                        filter = _configList[EnumName.E_Filter],
                        configDetail = ConfigListDetail.value[ScreenName.ContractHistoryConfirmedViewDetail],
                        valueField = [
                            'PositionName',
                            'SalaryClassName',
                            'EmployeeTypeName',
                            'WorkPlaceName',
                            'JobTitleName',
                            'OrgStructureName',
                            'DurationView',
                            'StatusEvaView',
                            'NumberExtend',
                            'ContractTypeName',
                            'ProfileID',
                            'ContractNo',
                            'ContractTypeID',
                            'DateSigned',
                            'DateStart',
                            'DateEnd',
                            'TotalRow',
                            'ID'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    if (configDetail)
                        configDetail.forEach(item => {
                            if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                                valueField.push(item.Name);
                            }
                        });

                    let _params = {
                        // sort: orderBy,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        StatusEva: 'E_APPROVED',
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region Hre WorkHistory V3
    [EnumTask.KT_HreWorkHistorySubmit]: ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.HreWorkHistorySubmit],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_CENTER]/api/Hre_WorkHistoryAPI/GetWorkHistoryProfileTimeLine',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.HreWorkHistorySubmit],
                        filter = _configList[EnumName.E_Filter];
                    // configDetail = ConfigListDetail.value[ScreenName.ContractHistoryAllViewDetail],
                    // valueField = ['PositionName', 'SalaryClassName', 'EmployeeTypeName', 'WorkPlaceName', 'JobTitleName', 'OrgStructureName', 'DurationView', 'StatusEvaView', 'NumberExtend', 'ContractTypeName', 'ProfileID', 'ContractNo', 'ContractTypeID', 'DateSigned', 'DateStart', 'DateEnd', 'TotalRow', 'ID'];

                    // // Lấy đúng fields trong màn hình chi tiết.
                    // if (configDetail)
                    //    configDetail.forEach(item => {
                    //       if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                    //          valueField.push(item.Name);
                    //       }
                    //    });

                    let _params = {
                        // sort: orderBy,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ProfileID: dataVnrStorage.currentUser.info.ProfileID
                        // ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/humanResource/hreEvaluationResult]
    [EnumTask.KT_HreEvaluationResult]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [ScreenName.HreEvaluationResult],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Eva_GetData/GetListPerformanceResultForApp',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    let _params = {
                        page: 1,
                        pageSize: 10,
                        take: 10, //lấy 20 item
                        skip: 0,
                        dataSourceRequestString: 'Page=1&PageSize=10'
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region hreWorkManage
    [EnumTask.KT_HreAllWorkBoard]: ({ keyTask, payload }) => {
        handleGetHreWorkBoard({ keyTask, payload });
    },
    [EnumTask.KT_HreDoneWorkBoard]: ({ keyTask, payload }) => {
        handleGetHreWorkBoard({ keyTask, payload });
    },
    [EnumTask.KT_HreWaitWorkBoard]: ({ keyTask, payload }) => {
        handleGetHreWorkBoard({ keyTask, payload });
    },
    [EnumTask.KT_HreAllWorkManage]: ({ keyTask, payload }) => {
        handleGetHreWorkManage({ keyTask, payload });
    },
    [EnumTask.KT_HreDoneWorkManage]: ({ keyTask, payload }) => {
        handleGetHreWorkManage({ keyTask, payload });
    },
    [EnumTask.KT_HreWaitWorkManage]: ({ keyTask, payload }) => {
        handleGetHreWorkManage({ keyTask, payload });
    },
    //#endregion

    //#region [module/humanResource/hrePersonalManage]
    [EnumTask.KT_HreAllPersonalInfoManage]: ({ keyTask, payload }) => {
        handleHrePersonalInfoManage({ keyTask, payload });
    },
    [EnumTask.KT_HreHirePersonalInfoManage]: ({ keyTask, payload }) => {
        handleHrePersonalInfoManage({ keyTask, payload });
    },
    [EnumTask.KT_HreStopPersonalInfoManage]: ({ keyTask, payload }) => {
        handleHrePersonalInfoManage({ keyTask, payload });
    },
    [EnumTask.KT_HreWaitPersonalInfoManage]: ({ keyTask, payload }) => {
        handleHrePersonalInfoManage({ keyTask, payload });
    },

    [EnumTask.KT_HreAllInforContact]: ({ keyTask, payload }) => {
        handleHreInforContactManage({ keyTask, payload });
    },
    [EnumTask.KT_HreHireInforContact]: ({ keyTask, payload }) => {
        handleHreInforContactManage({ keyTask, payload });
    },
    [EnumTask.KT_HreStopInforContact]: ({ keyTask, payload }) => {
        handleHreInforContactManage({ keyTask, payload });
    },
    [EnumTask.KT_HreWaitInforContact]: ({ keyTask, payload }) => {
        handleHreInforContactManage({ keyTask, payload });
    },

    [EnumTask.KT_HreAllPartyAndUnion]: ({ keyTask, payload }) => {
        handleHrePartyAndUnionManage({ keyTask, payload });
    },
    [EnumTask.KT_HreHirePartyAndUnion]: ({ keyTask, payload }) => {
        handleHrePartyAndUnionManage({ keyTask, payload });
    },
    [EnumTask.KT_HreStopPartyAndUnion]: ({ keyTask, payload }) => {
        handleHrePartyAndUnionManage({ keyTask, payload });
    },
    [EnumTask.KT_HreWaitPartyAndUnion]: ({ keyTask, payload }) => {
        handleHrePartyAndUnionManage({ keyTask, payload });
    },

    [EnumTask.KT_HreAllDocumentManage]: ({ keyTask, payload }) => {
        handleHreDocumentManage({ keyTask, payload });
    },
    [EnumTask.KT_HreHireDocumentManage]: ({ keyTask, payload }) => {
        handleHreDocumentManage({ keyTask, payload });
    },
    [EnumTask.KT_HreStopDocumentManage]: ({ keyTask, payload }) => {
        handleHreDocumentManage({ keyTask, payload });
    },
    [EnumTask.KT_HreWaitDocumentManage]: ({ keyTask, payload }) => {
        handleHreDocumentManage({ keyTask, payload });
    },

    [EnumTask.KT_HreAllCandidateHistory]: ({ keyTask, payload }) => {
        handleHreCandidateHistory({ keyTask, payload });
    },
    [EnumTask.KT_HreHireCandidateHistory]: ({ keyTask, payload }) => {
        handleHreCandidateHistory({ keyTask, payload });
    },
    [EnumTask.KT_HreStopCandidateHistory]: ({ keyTask, payload }) => {
        handleHreCandidateHistory({ keyTask, payload });
    },
    [EnumTask.KT_HreWaitCandidateHistory]: ({ keyTask, payload }) => {
        handleHreCandidateHistory({ keyTask, payload });
    },

    [EnumTask.KT_HreAllRelativeManage]: ({ keyTask, payload }) => {
        handleHreRelativeManage({ keyTask, payload });
    },
    [EnumTask.KT_HreHireRelativeManage]: ({ keyTask, payload }) => {
        handleHreRelativeManage({ keyTask, payload });
    },
    [EnumTask.KT_HreStopRelativeManage]: ({ keyTask, payload }) => {
        handleHreRelativeManage({ keyTask, payload });
    },
    [EnumTask.KT_HreWaitRelativeManage]: ({ keyTask, payload }) => {
        handleHreRelativeManage({ keyTask, payload });
    },

    [EnumTask.KT_HreAllCompensationManage]: ({ keyTask, payload }) => {
        handleHreCompensationManage({ keyTask, payload });
    },
    [EnumTask.KT_HreHireCompensationManage]: ({ keyTask, payload }) => {
        handleHreCompensationManage({ keyTask, payload });
    },
    [EnumTask.KT_HreStopCompensationManage]: ({ keyTask, payload }) => {
        handleHreCompensationManage({ keyTask, payload });
    },
    [EnumTask.KT_HreWaitCompensationManage]: ({ keyTask, payload }) => {
        handleHreCompensationManage({ keyTask, payload });
    },

    [EnumTask.KT_HreAllAnnualManage]: ({ keyTask, payload }) => {
        handleHreAnnualManage({ keyTask, payload });
    },
    [EnumTask.KT_HreHireAnnualManage]: ({ keyTask, payload }) => {
        handleHreAnnualManage({ keyTask, payload });
    },
    [EnumTask.KT_HreStopAnnualManage]: ({ keyTask, payload }) => {
        handleHreAnnualManage({ keyTask, payload });
    },
    [EnumTask.KT_HreWaitAnnualManage]: ({ keyTask, payload }) => {
        handleHreAnnualManage({ keyTask, payload });
    },

    [EnumTask.KT_HreAllAccidentManage]: ({ keyTask, payload }) => {
        handleHreAccidentManage({ keyTask, payload });
    },
    [EnumTask.KT_HreHireAccidentManage]: ({ keyTask, payload }) => {
        handleHreAccidentManage({ keyTask, payload });
    },
    [EnumTask.KT_HreStopAccidentManage]: ({ keyTask, payload }) => {
        handleHreAccidentManage({ keyTask, payload });
    },
    [EnumTask.KT_HreWaitAccidentManage]: ({ keyTask, payload }) => {
        handleHreAccidentManage({ keyTask, payload });
    },

    [EnumTask.KT_HreAllRewardManage]: ({ keyTask, payload }) => {
        handleHreRewardManage({ keyTask, payload });
    },
    [EnumTask.KT_HreHireRewardManage]: ({ keyTask, payload }) => {
        handleHreRewardManage({ keyTask, payload });
    },
    [EnumTask.KT_HreStopRewardManage]: ({ keyTask, payload }) => {
        handleHreRewardManage({ keyTask, payload });
    },
    [EnumTask.KT_HreWaitRewardManage]: ({ keyTask, payload }) => {
        handleHreRewardManage({ keyTask, payload });
    },

    // hreInforContact
    [EnumTask.KT_HreAllInforContact]: ({ keyTask, payload }) => {
        handleHreInforContactManage({ keyTask, payload });
    },
    [EnumTask.KT_HreHireInforContact]: ({ keyTask, payload }) => {
        handleHreInforContactManage({ keyTask, payload });
    },
    [EnumTask.KT_HreStopInforKT_HreHireInforContact]: ({ keyTask, payload }) => {
        handleHreInforContactManage({ keyTask, payload });
    },
    [EnumTask.KT_HreWaitInforKT_HreHireInforContact]: ({ keyTask, payload }) => {
        handleHreInforContactManage({ keyTask, payload });
    },

    // hreMovementHistory
    [EnumTask.KT_HreAllMovementHistory]: ({ keyTask, payload }) => {
        handleHreMovementHistory({ keyTask, payload });
    },
    [EnumTask.KT_HreHireMovementHistory]: ({ keyTask, payload }) => {
        handleHreMovementHistory({ keyTask, payload });
    },
    [EnumTask.KT_HreStopMovementHistory]: ({ keyTask, payload }) => {
        handleHreMovementHistory({ keyTask, payload });
    },
    [EnumTask.KT_HreWaitMovementHistory]: ({ keyTask, payload }) => {
        handleHreMovementHistory({ keyTask, payload });
    },

    // hreConcurrentManage
    [EnumTask.KT_HreAllConcurrentManage]: ({ keyTask, payload }) => {
        handleHreConcurrentManage({ keyTask, payload });
    },
    [EnumTask.KT_HreHireConcurrentManage]: ({ keyTask, payload }) => {
        handleHreConcurrentManage({ keyTask, payload });
    },
    [EnumTask.KT_HreStopConcurrentManage]: ({ keyTask, payload }) => {
        handleHreConcurrentManage({ keyTask, payload });
    },
    [EnumTask.KT_HreWaitConcurrentManage]: ({ keyTask, payload }) => {
        handleHreConcurrentManage({ keyTask, payload });
    },

    // hreDisciplineManage
    [EnumTask.KT_HreAllDisciplineManage]: ({ keyTask, payload }) => {
        handleHreDisciplineManage({ keyTask, payload });
    },
    [EnumTask.KT_HreHireDisciplineManage]: ({ keyTask, payload }) => {
        handleHreDisciplineManage({ keyTask, payload });
    },
    [EnumTask.KT_HreStopDisciplineManage]: ({ keyTask, payload }) => {
        handleHreDisciplineManage({ keyTask, payload });
    },
    [EnumTask.KT_HreWaitDisciplineManage]: ({ keyTask, payload }) => {
        handleHreDisciplineManage({ keyTask, payload });
    },

    // hreTaxPayManage
    [EnumTask.KT_HreAllTaxPayManage]: ({ keyTask, payload }) => {
        handleHreTaxPayManage({ keyTask, payload });
    },
    [EnumTask.KT_HreHireTaxPayManage]: ({ keyTask, payload }) => {
        handleHreTaxPayManage({ keyTask, payload });
    },
    [EnumTask.KT_HreStopTaxPayManage]: ({ keyTask, payload }) => {
        handleHreTaxPayManage({ keyTask, payload });
    },
    [EnumTask.KT_HreWaitTaxPayManage]: ({ keyTask, payload }) => {
        handleHreTaxPayManage({ keyTask, payload });
    },

    // hreInsuranceManage
    [EnumTask.KT_HreAllInsuranceManage]: ({ keyTask, payload }) => {
        handleHreInsuranceManage({ keyTask, payload });
    },
    [EnumTask.KT_HreHireInsuranceManage]: ({ keyTask, payload }) => {
        handleHreInsuranceManage({ keyTask, payload });
    },
    [EnumTask.KT_HreStopInsuranceManage]: ({ keyTask, payload }) => {
        handleHreInsuranceManage({ keyTask, payload });
    },
    [EnumTask.KT_HreWaitInsuranceManage]: ({ keyTask, payload }) => {
        handleHreInsuranceManage({ keyTask, payload });
    },
    //#endregion

    //#region [module/humanResource/hreTerminationOfWork]
    // màn hình đăng ký nghỉ việc v3
    [EnumTask.KT_HreSubmitTerminationOfWork]: async ({ keyTask, payload }) => {
        handleGetDataSubmitTerminationOfWork({ keyTask, payload });
    },

    // mành hình duyệt nghỉ việc v3
    [EnumTask.KT_HreApproveTerminationOfWork]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.HreApproveTerminationOfWork,
                    ScreenName.HreApproveTerminationOfWorkViewDetail,
                    ScreenName.HreApprovedTerminationOfWork
                ],
                getDataList: (dataBody, payload) => {
                    console.log(dataBody, 'dataBody');
                    return HttpService.Post(
                        '[URI_CENTER]/api/Hre_StopWorking/New_GetStopWorkingApprovedNewPortal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.HreApproveTerminationOfWork],
                        filter = _configList[EnumName.E_Filter],
                        configDetail = ConfigListDetail.value[ScreenName.HreApproveTerminationOfWork],
                        valueField = [
                            'ID',
                            'ProfileName',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'Status',
                            'ApproveHours',
                            'RegisterHours',
                            'ConfirmHours',
                            'WorkDateRoot',
                            'InTime',
                            'OutTime',
                            'Rate',
                            'RequestCancelStatus',
                            'itemStatusCancel',
                            'itemStatus',
                            'StatusView',
                            'WarningViolation',
                            'ReasonOT',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    if (configDetail) {
                        configDetail.forEach(item => {
                            if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                                valueField.push(item.Name);
                            }
                        });
                    }

                    let _params = {
                        IsPortalNew: true,
                        // sort: orderBy,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_HreApprovedTerminationOfWork]: async ({ keyTask, payload }) => {
        handleGetDataApproveTerminationOfWork({ keyTask, payload });
    },
    [EnumTask.KT_HreRejectTerminationOfWork]: async ({ keyTask, payload }) => {
        handleGetDataApproveTerminationOfWork({ keyTask, payload });
    },
    [EnumTask.KT_HreCanceledTerminationOfWork]: async ({ keyTask, payload }) => {
        handleGetDataApproveTerminationOfWork({ keyTask, payload });
    },
    [EnumTask.KT_HreAllTerminationOfWork]: ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.HreAllTerminationOfWork,
                    ScreenName.HreApproveTerminationOfWorkViewDetail,
                    ScreenName.HreApproveTerminationOfWork
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_CENTER]/api/Hre_StopWorking/New_GetStopWorkingApprovedNewPortal',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.HreApproveTerminationOfWork],
                        filter = _configList[EnumName.E_Filter],
                        configDetail = ConfigListDetail.value[ScreenName.HreApproveTerminationOfWork],
                        valueField = [
                            'ID',
                            'ImagePath',
                            'SalaryClassName',
                            'OrgStructureName',
                            'PositionName',
                            'Status',
                            'ApproveHours',
                            'RegisterHours',
                            'ConfirmHours',
                            'WorkDateRoot',
                            'InTime',
                            'OutTime',
                            'Rate',
                            'RequestCancelStatus',
                            'itemStatusCancel',
                            'itemStatus',
                            'StatusView',
                            'WarningViolation',
                            'ReasonOT',
                            'DateCreate',
                            'DateApprove',
                            'ApprovalDate',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    if (configDetail) {
                        configDetail.forEach(item => {
                            if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                                valueField.push(item.Name);
                            }
                        });
                    }

                    let _params = {
                        IsPortalNew: true,
                        // sort: orderBy,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    // hrePersonalInfoProfileIdentification
    [EnumTask.KT_HreAllPersonalInfoProfileIdentification]: ({ keyTask, payload }) => {
        handleHrePersonalInfoProfileIdentification({ keyTask, payload });
    },
    [EnumTask.KT_HreHirePersonalInfoProfileIdentification]: ({ keyTask, payload }) => {
        handleHrePersonalInfoProfileIdentification({ keyTask, payload });
    },
    [EnumTask.KT_HreStopPersonalInfoProfileIdentification]: ({ keyTask, payload }) => {
        handleHrePersonalInfoProfileIdentification({ keyTask, payload });
    },
    [EnumTask.KT_HreWaitPersonalInfoProfileIdentification]: ({ keyTask, payload }) => {
        handleHrePersonalInfoProfileIdentification({ keyTask, payload });
    },

    // hreEducationLevel
    [EnumTask.KT_HreAllEducationLevel]: ({ keyTask, payload }) => {
        handleHreEducationLevel({ keyTask, payload });
    },
    [EnumTask.KT_HreHireEducationLevel]: ({ keyTask, payload }) => {
        handleHreEducationLevel({ keyTask, payload });
    },
    [EnumTask.KT_HreStopEducationLevel]: ({ keyTask, payload }) => {
        handleHreEducationLevel({ keyTask, payload });
    },
    [EnumTask.KT_HreWaitEducationLevel]: ({ keyTask, payload }) => {
        handleHreEducationLevel({ keyTask, payload });
    },

    // hreContractManage
    [EnumTask.KT_HreAllContractManage]: ({ keyTask, payload }) => {
        handleHreContractManage({ keyTask, payload });
    },
    [EnumTask.KT_HreHireContractManage]: ({ keyTask, payload }) => {
        handleHreContractManage({ keyTask, payload });
    },
    [EnumTask.KT_HreStopContractManage]: ({ keyTask, payload }) => {
        handleHreContractManage({ keyTask, payload });
    },
    [EnumTask.KT_HreWaitContractManage]: ({ keyTask, payload }) => {
        handleHreContractManage({ keyTask, payload });
    },
    //#endregion

    // #region [module/other/generalChart/chOrgChart]
    [EnumTask.KT_ChOrgProfileChart]: ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.ChOrgProfileChart,
                    ScreenName.ChOrgDepartmentChart,
                    ScreenName.ChOrgPositionChart,
                    'TopTabChOrgChart'
                ],
                getDataList: (dataBody) => {
                    let _languageApp = dataVnrStorage.languageApp;
                    return HttpService.MultiRequest([
                        HttpService.Get(`[URI_POR]/new_home/Org_Profile_Mobile_NV?lang=${_languageApp}`),
                        HttpService.Post('[URI_CENTER]/api/Hre_Chart_Hre/Get_Org_ChartHre', dataBody),
                        HttpService.Post('[URI_CENTER]/api/Hre_Chart_Hre/Get_ConfigChart')
                    ]);
                },
                getParamsDefault: () => {
                    let _params = {};
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_ChOrgDepartmentChart]: ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.ChOrgProfileChart,
                    ScreenName.ChOrgDepartmentChart,
                    ScreenName.ChOrgPositionChart,
                    'TopTabChOrgChart'
                ],
                getDataList: (dataBody) => {
                    let _languageApp = dataVnrStorage.languageApp;
                    return HttpService.MultiRequest([
                        HttpService.Get(`[URI_POR]/new_home/Org_Profile_Mobile_PB?lang=${_languageApp}`),
                        HttpService.Post('[URI_CENTER]/api/Hre_Chart_Hre/Get_ChartOrgStructure_Org', dataBody),
                        HttpService.Post('[URI_CENTER]/api/Hre_Chart_Hre/Get_ConfigChart_Org')
                    ]);
                },
                getParamsDefault: () => {
                    let _params = {};
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_ChOrgPositionChart]: ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.ChOrgProfileChart,
                    ScreenName.ChOrgDepartmentChart,
                    ScreenName.ChOrgPositionChart,
                    'TopTabChOrgChart'
                ],
                getDataList: (dataBody) => {
                    let _languageApp = dataVnrStorage.languageApp;
                    return HttpService.MultiRequest([
                        HttpService.Get(`[URI_POR]/new_home/Org_Profile_Mobile_VT?lang=${_languageApp}`),
                        HttpService.Post('[URI_CENTER]/api/Hre_Chart_Hre/GetPlanHeadChart', dataBody),
                        HttpService.Post('[URI_CENTER]/api/Hre_Chart_Hre/Get_ConfigChart_HeadCount')
                    ]);
                },
                getParamsDefault: () => {
                    let _params = {};
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    // hreEvalutionContract
    [EnumTask.KT_HreAllEvalutionContract]: ({ keyTask, payload }) => {
        handleEvalutionContract({ keyTask, payload });
    },
    [EnumTask.KT_HreDoneEvalutionContract]: ({ keyTask, payload }) => {
        handleEvalutionContract({ keyTask, payload });
    },
    [EnumTask.KT_HreWaitEvalutionContract]: ({ keyTask, payload }) => {
        handleEvalutionContract({ keyTask, payload });
    },
    //#endregion

    //#region [module/salaryV3/salPITFinalization]
    // màn hình Ủy quyền quyết toán thuế APP V3
    [EnumTask.KT_SalCanceledSubmitPITFinalization]: async ({ keyTask, payload }) => {
        handleGetDataSalSubmitPITFinalization({ keyTask, payload });
    },
    [EnumTask.KT_SalConfirmedSubmitPITFinalization]: async ({ keyTask, payload }) => {
        handleGetDataSalSubmitPITFinalization({ keyTask, payload });
    },
    [EnumTask.KT_SalRejectedSubmitPITFinalization]: async ({ keyTask, payload }) => {
        handleGetDataSalSubmitPITFinalization({ keyTask, payload });
    },
    [EnumTask.KT_SalSaveTempSubmitPITFinalization]: async ({ keyTask, payload }) => {
        handleGetDataSalSubmitPITFinalization({ keyTask, payload });
    },
    [EnumTask.KT_SalWaitingConfirmSubmitPITFinalization]: async ({ keyTask, payload }) => {
        handleGetDataSalSubmitPITFinalization({ keyTask, payload });
    },
    [EnumTask.KT_SalSubmitPITFinalization]: async ({ keyTask, payload }) => {
        handleGetDataSalSubmitPITFinalization({ keyTask, payload });
    },

    //#endregion

    //#region [module/attendanceV3/attRosterShiftChange]
    // màn hình đăng ký đổi ca
    [EnumTask.KT_AttSubmitShiftChange]: async ({ keyTask, payload }) => {
        handleGetDataSubmitShiftChange({ keyTask, payload });
    },
    [EnumTask.KT_AttSaveTempSubmitShiftChange]: async ({ keyTask, payload }) => {
        handleGetDataSubmitShiftChange({ keyTask, payload });
    },
    [EnumTask.KT_AttCanceledSubmitShiftChange]: async ({ keyTask, payload }) => {
        handleGetDataSubmitShiftChange({ keyTask, payload });
    },
    [EnumTask.KT_AttApproveSubmitShiftChange]: async ({ keyTask, payload }) => {
        handleGetDataSubmitShiftChange({ keyTask, payload });
    },
    [EnumTask.KT_AttApprovedSubmitShiftChange]: async ({ keyTask, payload }) => {
        handleGetDataSubmitShiftChange({ keyTask, payload });
    },
    [EnumTask.KT_AttRejectSubmitShiftChange]: async ({ keyTask, payload }) => {
        handleGetDataSubmitShiftChange({ keyTask, payload });
    },

    [EnumTask.KT_AttApproveShiftChange]: async ({ keyTask, payload }) => {
        handleGetDataApproveShiftChange({ keyTask, payload });
    },
    [EnumTask.KT_AttApprovedShiftChange]: async ({ keyTask, payload }) => {
        handleGetDataApproveShiftChange({ keyTask, payload });
    },
    [EnumTask.KT_AttRejectShiftChange]: async ({ keyTask, payload }) => {
        handleGetDataApproveShiftChange({ keyTask, payload });
    },
    [EnumTask.KT_AttCanceledShiftChange]: async ({ keyTask, payload }) => {
        handleGetDataApproveShiftChange({ keyTask, payload });
    },
    [EnumTask.KT_AttAllTakeShiftChange]: async ({ keyTask, payload }) => {
        handleGetDataApproveShiftChange({ keyTask, payload });
    },
    //#endregion

    //#region [module/HumanResourceV3/RecruitmentProposalProcessing]
    // màn hình Xử lý đề xuất bổ sung nhân sự
    [EnumTask.KT_HreWaitRecruitmentProposalProcessing]: async ({ keyTask, payload }) => {
        handleGetDataRecruitmentProposalProcessing({ keyTask, payload });
    },
    [EnumTask.KT_HreDoneRecruitmentProposalProcessing]: async ({ keyTask, payload }) => {
        handleGetDataRecruitmentProposalProcessing({ keyTask, payload });
    },

    // mành hình duyệt đổi ca
    // [EnumTask.KT_AttApproveWorkingOvertime]: async ({ keyTask, payload }) => {
    //     try {
    //         const api = {
    //             taskNameScreen: [
    //                 ScreenName.AttApproveWorkingOvertime,
    //                 ScreenName.AttApproveWorkingOvertimeViewDetail,
    //                 ScreenName.AttApprovedWorkingOvertime
    //             ],
    //             getDataList: (dataBody, payload) => {
    //                 return HttpService.Post(
    //                     '[URI_CENTER]/api/Att_OvertimePlan/New_PlanOvertimeApproveByFilterHandle_App',
    //                     dataBody,
    //                     null,
    //                     payload.reload ? payload.reload : null
    //                 );
    //             },
    //             getParamsDefault: () => {
    //                 const _configList = ConfigList.value[ScreenName.AttApproveWorkingOvertime],
    //                     filter = _configList[EnumName.E_Filter],
    //                     configDetail = ConfigListDetail.value[ScreenName.AttApproveWorkingOvertime],
    //                     valueField = [
    //                         'ID',
    //                         'ImagePath',
    //                         'SalaryClassName',
    //                         'OrgStructureName',
    //                         'PositionName',
    //                         'Status',
    //                         'ApproveHours',
    //                         'RegisterHours',
    //                         'ConfirmHours',
    //                         'WorkDateRoot',
    //                         'InTime',
    //                         'OutTime',
    //                         'Rate',
    //                         'RequestCancelStatus',
    //                         'itemStatusCancel',
    //                         'itemStatus',
    //                         'StatusView',
    //                         'WarningViolation',
    //                         'ReasonOT',
    //                         'DateCreate',
    //                         'DateApprove',
    //                         'ApprovalDate',
    //                         'DateUpdate',
    //                         'DateReject',
    //                         'DateCancel'
    //                     ];

    //                 // Lấy đúng fields trong màn hình chi tiết.
    //                 configDetail.forEach(item => {
    //                     if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
    //                         valueField.push(item.Name);
    //                     }
    //                 });

    //                 let _params = {
    //                     IsPortalNew: true,
    //                     // sort: orderBy,
    //                     filter: filter,
    //                     page: 1,
    //                     pageSize: 20,
    //                     take: 20,
    //                     skip: 0,
    //                     group: [],
    //                     dataSourceRequestString: 'page=1&pageSize=20',
    //                     ValueFields: valueField.join(',')
    //                 };
    //                 return _params;
    //             }
    //         };
    //         handleDataListModuleCommon(api, keyTask, payload);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // },
    // [EnumTask.KT_AttApprovedWorkingOvertime]: async ({ keyTask, payload }) => {
    //     handleGetDataApproveWorkingOvertime({ keyTask, payload });
    // },
    // [EnumTask.KT_AttRejectWorkingOvertime]: async ({ keyTask, payload }) => {
    //     handleGetDataApproveWorkingOvertime({ keyTask, payload });
    // },
    // [EnumTask.KT_AttCanceledWorkingOvertime]: async ({ keyTask, payload }) => {
    //     handleGetDataApproveWorkingOvertime({ keyTask, payload });
    // },
    // [EnumTask.KT_AttAllWorkingOvertime]: ({ keyTask, payload }) => {
    //     try {
    //         const api = {
    //             taskNameScreen: [
    //                 ScreenName.AttAllWorkingOvertime,
    //                 ScreenName.AttApproveWorkingOvertimeViewDetail,
    //                 ScreenName.AttApproveWorkingOvertime
    //             ],
    //             getDataList: (dataBody, payload) => {
    //                 return HttpService.Post(
    //                     '[URI_CENTER]/api/Att_OvertimePlan/New_PlanOvertimeApproveAndAfterBrowsing_App',
    //                     dataBody,
    //                     null,
    //                     payload.reload ? payload.reload : null
    //                 );
    //             },
    //             getParamsDefault: () => {
    //                 const _configList = ConfigList.value[ScreenName.AttApproveWorkingOvertime],
    //                     filter = _configList[EnumName.E_Filter],
    //                     configDetail = ConfigListDetail.value[ScreenName.AttApproveWorkingOvertime],
    //                     valueField = [
    //                         'ID',
    //                         'ImagePath',
    //                         'SalaryClassName',
    //                         'OrgStructureName',
    //                         'PositionName',
    //                         'Status',
    //                         'ApproveHours',
    //                         'RegisterHours',
    //                         'ConfirmHours',
    //                         'WorkDateRoot',
    //                         'InTime',
    //                         'OutTime',
    //                         'Rate',
    //                         'RequestCancelStatus',
    //                         'itemStatusCancel',
    //                         'itemStatus',
    //                         'StatusView',
    //                         'WarningViolation',
    //                         'ReasonOT',
    //                         'DateCreate',
    //                         'DateApprove',
    //                         'ApprovalDate',
    //                         'DateUpdate',
    //                         'DateReject',
    //                         'DateCancel'
    //                     ];

    //                 // Lấy đúng fields trong màn hình chi tiết.
    //                 configDetail.forEach(item => {
    //                     if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
    //                         valueField.push(item.Name);
    //                     }
    //                 });

    //                 let _params = {
    //                     IsPortalNew: true,
    //                     // sort: orderBy,
    //                     filter: filter,
    //                     page: 1,
    //                     pageSize: 20,
    //                     take: 20,
    //                     skip: 0,
    //                     group: [],
    //                     dataSourceRequestString: 'page=1&pageSize=20',
    //                     ValueFields: valueField.join(',')
    //                 };
    //                 return _params;
    //             }
    //         };
    //         handleDataListModuleCommon(api, keyTask, payload);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    //#endregion

    //#region [module/attendance/attSubmitTakeDailyTask]
    // màn hình đăng ký công việc hằng ngày
    [EnumTask.KT_AttSubmitTakeDailyTask]: async ({ keyTask, payload }) => {
        handleGetDataSubmitTakeDailyTask({ keyTask, payload });
    },
    [EnumTask.KT_AttSaveTempSubmitTakeDailyTask]: async ({ keyTask, payload }) => {
        handleGetDataSubmitTakeDailyTask({ keyTask, payload });
    },
    [EnumTask.KT_AttCanceledSubmitTakeDailyTask]: async ({ keyTask, payload }) => {
        handleGetDataSubmitTakeDailyTask({ keyTask, payload });
    },
    [EnumTask.KT_AttApproveSubmitTakeDailyTask]: async ({ keyTask, payload }) => {
        handleGetDataSubmitTakeDailyTask({ keyTask, payload });
    },
    [EnumTask.KT_AttApprovedSubmitTakeDailyTask]: async ({ keyTask, payload }) => {
        handleGetDataSubmitTakeDailyTask({ keyTask, payload });
    },
    [EnumTask.KT_AttRejectSubmitTakeDailyTask]: async ({ keyTask, payload }) => {
        handleGetDataSubmitTakeDailyTask({ keyTask, payload });
    },

    // mành hình duyệt công việc hằng ngày
    [EnumTask.KT_AttApproveTakeDailyTask]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttApproveTakeDailyTask,
                    ScreenName.AttApproveTakeDailyTaskViewDetail,
                    ScreenName.AttApprovedTakeDailyTask
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_CENTER]/api/Att_Roster/New_GetProfileTimeSheetByUserProcess',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveTakeDailyTask],
                        filter = _configList[EnumName.E_Filter],
                        configDetail = ConfigListDetail.value[ScreenName.AttApproveTakeDailyTask],
                        valueField = [
                            'ID',
                            'ProfileName',
                            'Status',
                            'ApproveHours',
                            'JobTypeName',
                            'OrgStructureTransName',
                            'ShopTransName',
                            'OvertimeTypeID1Name',
                            'OvertimeTypeID2Name',
                            'OvertimeTypeID3Name',
                            'Note',
                            'WorkDate',
                            'RequestCancelStatus',
                            'itemStatusCancel',
                            'itemStatus',
                            'StatusView',
                            'WarningViolation',
                            'DateCreate',
                            'DateApprove',
                            'CurrentApprover',
                            'DateUpdate',
                            'DateReject',
                            'DateCancel'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortalNew: true,
                        // sort: orderBy,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttApprovedTakeDailyTask]: async ({ keyTask, payload }) => {
        handleGetDataApproveTakeDailyTask({ keyTask, payload });
    },
    [EnumTask.KT_AttRejectTakeDailyTask]: async ({ keyTask, payload }) => {
        handleGetDataApproveTakeDailyTask({ keyTask, payload });
    },
    [EnumTask.KT_AttCanceledTakeDailyTask]: async ({ keyTask, payload }) => {
        handleGetDataApproveTakeDailyTask({ keyTask, payload });
    },
    //#endregion

    //#region [module/attV3/AttLeaveDayReplacement]
    [EnumTask.KT_AttWaitConfirmLeaveDayReplacement]: ({ keyTask, payload }) => {
        handleGetDataWaitConfirmAttLeaveDayReplacement({ keyTask, payload });
    },
    [EnumTask.KT_AttConfirmedLeaveDayReplacement]: ({ keyTask, payload }) => {
        handleGetDataConfirmedAttLeaveDayReplacement({ keyTask, payload });
    },
    //#endregion

    //#region [module/humanResourceV3/hreInterview]
    // Lịch tuyển dụng
    [EnumTask.KT_HreInterviewCalendar]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.HreInterviewCalendar,
                    ScreenName.HreInterviewCalendar, ScreenName.HreWaitingInterview,
                    ScreenName.HreCandidateInterview, ScreenName.HreResultInterviewViewDetail
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_CENTER]/api/Rec_InterviewSchedule/GetInterviewShedule',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    let _params = {
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_HreWaitingInterview]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.HreInterviewCalendar,
                    ScreenName.HreInterviewCalendar, ScreenName.HreWaitingInterview,
                    ScreenName.HreCandidateInterview, ScreenName.HreResultInterviewViewDetail,
                    ScreenName.HreCompletedInterview
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_CENTER]/api/Rec_Interview/New_GetWaitInterviewByFilterHandle',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    let _params = {
                        IsEvaluated: false
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_HreCompletedInterview]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.HreInterviewCalendar,
                    ScreenName.HreInterviewCalendar, ScreenName.HreWaitingInterview,
                    ScreenName.HreCandidateInterview, ScreenName.HreResultInterviewViewDetail,
                    ScreenName.HreCompletedInterview
                ],
                getDataList: (dataBody, payload) => {

                    return HttpService.Post(
                        '[URI_CENTER]/api/Rec_Interview/New_GetWaitInterviewByFilterHandle',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    let _params = {
                        IsEvaluated: true
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    //#endregion

    //#region [module/humanResourceV3/hreRecruitment/hreApproveRecruitmentProposal]
    [EnumTask.KT_HrePendingApproveRecruitmentProposal]: ({ keyTask, payload }) => {
        handleGetDataApproveRecruitmentProposal({ keyTask, payload });
    },
    [EnumTask.KT_HreProcesedApproveRecruitmentProposal]: ({ keyTask, payload }) => {
        handleGetDataApproveRecruitmentProposal({ keyTask, payload });
    },
    //#endregion

    //#region [module/humanResourceV3/hreRecruitment/hreReceiveJob]
    [EnumTask.KT_HreWaitingReceiveJob]: ({ keyTask, payload }) => {
        handleGetDataReceiveJob({ keyTask, payload });
    },
    [EnumTask.KT_HreProcesedProcessingCandidateApplications]: ({ keyTask, payload }) => {
        handleGetDataProcessingCandidateApplications({ keyTask, payload });
    },
    //#endregion

    //#region [module/humanResourceV3/hreRecruitment/hreProcessingCandidateApplications]
    [EnumTask.KT_HreCandidateProfile]: ({ keyTask, payload }) => {
        handleGetDataCandidateProfile({ keyTask, payload });
    },
    //#endregion

    //#region [module/humanResourceV3/hreRecruitment/hreReceiveJob]
    [EnumTask.KT_HreWaitingReceiveJob]: ({ keyTask, payload }) => {
        handleGetDataReceiveJob({ keyTask, payload });
    },
    [EnumTask.KT_HreProcesedProcessingCandidateApplications]: ({ keyTask, payload }) => {
        handleGetDataProcessingCandidateApplications({ keyTask, payload });
    },
    //#endregion

    //#region [module/humanResourceV3/hreRecruitment/hreReceiveJob]
    [EnumTask.KT_HreWaitingReceiveJob]: ({ keyTask, payload }) => {
        handleGetDataReceiveJob({ keyTask, payload });
    },
    [EnumTask.KT_HreRefuseReceiveJob]: ({ keyTask, payload }) => {
        handleGetDataReceiveJob({ keyTask, payload });
    },
    //#endregion

    //#region [module/HumanResourceV3/ProcessingPostingPlan]
    // màn hình Xử lý đề xuất bổ sung nhân sự
    [EnumTask.KT_HreWaitProcessingPostingPlan]: async ({ keyTask, payload }) => {
        handleGetDataProcessingPostingPlan({ keyTask, payload });
    },
    [EnumTask.KT_HreDoneProcessingPostingPlan]: async ({ keyTask, payload }) => {
        handleGetDataProcessingPostingPlan({ keyTask, payload });
    },

    //#region [module/humanResourceV3/hreRecruitment/hreJobPosting]
    [EnumTask.KT_HreInProcessJobPosting]: ({ keyTask, payload }) => {
        handleGetDataJobPosting({ keyTask, payload });
    },
    [EnumTask.KT_HreOutDateJobPosting]: ({ keyTask, payload }) => {
        handleGetDataJobPosting({ keyTask, payload });
    },
    [EnumTask.KT_HreStopJobPosting]: ({ keyTask, payload }) => {
        handleGetDataJobPosting({ keyTask, payload });
    },
    //#endregion

    //#region [module/humanResourceV3/attDelegationApproval]
    [EnumTask.KT_AttSubmitDelegationApproval]: ({ keyTask, payload }) => {
        handleGetDataDelegationApproval({ keyTask, payload });
    },
    [EnumTask.KT_AttWaitConfirmSubmitDelegationApproval]: ({ keyTask, payload }) => {
        handleGetDataDelegationApproval({ keyTask, payload });
    },
    [EnumTask.KT_AttRejectSubmitDelegationApproval]: ({ keyTask, payload }) => {
        handleGetDataDelegationApproval({ keyTask, payload });
    },
    [EnumTask.KT_AttConfirmedSubmitDelegationApproval]: ({ keyTask, payload }) => {
        handleGetDataDelegationApproval({ keyTask, payload });
    },
    [EnumTask.KT_AttCanceledSubmitDelegationApproval]: ({ keyTask, payload }) => {
        handleGetDataDelegationApproval({ keyTask, payload });
    },
    //#endregion

    // mành hình xác nhận ủy quyền duyệt
    [EnumTask.KT_AttConfirmDelegationApproval]: async ({ keyTask, payload }) => {
        try {
            const api = {
                taskNameScreen: [
                    ScreenName.AttConfirmDelegationApproval,
                    ScreenName.AttConfirmDelegationApprovalViewDetail,
                    ScreenName.AttConfirmedDelegationApproval
                ],
                getDataList: (dataBody, payload) => {
                    return HttpService.Post(
                        '[URI_HR]/Sys_GetData/GetSysDelegateApproveConfirmationWaitting',
                        dataBody,
                        null,
                        payload.reload ? payload.reload : null
                    );
                },
                getParamsDefault: () => {
                    const _configList = ConfigList.value[ScreenName.AttApproveTakeDailyTask],
                        filter = _configList[EnumName.E_Filter],
                        configDetail = ConfigListDetail.value[ScreenName.AttApproveTakeDailyTask],
                        valueField = [
                            'ID',
                            'UserName',
                            'DataTypeDelegateView',
                            'DateFrom',
                            'DateTo',
                            'ProfileName',
                            'Status',
                            'Note',
                            'StatusView',
                            'UserDelegateName'
                        ];

                    // Lấy đúng fields trong màn hình chi tiết.
                    configDetail.forEach(item => {
                        if (item.Name && valueField.findIndex(e => e == item.Name) < 0) {
                            valueField.push(item.Name);
                        }
                    });

                    let _params = {
                        IsPortalNew: true,
                        // sort: orderBy,
                        filter: filter,
                        page: 1,
                        pageSize: 20,
                        take: 20,
                        skip: 0,
                        group: [],
                        dataSourceRequestString: 'page=1&pageSize=20',
                        ValueFields: valueField.join(',')
                    };
                    return _params;
                }
            };
            handleDataListModuleCommon(api, keyTask, payload);
        } catch (error) {
            console.log(error);
        }
    },
    [EnumTask.KT_AttConfirmedDelegationApproval]: async ({ keyTask, payload }) => {
        handleGetDataConfirmDelegationApproval({ keyTask, payload });
    },
    [EnumTask.KT_AttRejectDelegationApproval]: async ({ keyTask, payload }) => {
        handleGetDataConfirmDelegationApproval({ keyTask, payload });
    },
    [EnumTask.KT_AttCanceledDelegationApproval]: async ({ keyTask, payload }) => {
        handleGetDataConfirmDelegationApproval({ keyTask, payload });
    },
    //#endregion

    //#region [module/AttV3/AttLeaveFundManageViewDetail]
    [EnumTask.KT_AttLeaveFundSeniorBonusViewDetail]: async ({ keyTask, payload }) => {
        handleGetDataLeaveFundSeniorBonusViewDetail({ keyTask, payload });
    },
    [EnumTask.KT_AttLeaveFundCompensatoryViewDetail]: async ({ keyTask, payload }) => {
        handleGetDataLeaveFundCompensatoryViewDetail({ keyTask, payload });
    },
    //#endregion

    //#region [module/humanResourceV3/attConfirmShiftChange]
    [EnumTask.KT_AttWaitConfirmShiftChange]: ({ keyTask, payload }) => {
        handleGetDataConfirmAttConfirmShiftChange({ keyTask, payload });
    },
    [EnumTask.KT_AttConfirmedShiftChange]: ({ keyTask, payload }) => {
        handleGetDataConfirmAttConfirmShiftChange({ keyTask, payload });
    },
    [EnumTask.KT_AttRejectedShiftChange]: ({ keyTask, payload }) => {
        handleGetDataConfirmAttConfirmShiftChange({ keyTask, payload });
    }
};
