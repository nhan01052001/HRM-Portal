import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import EvaPerformanceQuicklyTargetList from './avaPerformanceQuicklyTargetList/EvaPerformanceQuicklyTargetList';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { styleSheets, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { TaskBusinessFunction } from '../EvaPerformanceQuickly';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { ScreenName, EnumName, EnumIcon } from '../../../../../assets/constant';
import { translate } from '../../../../../i18n/translate';
import DrawerServices from '../../../../../utils/DrawerServices';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../utils/HttpService';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../components/Alert/Alert';

export default class EvaPerformanceQuicklyTarget extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            dataBody: null
        };
        this.storeParamsDefault = null;
        //biến lưu lại object filter
        this.paramsFilter = null;

        porps.navigation.setParams({ reload: () => this.reload() });
        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // reload danh sách khi có edit hoặc delete dữ liệu
            if (TaskBusinessFunction.checkForLoadEditDelete[ScreenName.EvaPerformanceQuicklyTarget]) {
                TaskBusinessFunction.checkForLoadEditDelete[ScreenName.EvaPerformanceQuicklyTarget] = false;
                this.reload();
            }
        });
    }

    paramsDefault = () => {
        let _params = {
            UserSubmit: dataVnrStorage.currentUser.info.ProfileID,
            GroupBy: 'KPIID' //ProfileID || KPIID
        };
        return {
            dataBody: _params
        };
    };

    reload = (paramsFilter) => {
        if (paramsFilter === 'E_KEEP_FILTER') {
            paramsFilter = { ...this.paramsFilter };
        } else {
            this.paramsFilter = { ...paramsFilter };
        }

        let _paramsDefault = this.storeParamsDefault;
        _paramsDefault = {
            ..._paramsDefault,
            dataBody: { ..._paramsDefault.dataBody, ...paramsFilter }
        };
        this.setState(_paramsDefault);
    };

    componentDidMount() {
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    businessEdit = (itemEdit) => {
        if (itemEdit && itemEdit.listPerformanceQuicklyModel && itemEdit.listPerformanceQuicklyModel.length == 0) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else if (
            itemEdit &&
            itemEdit.listPerformanceQuicklyModel &&
            itemEdit.listPerformanceQuicklyModel.length > 0
        ) {
            let selectedID = itemEdit.listPerformanceQuicklyModel.map((item) => item.ID);
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Eva_GetData/CheckValidateEditBulk', {
                selectedIds: selectedID,
                userLogin: dataVnrStorage.currentUser.headers.userlogin
            }).then((res) => {
                VnrLoadingSevices.hide();
                try {
                    if (res && res.success && res.data) {
                        //dữ liệu hợp lệ
                        DrawerServices.navigate('EvaPerformanceQuicklyTargetEdit', {
                            dataRecord: res.data[0],
                            listdataEdit: itemEdit.listPerformanceQuicklyModel,
                            reloadList: this.reload
                        });
                    }
                    //dữ liệu khong hop le
                    else if (res && res.messageNotify && typeof res.messageNotify) {
                        ToasterSevice.showWarning(res.messageNotify, 4000);
                    }
                    //FAIL
                    else {
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
    };

    //#region [Delete Target]
    businessDeleteRecords = (itemEdit) => {
        if (itemEdit && itemEdit.listPerformanceQuicklyModel && itemEdit.listPerformanceQuicklyModel.length == 0) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else if (
            itemEdit &&
            itemEdit.listPerformanceQuicklyModel &&
            itemEdit.listPerformanceQuicklyModel.length > 0
        ) {
            let selectedID = itemEdit.listPerformanceQuicklyModel.map((item) => item.ID),
                lengthItemDelete = selectedID.length;
            AlertSevice.alert({
                iconType: EnumIcon.E_DELETE,
                message: `${translate('AreYouSureYouWantToDelete')} ${lengthItemDelete} ${translate(
                    'SelectedDataLines'
                )}`,
                onCancel: () => {},
                onConfirm: () => {
                    this.checkingDataWorkingForTaskDelete(selectedID);
                }
            });
        }
    };

    checkingDataWorkingForTaskDelete = (selectedID) => {
        if (Array.isArray(selectedID) && selectedID.length > 0) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_POR]/New_PerformanceQuickly/RemoveSelected', {
                selectedIds: selectedID,
                userLogin: dataVnrStorage.currentUser.headers.userlogin
            }).then((res) => {
                VnrLoadingSevices.hide();
                try {
                    if (res && res === 'Success') {
                        // reload các màn hinh liên quan
                        TaskBusinessFunction.checkForLoadEditDelete = {
                            [ScreenName.EvaPerformanceQuicklyTarget]: false,
                            [ScreenName.EvaPerformanceQuicklyProfile]: true
                        };
                        DrawerServices.navigate('EvaPerformanceQuicklyTarget');
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        this.reload();
                    } else {
                        ToasterSevice.showError('Hrm_Fail', 4000);
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
    };

    //#endregion

    render() {
        const { dataBody } = this.state,
            _rowActions = [
                {
                    title: translate('HRM_System_Resource_Sys_Edit'),
                    type: EnumName.E_MODIFY_SERIES,
                    onPress: (item, dataBody) => this.businessEdit(item, dataBody)
                },
                {
                    title: translate('HRM_Common_Delete'),
                    type: EnumName.E_DELETE,
                    onPress: (item, dataBody) => this.businessDeleteRecords(item, dataBody)
                }
            ];
        // _selected = [
        //     {
        //         title: translate('HRM_System_Resource_Sys_Edit'),
        //         type: EnumName.E_MODIFY,
        //         onPress: (items, dataBody) => this.businessEdit(items, dataBody),
        //     }
        // ];
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>
                    <VnrFilterCommon
                        screenName={ScreenName.EvaPerformanceQuicklyTarget}
                        onSubmitEditing={this.reload}
                    />
                    <View style={[styleSheets.col_10]}>
                        {dataBody && (
                            <EvaPerformanceQuicklyTargetList
                                api={{
                                    urlApi: '[URI_HR]/Eva_GetData/GetEvaPerformanceQuicklyList_PortalAppMobile',
                                    type: 'E_POST',
                                    dataBody: dataBody
                                }}
                                detail={{
                                    dataLocal: false,
                                    screenName: ScreenName.EvaPerformanceQuicklyTarget
                                    //screenDetail: ScreenName.EvaPerformanceQuicklyTargetDetail,
                                }}
                                valueField="ID"
                                rowActions={_rowActions}
                                // selected={_selected}
                            />
                        )}
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
