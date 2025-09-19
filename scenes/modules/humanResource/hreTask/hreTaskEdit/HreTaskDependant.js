/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleSafeAreaView,
    Size,
    Colors,
    styleProfileInfo
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../utils/DrawerServices';
import { TouchableOpacity } from 'react-native-gesture-handler';
import HreTaskDependantList from '../hreTaskDependantList/HreTaskDependantList';
import { EnumName, EnumIcon } from '../../../../../assets/constant';
import HreModalAddDependant from './HreModalAddDependant';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { translate } from '../../../../../i18n/translate';
import { IconCreate } from '../../../../../constants/Icons';
import { TaskBusinessBusinessFunction } from '../HreTaskBusiness';

export default class HreTaskDependant extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataItem: null,
            configListDetail: null,
            dependantModalVisible: false,
            dataRecord: null,
            refreshListDependant: false
            //dataRowActionAndSelected: null,
            //listActions: this.resultListActionHeader()
        };
    }

    businessDeleteRecords = (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map(item => item.ID),
                lengthItemDelete = selectedID.length;

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Tas_GetData/ValidateTasPersonsConcernedRemoveSelected', {
                selectedIds: selectedID,
                userLogin: dataVnrStorage.currentUser.headers.userlogin
            }).then(res => {
                VnrLoadingSevices.hide();

                try {
                    if (res && res === 'Success') {
                        //dữ liệu hợp lệ
                        AlertSevice.alert({
                            iconType: EnumIcon.E_DELETE,
                            message: `${translate('AreYouSureYouWantToDeleteV2')} ${lengthItemDelete} ${translate(
                                'SelectedDataLines'
                            )}`,
                            onCancel: () => {},
                            onConfirm: () => {
                                this.checkingDataWorkingForTaskDelete(selectedID);
                            }
                        });
                    }
                    //User khong hop le
                    else if (res === 'Error') {
                        ToasterSevice.showWarning('HRM_Tas_Task_IsNotAllowDeleteDependant', 4000);
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

    checkingDataWorkingForTaskDelete = selectedID => {
        if (Array.isArray(selectedID) && selectedID.length > 0) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_POR]/New_Hre_Tas_Task/RemoveSelected_PersonsConcerned', {
                selectedIds: selectedID,
                userLogin: dataVnrStorage.currentUser.headers.userlogin
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && res === 'Success') {
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

    getDataItem = async (isReload = false) => {
        try {
            const _params = this.props,
                { recordID, dataId } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _dataItem = { ID: recordID };

            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                // const response = await HttpService.Post(`[URI_HR]/Att_GetData/GetOvertimeById`, {
                //     id: !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID,
                //     screenName: screenName,
                //     uri: dataVnrStorage.apiConfig.uriHr
                // });
                // const _listActions = await this.rowActionsHeaderRight(response, _dataRowActionAndSelected);
                // if (!Vnr_Function.CheckIsNullOrEmpty(response)) {
                //     this.setState({  dataItem: response, listActions: _listActions ,refreshListDependant:!this.state.refreshListDependant});
                // }
                // else {
                //     this.setState({ dataItem: 'EmptyData' });
                // }
            } else if (!Vnr_Function.CheckIsNullOrEmpty(_dataItem)) {
                this.setState({ dataItem: _dataItem, refreshListDependant: !this.state.refreshListDependant });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    reload = () => {
        const { reloadScreenList } = this.props;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');
        this.getDataItem();

        //callback update Control người liên quan ở tab Thông tin/Mô tả
        const { onUpdatProfileIds } = TaskBusinessBusinessFunction;

        if (onUpdatProfileIds && typeof onUpdatProfileIds === 'function') {
            const { recordID } = this.props;
            onUpdatProfileIds(recordID);
        }
    };

    hideModaldependant = () => {
        this.setState({ dependantModalVisible: false, dataRecord: null });
    };

    showModaldependant = dataItem => {
        this.setState({ dependantModalVisible: true, dataRecord: dataItem });
    };

    componentDidMount() {
        this.getDataItem();
    }

    render() {
        const { dataItem, dependantModalVisible, dataRecord, refreshListDependant } = this.state,
            _rowActions = [
                {
                    title: translate('HRM_Common_Delete'),
                    type: EnumName.E_DELETE,
                    onPress: (item, dataBody) => this.businessDeleteRecords([{ ...item }], dataBody)
                }
            ];

        // Xử lý disable control Edit cho taskAsigned
        const { params } = this.props.navigation.state,
            { roleEditStatusOnly } = params;

        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    {!roleEditStatusOnly && (
                        <TouchableOpacity
                            style={styles.viewButtonUpdate__bnt}
                            onPress={() => this.showModaldependant(dataItem)}
                        >
                            <IconCreate size={Size.iconSize} color={Colors.black} />
                            <VnrText
                                style={[styleSheets.text, { color: Colors.black, marginLeft: 5 }]}
                                i18nKey={'HRM_TAS_PersonsConcerned_Create'}
                            />
                        </TouchableOpacity>
                    )}

                    <View style={styles.viewUpdate}>
                        <View style={styleProfileInfo.styleViewTitleGroup}>
                            <VnrText
                                style={[styleSheets.text, styleProfileInfo.textLableGroup]}
                                i18nKey={'HRM_Tas_TaskPersonsConcerned'}
                            />
                        </View>
                        <HreTaskDependantList
                            isRefreshList={refreshListDependant}
                            rowActions={!roleEditStatusOnly ? _rowActions : null}
                            api={{
                                urlApi: `[URI_HR]/Tas_GetData/GetTasPersonsConcernedList?TaskID=${dataItem.ID}`,
                                dataBody: {},
                                type: EnumName.E_POST,
                                pageSize: 20
                            }}
                            valueField="ID"
                        />
                    </View>
                </View>
            );
        } else if (dataItem == 'EmptyData') {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>
                    {contentViewDetail}
                    {dataRecord && (
                        <HreModalAddDependant
                            reload={this.reload}
                            dataRecord={dataRecord}
                            dependantModalVisible={dependantModalVisible}
                            hideModaldependant={this.hideModaldependant}
                        />
                    )}
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    viewUpdate: {
        flex: 1,
        marginTop: 5
    },
    viewButtonUpdate__bnt: {
        height: Size.heightButton,
        backgroundColor: Colors.primaryOpacity20,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 10
    }
});
