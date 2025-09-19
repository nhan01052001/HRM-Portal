import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import moment from 'moment';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    styleProfileInfo
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import EvaPerformanceQuicklyTargetDetailList from './evaPerformanceQuicklyTargetDetailList/EvaPerformanceQuicklyTargetDetailList';
import { translate } from '../../../../../i18n/translate';
import { EnumName, EnumIcon, ScreenName } from '../../../../../assets/constant';
import EvaModalEditTarger from './EvaModalEditTarger';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../utils/HttpService';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../utils/DrawerServices';
import { TaskBusinessFunction } from '../EvaPerformanceQuickly';
import ButtonGoBack from '../../../../../components/buttonGoBack/buttonGoBack';
export default class EvaPerformanceQuicklyProfileEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            listTargetEdit: null,
            dataRowTouch: null,
            modalEditVisible: false,
            dataRecordEdit: null,
            isRefreshList: false
        };
    }

    getDataItem = () => {
        try {
            const _params = this.props.navigation.state.params,
                { listdataEdit } = typeof _params == 'object' ? _params : JSON.parse(_params);

            if (listdataEdit && listdataEdit[0]) {
                this.setState({
                    dataItem: listdataEdit[0],
                    listTargetEdit: listdataEdit
                });
            } else {
                this.setState({ dataItem: EnumName.E_EMPTYDATA });
            }
        } catch (error) {
            this.setState({ dataItem: EnumName.E_EMPTYDATA });
        }
    };

    componentDidMount() {
        this.getDataItem();
    }

    reload = () => {
        try {
            const { listTargetEdit } = this.state,
                _params = this.props.navigation.state.params,
                { reloadList } = typeof _params == 'object' ? _params : JSON.parse(_params);

            if (listTargetEdit) {
                this.setState({ listTargetEdit: null });

                let selectedID = listTargetEdit.map((item) => item.ID);
                HttpService.Post('[URI_HR]/Eva_GetData/CheckValidateEditCriteria', {
                    selectedIds: selectedID,
                    userLogin: dataVnrStorage.currentUser.headers.userlogin
                }).then((res) => {
                    try {
                        if (res && res.success) {
                            // reload các màn hinh liên quan
                            TaskBusinessFunction.checkForLoadEditDelete = {
                                [ScreenName.EvaPerformanceQuicklyTarget]: true,
                                [ScreenName.EvaPerformanceQuicklyProfile]: false
                            };
                            // reload Danh sach Danh gia nhanh
                            typeof reloadList === 'function' && reloadList();
                            //set goBak header về lại danh sách
                            this.props.navigation.setParams({
                                headerLeft: (
                                    <ButtonGoBack
                                        gobackFunction={() =>
                                            DrawerServices.navigate(ScreenName.EvaPerformanceQuicklyProfile)
                                        }
                                    />
                                )
                            });
                            //dữ liệu hợp lệ
                            this.setState({ listTargetEdit: res.data, isRefreshList: !this.state.isRefreshList });
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
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    hideModalMore = () => {
        this.setState({ dataRowTouch: null });
    };

    //#region [Delete Target]
    businessDeleteRecords = (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map((item) => item.ID),
                lengthItemDelete = selectedID.length;
            AlertSevice.alert({
                iconType: EnumIcon.E_DELETE,
                message: `${translate('AreYouSureYouWantToDelete')} ${lengthItemDelete} ${translate(
                    'SelectedDataLines'
                )}`,
                onCancel: () => {},
                onConfirm: () => {
                    this.checkingDataWorkingForTaskDelete(selectedID, items);
                }
            });
        }
    };

    checkingDataWorkingForTaskDelete = (selectedID, items) => {
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
                            [ScreenName.EvaPerformanceQuicklyTarget]: true,
                            [ScreenName.EvaPerformanceQuicklyProfile]: false
                        };
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        this.reloadForRemove(items);
                    } else {
                        ToasterSevice.showError('Hrm_Fail', 4000);
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
    };

    reloadForRemove = (_listDataRemove) => {
        try {
            const _params = this.props.navigation.state.params,
                { reloadList } = typeof _params == 'object' ? _params : JSON.parse(_params);
            let { listTargetEdit } = this.state;
            if (_listDataRemove && Array.isArray(_listDataRemove)) {
                _listDataRemove.map((itemRm) => {
                    listTargetEdit = Vnr_Function.removeObjectInArray(listTargetEdit, itemRm, 'ID');
                });

                if (listTargetEdit.length == 0) {
                    DrawerServices.navigate('EvaPerformanceQuicklyProfile');
                } else {
                    this.setState({ listTargetEdit, isRefreshList: !this.state.isRefreshList });
                }
                // reload Danh sach Danh gia nhanh
                typeof reloadList === 'function' && reloadList();
            }
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };
    //#endregion

    //#region [edit Target]
    businessEdit = (_dataRecordEdit) => {
        this.setState({ dataRecordEdit: _dataRecordEdit, modalEditVisible: true });
    };

    hideModalEdit = () => {
        this.setState({ dataRecordEdit: null, modalEditVisible: false });
    };
    //#endregion
    render() {
        const { dataItem, listTargetEdit, modalEditVisible, dataRecordEdit, isRefreshList } = this.state,
            { itemContent, containerItemDetail, textLableInfo } = styleScreenDetail,
            _rowActions = [
                {
                    title: translate('HRM_System_Resource_Sys_Edit'),
                    type: EnumName.E_MODIFY,
                    onPress: (item, dataBody) => this.businessEdit(item, dataBody)
                },
                {
                    title: translate('HRM_Common_Delete'),
                    type: EnumName.E_DELETE,
                    onPress: (item, dataBody) => this.businessDeleteRecords([{ ...item }], dataBody)
                }
            ];

        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && listTargetEdit) {
            contentViewDetail = (
                <View style={[styleSheets.col_10]}>
                    <ScrollView>
                        {/* <View style={styles.viewUpdate}> */}
                        <View style={styleProfileInfo.styleViewTitleGroup}>
                            <VnrText
                                style={[styleSheets.text, styleProfileInfo.textLableGroup]}
                                i18nKey={'HRM_HR_Contract_EvaContractInfo'}
                            />
                        </View>
                        <View style={containerItemDetail}>
                            <View style={itemContent}>
                                <View style={styleSheets.viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Tas_Task_Evaluationdate'}
                                    />
                                </View>
                                <View style={styleSheets.viewControl}>
                                    <Text style={styleSheets.text}>
                                        {moment(dataItem.DateEvaluation).format('DD/MM/YYYY')}
                                    </Text>
                                </View>
                            </View>
                            <View style={itemContent}>
                                <View style={styleSheets.viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'ProfileName'} />
                                </View>
                                <View style={styleSheets.viewControl}>
                                    <VnrText style={[styleSheets.text]} value={dataItem.ProfileName} />
                                </View>
                            </View>
                        </View>
                        {/* {this.generateEditTarget(listTargetEdit)} */}

                        <EvaPerformanceQuicklyTargetDetailList
                            isRefreshList={isRefreshList}
                            dataLocal={listTargetEdit}
                            valueField="ID"
                            rowActions={_rowActions}
                        />
                        {dataRecordEdit && (
                            <EvaModalEditTarger
                                reload={this.reload}
                                dataRecord={dataRecordEdit}
                                modalEditVisible={modalEditVisible}
                                hideModalEdit={this.hideModalEdit}
                            />
                        )}
                    </ScrollView>
                </View>
            );
        } else if (dataItem == EnumName.E_EMPTYDATA) {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaView>
        );
    }
}
