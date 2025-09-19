import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import QualificationList from '../qualificationList/QualificationList';
import {
    styleSheets,
    styleSafeAreaView,
    Colors,
    Size,
    stylesModalPopupBottom,
    CustomStyleSheet
} from '../../../../../../constants/styleConfig';
import { ConfigList } from '../../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../../assets/auth/authentication';
import { IconCancel, IconColse } from '../../../../../../constants/Icons';
import { startTask } from '../../../../../../factories/BackGroundTask';
import { connect } from 'react-redux';
import {
    generateRowActionAndSelected,
    QualificationWaitConfirmBusinessFunction
} from './QualificationWaitConfirmBusinessFunction';
import { QualificationConfirmedBusinessFunction } from '../qualificationConfirmed/QualificationConfirmedBusinessFunction';
import Modal from 'react-native-modal';
import VnrText from '../../../../../../components/VnrText/VnrText';
import { VnrLoadingSevices } from '../../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../../utils/HttpService';
import { ConfigListFilter } from '../../../../../../assets/configProject/ConfigListFilter';
import VnrAttachFile from '../../../../../../components/VnrAttachFile/VnrAttachFile';

let configList = null,
    enumName = null,
    qualificationWaitConfirm = null,
    qualificationWaitConfirmViewDetail = null,
    qualificationWaitConfirmKeyTask = null,
    pageSizeList = 20;

class QualificationWaitConfirm extends Component {
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
            QualificationWaitConfirmBusinessFunction.setThisForBusiness(this);
            if (QualificationConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.QualificationWaitConfirm]) {
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
        QualificationConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.QualificationWaitConfirm] = false;

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: qualificationWaitConfirmKeyTask,
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
        if (!configList[qualificationWaitConfirm]) {
            configList[qualificationWaitConfirm] = {
                Api: {
                    urlApi: '[URI_HR]/Hre_GetData/GetHre_ProfileQualificationByDataStatus_Add',
                    type: 'POST',
                    pageSize: 20
                },
                Order: [
                    {
                        field: 'DateUpdate',
                        dir: 'desc'
                    }
                ],
                BusinessAction: [
                    {
                        Type: 'E_MODIFY',
                        Resource: {
                            Name: 'ProfileQualification_Request_Index_ProfileQualification_Request_Gird_btnEdit',
                            Rule: 'Modify'
                        },
                        Confirm: {
                            isInputText: false,
                            isValidInputText: false
                        }
                    },
                    {
                        Type: 'E_DELETE',
                        Resource: {
                            Name: 'ProfileQualification_Request_Index_ProfileQualification_Request_Gird_btnDel',
                            Rule: 'Delete'
                        },
                        Confirm: {
                            isInputText: false,
                            isValidInputText: false
                        }
                    },
                    {
                        Type: 'E_SENDMAIL',
                        Resource: {
                            Name: 'ProfileQualification_Request_Index_ProfileQualification_Request_Gird_btnTransfer',
                            Rule: 'View'
                        }
                    }
                ]
            };
        }

        const _configList = configList[qualificationWaitConfirm],
            renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order],
            dataFromParams = this.checkDataFormNotify();

        const dataRowActionAndSelected = generateRowActionAndSelected(ScreenName.QualificationWaitConfirm);
        let _params = {
            ...dataFromParams,
            IsPortal: true,
            sort: orderBy,
            pageSize: pageSizeList,
            profileID: dataVnrStorage.currentUser.info ? dataVnrStorage.currentUser.info.ProfileID : null
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
                    keyTask: qualificationWaitConfirmKeyTask,
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
                    keyTask: qualificationWaitConfirmKeyTask,
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
        if (nextProps.reloadScreenName == qualificationWaitConfirmKeyTask) {
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
        QualificationConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.QualificationWaitConfirm] = false;
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        qualificationWaitConfirm = ScreenName.QualificationWaitConfirm;
        qualificationWaitConfirmViewDetail = ScreenName.QualificationWaitConfirmViewDetail;
        qualificationWaitConfirmKeyTask = EnumTask.KT_QualificationWaitConfirm;

        QualificationWaitConfirmBusinessFunction.setThisForBusiness(this, false);

        let _paramsDefault = this.paramsDefault(),
            paramStore = { ..._paramsDefault, dataBody: { ..._paramsDefault?.dataBody } },
            dataFromParams = this.checkDataFormNotify();
        this.storeParamsDefault = _paramsDefault;


        // xoa filter defaule
        Object.keys(dataFromParams).forEach(key => {
            paramStore.dataBody[key] = null;
        });

        this.setState(ConfigListFilter.value[qualificationWaitConfirm] ? _paramsDefault : paramStore);

        startTask({
            keyTask: qualificationWaitConfirmKeyTask,
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
        HttpService.Get(`[URI_HR]/Hre_GetData/GetByIdAttachFile_RelativesCombineGrid?ID=${itemID}`).then(res => {
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
                QualificationConfirmedBusinessFunction.businessSaveAttachFile(params);
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
            keyQuery,
            dataChange,
            dataAttachFile,
            FileAttach
        } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {qualificationWaitConfirm && qualificationWaitConfirmViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <QualificationList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: qualificationWaitConfirmViewDetail,
                                        screenName: qualificationWaitConfirm
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={qualificationWaitConfirmKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Hre_GetData/GetHre_ProfileQualificationByDataStatus',
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
                                            style={styleSheets.coatingOpacity05}
                                        />
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
                                        <ScrollView
                                            style={styles.stylesScrollView}
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
                                        <View style={[stylesModalPopupBottom.styleViewBntApprove, CustomStyleSheet.flex(0.2)]}>
                                            <TouchableOpacity
                                                onPress={() => this.saveData()}
                                                style={[stylesModalPopupBottom.bntApprove, CustomStyleSheet.maxHeight(40)]}
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
)(QualificationWaitConfirm);

const styles = StyleSheet.create({
    stylesScrollView: {
        flex: 0.8,
        flexGrow: 1,
        flexDirection: 'column',
        padding: Size.defineSpace
    }
});
