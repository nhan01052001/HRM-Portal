import React, { Component } from 'react';
import { ScrollView, TouchableOpacity, TouchableWithoutFeedback, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleSafeAreaView,
    stylesModalPopupBottom,
    Size,
    Colors,
    stylesScreenDetailV3,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import {
    TopTabHisProfileInfoBusinessFunction,
    generateRowActionAndSelected
} from './TopTabHisProfileInfoBusinessFunction';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import { IconCancel, IconColse } from '../../../../../constants/Icons';
import VnrText from '../../../../../components/VnrText/VnrText';
import Modal from 'react-native-modal';
import HttpService from '../../../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import TabHistoryList from './tabHistoryList/TabHistoryList';

let enumName = null,
    topTabHisProfileBasicInfo = null,
    // topTabHisProfileBasicInfoViewDetail = null,
    topTabHisProfileBasicInfoTask = null;

class TopTabHisProfileBasicInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataBody: null,
            rowActions: [],
            selected: [],
            isRefreshList: false,
            isLazyLoading: false,
            keyQuery: null,
            dataChange: false, //biến check dữ liệu có thay đổi hay không
            dataAttachFile: {
                data: null,
                modalVisibleAttachFile: false
            },
            FileAttach: {
                disable: false,
                refresh: false,
                value: null,
                visibleConfig: true,
                visible: true
            }
        };

        this.storeParamsDefault = null;

        //biến lưu lại object filter
        this.paramsFilter = null;

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // TopTabHisProfileBasicInfoBusinessFunction.setThisForBusiness(this);
            // if (HouseholdConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.TopTabHisProfileBasicInfo]) {
            //   this.reload();
            // }
        });
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    reload = (paramsFilter) => {
        if (paramsFilter === 'E_KEEP_FILTER') {
            paramsFilter = { ...this.paramsFilter };
        } else {
            this.paramsFilter = { ...paramsFilter };
        }

        let _paramsDefault = this.storeParamsDefault,
            _keyQuery = EnumName.E_FILTER;

        _paramsDefault = {
            ..._paramsDefault,
            keyQuery: _keyQuery,
            isRefreshList: !this.state.isRefreshList, // reload lại ds.
            dataBody: {
                ..._paramsDefault.dataBody,
                ...paramsFilter
            }
        };

        // set false khi đã reload.
        // HouseholdConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.TopTabHisProfileBasicInfo] = false;

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: topTabHisProfileBasicInfoTask,
                payload: {
                    ...dataBody,
                    keyQuery: keyQuery,
                    isCompare: false,
                    reload: this.reload
                }
            });
        });
    };

    checkDataFormNotify = () => {
        const { params = {} } = this.props.navigation.state,
            { NotificationID } = typeof params == 'object' ? params : JSON.parse(params);
        return NotificationID ? NotificationID : null;
    };

    paramsDefault = () => {
        const dataRowActionAndSelected = generateRowActionAndSelected(topTabHisProfileBasicInfo);
        let _params = {};

        return {
            rowActions: dataRowActionAndSelected.rowActions,
            selected: dataRowActionAndSelected.selected,
            dataBody: _params,
            keyQuery: EnumName.E_PRIMARY_DATA
        };
    };

    pullToRefresh = () => {
        const { dataBody, keyQuery } = this.state;
        this.setState(
            {
                keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA
            },
            () => {
                startTask({
                    keyTask: topTabHisProfileBasicInfoTask,
                    payload: {
                        ...dataBody,
                        keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA,
                        isCompare: false,
                        reload: this.reload
                    }
                });
            }
        );
    };

    pagingRequest = (page, pageSize) => {
        const { dataBody } = this.state;
        this.setState(
            {
                keyQuery: EnumName.E_PAGING
            },
            () => {
                startTask({
                    keyTask: topTabHisProfileBasicInfoTask,
                    payload: {
                        ...dataBody,
                        page: page,
                        pageSize: pageSize,
                        keyQuery: EnumName.E_PAGING,
                        isCompare: false,
                        reload: this.reload
                    }
                });
            }
        );
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == topTabHisProfileBasicInfoTask) {
            //khi màn hình đang reload thì messsage phải là filter thì màn hình mới reload
            if (keyQuery === EnumName.E_FILTER && nextProps.message && keyQuery == nextProps.message.keyQuery) {
                this.setState({
                    isLazyLoading: !this.state.isLazyLoading,
                    dataChange: nextProps.message.dataChange
                });
            } else if (nextProps.message && keyQuery == nextProps.message.keyQuery) {
                // trường hợp không filter
                this.setState({
                    isLazyLoading: !this.state.isLazyLoading,
                    dataChange: nextProps.message.dataChange
                });
            }
        }
    }

    componentDidMount() {
        // HouseholdConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.TopTabHisProfileBasicInfo] = false;

        if (!ConfigList.value[ScreenName.TopTabHisProfileBasicInfo]) {
            // PermissionForAppMobile.value['HRM_HR_Profile_BasicInfo_Grid_WaitingConfirm_btnDel'] = {
            //   "View": true,
            // }
            // PermissionForAppMobile.value['HRM_HR_Profile_BasicInfo_Grid_WaitingConfirm_btnTransfer'] = {
            //   "View": true,
            // }
            // PermissionForAppMobile.value['HRM_HR_Profile_BasicInfo_Grid_WaitingConfirm_btnAttachFile'] = {
            //   "View": true,
            // }

            ConfigList.value[ScreenName.TopTabHisProfileBasicInfo] = {
                Api: {
                    urlApi: '[URI_HR]/Hre_GetDataV2/GetHre_PersonalContact_TempGird',
                    type: 'POST',
                    pageSize: 20
                },
                Row: [],
                Order: [
                    {
                        field: 'DateUpdate',
                        dir: 'desc'
                    }
                ],
                BusinessAction: []
            };
        }

        //set by config
        enumName = EnumName;

        topTabHisProfileBasicInfo = ScreenName.TopTabHisProfileBasicInfo;
        // topTabHisProfileBasicInfoViewDetail = ScreenName.TopTabHisProfileBasicInfoViewDetail;
        topTabHisProfileBasicInfoTask = EnumTask.KT_TopTabHisProfileBasicInfo;

        TopTabHisProfileInfoBusinessFunction.setThisForBusiness(this);
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);
    }

    //#region  hiển thị số giờ lũy kế
    openModalAttachFile = (itemID) => {
        const { dataAttachFile, FileAttach } = this.state;
        if (!itemID) {
            return;
        }

        VnrLoadingSevices.show();
        HttpService.Get(`[URI_HR]/Att_GetData/GetByIdHouseHoldTotal?ID=${itemID}`).then((res) => {
            VnrLoadingSevices.hide();
            this.setState({
                dataAttachFile: {
                    ...dataAttachFile,
                    data: itemID,
                    modalVisibleAttachFile: true
                },
                FileAttach: {
                    ...FileAttach,
                    value: res.lstFileAttach ? res.lstFileAttach : null,
                    refresh: !FileAttach.refresh
                }
            });
        });
    };

    closeModalAttachFile = () => {
        const { dataAttachFile, FileAttach } = this.state;
        this.setState({
            dataAttachFile: {
                ...dataAttachFile,
                data: null,
                modalVisibleAttachFile: false
            },
            FileAttach: {
                ...FileAttach,
                value: null,
                refresh: !FileAttach.refresh
            }
        });
    };

    saveData = () => {
        const { dataAttachFile, FileAttach } = this.state;
        const params = {
            AttachFile: FileAttach.value ? FileAttach.value.map((item) => item.fileName).join(',') : null,
            ID: dataAttachFile.data,
            IsPortal: true,
            UserSubmit: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.userid : null
        };

        this.setState(
            {
                dataAttachFile: {
                    ...dataAttachFile,
                    data: null,
                    modalVisibleAttachFile: false
                },
                FileAttach: {
                    ...FileAttach,
                    value: null,
                    refresh: !FileAttach.refresh
                }
            },
            () => {
                TopTabHisProfileInfoBusinessFunction.businessSaveAttachFile(params);
            }
        );
    };
    //#endregion

    render() {
        const {
            dataBody,
            rowActions,
            selected,
            isLazyLoading,
            isRefreshList,
            keyQuery,
            dataChange,
            dataAttachFile,
            FileAttach
        } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {topTabHisProfileBasicInfo && enumName && (
                    <View style={[styleSheets.container]}>
                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <TabHistoryList
                                    detail={{
                                        dataLocal: false,
                                        // screenDetail: topTabHisProfileBasicInfoViewDetail,
                                        screenName: topTabHisProfileBasicInfo
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={topTabHisProfileBasicInfoTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Hre_GetDataV2/GetHre_PersonalContact_TempGird',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: 20
                                    }}
                                    valueField="ID"
                                    renderConfig={null}
                                />
                            )}
                        </View>

                        {dataAttachFile.modalVisibleAttachFile && (
                            <Modal
                                onBackButtonPress={() => this.closeModalAttachFile()}
                                isVisible={true}
                                onBackdropPress={() => this.closeModalAttachFile()}
                                customBackdrop={
                                    <TouchableWithoutFeedback onPress={() => this.closeModalAttachFile()}>
                                        <View style={stylesScreenDetailV3.modalBackdrop} />
                                    </TouchableWithoutFeedback>
                                }
                                style={CustomStyleSheet.margin(0)}
                            >
                                <View
                                    style={[
                                        stylesModalPopupBottom.viewModalTime,
                                        {
                                            height: Size.deviceheight * 0.5
                                        }
                                    ]}
                                >
                                    <SafeAreaView {...styleSafeAreaView} style={stylesModalPopupBottom.safeRadius}>
                                        <View style={stylesModalPopupBottom.headerCloseModal}>
                                            <IconColse color={Colors.white} size={Size.iconSize} />
                                            <VnrText style={styleSheets.lable} i18nKey={'HRM_Common_FileAttach'} />
                                            <TouchableOpacity onPress={() => this.closeModalAttachFile()}>
                                                <IconCancel color={Colors.black} size={Size.iconSize} />
                                            </TouchableOpacity>
                                        </View>
                                        <ScrollView style={styles.styViewAttachfile}>
                                            <VnrAttachFile
                                                disable={FileAttach.disable}
                                                value={FileAttach.value}
                                                multiFile={true}
                                                uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                                onFinish={(file) => {
                                                    this.setState({
                                                        FileAttach: {
                                                            ...FileAttach,
                                                            value: file,
                                                            refresh: !FileAttach.refresh
                                                        }
                                                    });
                                                }}
                                            />
                                        </ScrollView>
                                        <View
                                            style={[
                                                stylesModalPopupBottom.styleViewBntApprove,
                                                CustomStyleSheet.flex(0.2)
                                            ]}
                                        >
                                            <TouchableOpacity
                                                onPress={() => this.saveData()}
                                                style={[
                                                    stylesModalPopupBottom.bntApprove,
                                                    CustomStyleSheet.maxHeight(40)
                                                ]}
                                            >
                                                <VnrText
                                                    style={[styleSheets.lable, { color: Colors.white }]}
                                                    i18nKey={'HRM_Common_SaveClose'}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </SafeAreaView>
                                </View>
                            </Modal>
                        )}
                    </View>
                )}
            </SafeAreaView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(mapStateToProps, null)(TopTabHisProfileBasicInfo);

const styles = StyleSheet.create({
    styViewAttachfile: { flex: 0.8, flexGrow: 1, flexDirection: 'column', padding: Size.defineSpace }
});
