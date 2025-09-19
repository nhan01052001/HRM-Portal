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
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
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
    topTabHisProfileContactInfo = null,
    // topTabHisProfileContactInfoViewDetail = null,
    topTabHisProfileContactInfoTask = null,
    pageSizeList = 20;

class TopTabHisProfileContactInfo extends Component {
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
            // TopTabHisProfileInfoBusinessFunction.setThisForBusiness(this);
            // if (HouseholdConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.TopTabHisProfileContactInfo]) {
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
        // HouseholdConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.TopTabHisProfileContactInfo] = false;

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: topTabHisProfileContactInfoTask,
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
        const dataRowActionAndSelected = generateRowActionAndSelected(topTabHisProfileContactInfo);
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
                    keyTask: topTabHisProfileContactInfoTask,
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
                    keyTask: topTabHisProfileContactInfoTask,
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
        if (nextProps.reloadScreenName == topTabHisProfileContactInfoTask) {
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
        // HouseholdConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.TopTabHisProfileContactInfo] = false;

        if (!ConfigList.value[ScreenName.TopTabHisProfileContactInfo]) {
            PermissionForAppMobile.value['HRM_HR_Profile_PersonalContact_Grid_WaitingConfirm_btnDel'] = {
                View: true
            };
            PermissionForAppMobile.value['HRM_HR_Profile_PersonalContact_Grid_WaitingConfirm_btnTransfer'] = {
                View: true
            };
            PermissionForAppMobile.value['HRM_HR_Profile_PersonalContact_Grid_WaitingConfirm_btnAttachFile'] = {
                View: true
            };

            ConfigList.value[ScreenName.TopTabHisProfileContactInfo] = {
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
                BusinessAction: [
                    {
                        Type: 'E_DELETE',
                        Resource: {
                            Name: 'HRM_HR_Profile_PersonalContact_Grid_WaitingConfirm_btnDel',
                            Rule: 'View'
                        },
                        Confirm: {
                            isInputText: false,
                            isValidInputText: false
                        }
                    },
                    {
                        Type: 'E_SENDMAIL',
                        Resource: {
                            Name: 'HRM_HR_Profile_PersonalContact_Grid_WaitingConfirm_btnTransfer',
                            Rule: 'View'
                        }
                    },
                    {
                        Type: 'E_ATTACH_FILE',
                        Resource: {
                            Name: 'HRM_HR_Profile_PersonalContact_Grid_WaitingConfirm_btnAttachFile',
                            Rule: 'View'
                        }
                    }
                ]
            };
        }

        //set by config
        enumName = EnumName;

        topTabHisProfileContactInfo = ScreenName.TopTabHisProfileContactInfo;
        // topTabHisProfileContactInfoViewDetail = ScreenName.TopTabHisProfileContactInfoViewDetail;
        topTabHisProfileContactInfoTask = EnumTask.KT_TopTabHisProfileContactInfo;

        TopTabHisProfileInfoBusinessFunction.setThisForBusiness(this);
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: topTabHisProfileContactInfoTask,
            payload: {
                ..._paramsDefault.dataBody,
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload
            }
        });
    }

    //#region Đính kèm file
    openModalAttachFile = (itemID) => {
        const { dataAttachFile, FileAttach } = this.state;
        if (!itemID) {
            return;
        }

        VnrLoadingSevices.show();
        HttpService.Get(`[URI_HR]/Hre_GetDataV2/GetHre_RequestInfoByID?ID=${itemID}`).then((res) => {
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
                {topTabHisProfileContactInfo && enumName && (
                    <View style={[styleSheets.container]}>
                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <TabHistoryList
                                    detail={{
                                        dataLocal: false,
                                        // screenDetail: topTabHisProfileContactInfoViewDetail,
                                        screenName: topTabHisProfileContactInfo
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={topTabHisProfileContactInfoTask}
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
                                        <ScrollView style={styles.styViewFIleAttach}>
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

export default connect(mapStateToProps, null)(TopTabHisProfileContactInfo);

const styles = StyleSheet.create({
    styViewFIleAttach: { flex: 0.8, flexGrow: 1, flexDirection: 'column', padding: Size.defineSpace }
});
