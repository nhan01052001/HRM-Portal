import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import DependantList from '../dependantList/DependantList';
import {
    styleSheets,
    styleSafeAreaView,
    stylesListPickerControl,
    Colors,
    Size,
    stylesModalPopupBottom
} from '../../../../../../constants/styleConfig';
import { ConfigList } from '../../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../../assets/auth/authentication';
import { IconCreate, IconCancel, IconColse } from '../../../../../../constants/Icons';
import DrawerServices from '../../../../../../utils/DrawerServices';
import { startTask } from '../../../../../../factories/BackGroundTask';
import { connect } from 'react-redux';
import { PermissionForAppMobile } from '../../../../../../assets/configProject/PermissionForAppMobile';
import {
    generateRowActionAndSelected,
    DependantWaitConfirmBusinessFunction
} from './DependantWaitConfirmBusinessFunction';
import { DependantConfirmedBusinessFunction } from '../dependantConfirmed/DependantConfirmedBusinessFunction';
import Modal from 'react-native-modal';
import VnrAttachFile from '../../../../../../components/VnrAttachFile/VnrAttachFile';
import VnrText from '../../../../../../components/VnrText/VnrText';
import { VnrLoadingSevices } from '../../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../../utils/HttpService';

let permission = null,
    configList = null,
    enumName = null,
    dependantWaitConfirm = null,
    dependantWaitConfirmViewDetail = null,
    dependantWaitConfirmKeyTask = null,
    pageSizeList = 20;

class DependantWaitConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataBody: null,
            rowActions: [],
            selected: [],
            isRefreshList: false,
            isLazyLoading: false,
            keyQuery: null,
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

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            DependantWaitConfirmBusinessFunction.setThisForBusiness(this);
            if (DependantConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.DependantWaitConfirm]) {
                this.reload();
            }
        });
        this.storeParamsDefault = null;
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    checkDataFormNotify = () => {
        const { params = {} } = this.props.navigation.state,
            { NotificationID } = typeof params == 'object' ? params : JSON.parse(params);
        return NotificationID ? NotificationID : null;
    };

    checkDataFormLink = () => {
        const { params = {} } = this.props.navigation.state,
            _params = typeof params == 'object' ? params : JSON.parse(params);
        return _params;
    };

    reload = paramsFilter => {
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
        DependantConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.DependantWaitConfirm] = false;

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: dependantWaitConfirmKeyTask,
                payload: {
                    ...dataBody,
                    keyQuery: keyQuery,
                    isCompare: false,
                    reload: this.reload
                }
            });
        });
    };

    paramsDefault = () => {
        const _configList = configList[dependantWaitConfirm],
            renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order],
            dataFromParams = this.checkDataFormLink();

        const dataRowActionAndSelected = generateRowActionAndSelected();
        let _params = {
            ...dataFromParams,
            IsPortal: true,
            sort: orderBy,
            pageSize: pageSizeList,
            profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null,
            NotificationID: this.checkDataFormNotify()
        };

        return {
            rowActions: dataRowActionAndSelected.rowActions,
            selected: dataRowActionAndSelected.selected,
            renderRow: renderRow,
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
                // pull to refresh delete params from link
                if (dataBody?.tokenEncodedParam) {
                    delete dataBody?.tokenEncodedParam;
                }
                startTask({
                    keyTask: dependantWaitConfirmKeyTask,
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
                    keyTask: dependantWaitConfirmKeyTask,
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
        if (nextProps.reloadScreenName == dependantWaitConfirmKeyTask) {
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
        DependantConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.DependantWaitConfirm] = false;
        //set by config
        permission = PermissionForAppMobile.value;
        configList = ConfigList.value;
        enumName = EnumName;
        dependantWaitConfirm = ScreenName.DependantWaitConfirm;
        dependantWaitConfirmViewDetail = ScreenName.DependantWaitConfirmViewDetail;
        dependantWaitConfirmKeyTask = EnumTask.KT_DependantWaitConfirm;

        DependantWaitConfirmBusinessFunction.setThisForBusiness(this, false);
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;

        this.setState(_paramsDefault);

        startTask({
            keyTask: dependantWaitConfirmKeyTask,
            payload: {
                ..._paramsDefault.dataBody,
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload
            }
        });
    }

    //#region  hiển thị số giờ lũy kế
    openModalAttachFile = itemID => {
        const { dataAttachFile, FileAttach } = this.state;
        if (!itemID) {
            return;
        }

        VnrLoadingSevices.show();
        HttpService.Get(`[URI_HR]/Hre_GetData/GetByIdTotal_DependantWaitToTransfer?ID=${itemID}`).then(res => {
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
            AttachFile: FileAttach.value ? FileAttach.value.map(item => item.fileName).join(',') : null,
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
                DependantWaitConfirmBusinessFunction.businessSaveAttachFile(params);
            }
        );
    };
    //#endregion

    render() {
        const {
            dataBody,
            renderRow,
            rowActions,
            selected,
            isLazyLoading,
            isRefreshList,
            statusDataList,
            keyQuery,
            dataChange,
            dataPlanLimit,
            dataAttachFile,
            FileAttach
        } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {dependantWaitConfirm && dependantWaitConfirmViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <DependantList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: dependantWaitConfirmViewDetail,
                                        screenName: dependantWaitConfirm
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={dependantWaitConfirmKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Hre_GetData/GetHre_DependantByDataStatus_ForAllList',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: 20
                                    }}
                                    valueField="ID"
                                    renderConfig={renderRow}
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
                                        <View
                                            style={{
                                                flex: 1,
                                                backgroundColor: Colors.black,
                                                opacity: 0.5
                                            }}
                                        />
                                    </TouchableWithoutFeedback>
                                }
                                style={{
                                    margin: 0
                                }}
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
                                        <ScrollView
                                            style={{
                                                flex: 0.8,
                                                flexGrow: 1,
                                                flexDirection: 'column',
                                                padding: Size.defineSpace
                                            }}
                                        >
                                            <VnrAttachFile
                                                disable={FileAttach.disable}
                                                value={FileAttach.value}
                                                multiFile={true}
                                                uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                                onFinish={file => {
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
                                        <View style={[stylesModalPopupBottom.styleViewBntApprove, { flex: 0.2 }]}>
                                            <TouchableOpacity
                                                onPress={() => this.saveData()}
                                                style={[stylesModalPopupBottom.bntApprove, { maxHeight: 40 }]}
                                            >
                                                <VnrText
                                                    style={[styleSheets.lable, , { color: Colors.white }]}
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

const mapStateToProps = state => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(
    mapStateToProps,
    null
)(DependantWaitConfirm);

const styles = StyleSheet.create({
    headerCloseModal: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    viewTextTimeWithBorder: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        padding: styleSheets.p_15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor
    },
    viewTextTimeWithoutBorder: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        padding: styleSheets.p_15
    }
});
