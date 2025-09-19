import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { connect } from 'react-redux';

import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import {
    styleSheets,
    Size,
    Colors,
    styleValid,
    stylesScreenDetailV3,
    stylesVnrPickerV3
} from '../../../../../constants/styleConfig';
import { translate } from '../../../../../i18n/translate';
import HttpService from '../../../../../utils/HttpService';
import VnrText from '../../../../../components/VnrText/VnrText';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';
import { IconSave } from '../../../../../constants/Icons';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import DrawerServices from '../../../../../utils/DrawerServices';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import VnrIndeterminate from '../../../../../components/VnrLoading/VnrIndeterminate';
import ProfileAdditionItem from './ProfileAdditionItem';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import { EnumName } from '../../../../../assets/constant';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import profileAddition from '../../../../../redux/profileAddition';

class ProfileAddition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lsState: [],
            isReadOnlyButton: true,
            refreshing: false
        };

        this.endLoading = false;
    }

    handleGetDataFromLink = () => {
        try {
            if (dataVnrStorage.currentUser.info.ProfileID) {
                VnrLoadingSevices.show();
                HttpService.Get(
                    `[URI_CENTER]/api/Hre_ReqDocument/GetReqDocumentByProfileID?profileID=${
                        dataVnrStorage.currentUser.info.ProfileID
                    }`
                )
                    .then(res => {
                        VnrLoadingSevices.hide();
                        if (res?.Data && res?.Status === EnumName.E_SUCCESS) {
                            let dataWaitingApprove = [];
                            if (Array.isArray(res?.Data?.Hre_ReqDocumentNewPortalAPIModel)) {
                                res?.Data?.Hre_ReqDocumentNewPortalAPIModel.map(item => {
                                    if (
                                        item?.ReqDocumentStatus === 'E_SUBMIT' ||
                                        item?.ReqDocumentStatus === 'E_APPROVED3' ||
                                        item?.ReqDocumentStatus === 'E_FIRST_APPROVED' ||
                                        item?.ReqDocumentStatus === 'E_APPROVED2' ||
                                        item?.ReqDocumentStatus === 'E_APPROVED1'
                                    ) {
                                        dataWaitingApprove.push(item);
                                    }
                                });
                            }
                            this.props.setProfileAdded(
                                `${dataWaitingApprove.length}/${res?.Data?.Hre_ReqDocumentNewPortalAPIModel.length}`
                            );
                            this.props.navigation.setParams({
                                data: res?.Data?.Hre_ReqDocumentNewPortalAPIModel,
                                deadline: res?.Data?.ApplicationDeadLine,
                                isOverDeadline: res?.Data?.StatusDate === 'E_OUTOFDATE',
                                numberWaitings: dataWaitingApprove.length,
                                numberTotal: res?.Data?.Hre_ReqDocumentNewPortalAPIModel.length
                            });
                            this.handleData();
                        }
                    })
                    .catch(error => {
                        VnrLoadingSevices.hide();
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    });
            }
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    // function: handle field dynamically
    handleData = () => {
        
        const { lsState } = this.state;
        let rsHandleData = {},
            state = [];
        if (Array.isArray(this.props.navigation.state.params?.data)) {
            this.props.navigation.state.params?.data.map(item => {
                if (item?.ReqDocumentID && item?.ID) {
                    let arrFile = [];
                    state.push(`${item?.ID}`);

                    if (Array.isArray(item?.listFile)) {
                        item?.listFile.map(v => {
                            if (v?.fileName) {
                                arrFile.push(ManageFileSevice.setFileAttachApp(v?.fileName)[0]);
                            }
                        });
                    }

                    rsHandleData = {
                        ...rsHandleData,
                        [`${item?.ID}`]: {
                            lable: item?.ReqDocumentName ? item?.ReqDocumentName : 'undefined',
                            value: arrFile.length > 0 ? arrFile : null,
                            disabled:
                                item?.ReqDocumentStatus === 'E_APPROVED' || item?.ReqDocumentStatus === 'E_SUBMIT'
                                    ? true
                                    : false,
                            status: item?.ReqDocumentStatus,
                            statusView: item?.ReqDocumentStatusView
                                ? item?.ReqDocumentStatusView
                                : translate(item?.ReqDocumentStatus),
                            statusStyle: item?.ReqDocumentStatus
                                ? Vnr_Services.formatStyleStatusApp(item?.ReqDocumentStatus)
                                : Vnr_Services.formatStyleStatusApp('E_APPROVED'),
                            refresh: false,
                            ...item
                        }
                    };
                }
            });
        }

        this.setState({ ...rsHandleData, lsState: state, refreshing: false });
    };

    componentDidMount() {
        // check open from link
        if (
            Object.keys(this.props.navigation.state.params).length === 0 ||
            !this.props.navigation.state.params?.data ||
            DrawerServices.getBeforeScreen() !== 'Home'
        ) {
            this.handleGetDataFromLink();
        } else {
            this.handleData();
        }
    }

    onSaveAndSend = () => {
        this.onSave(true);
    };

    onSaveTemp = () => {
        this.onSave(false, true);
    };

    onSave = (isSend, isconfirm) => {
        try {
            const { lsState, isReadOnlyButton, ...state } = this.state;

            if (lsState && state) {
                let params = [];

                lsState.map(item => {
                    //if (state[`${item}`]?.isNew) {
                    let listFile = [];

                    if (Array.isArray(state[`${item}`]?.value)) {
                        state[`${item}`]?.value.map(v => {
                            listFile.push({
                                fileName: v?.fileName,
                                fileUrl: v?.path
                            });
                        });
                    }

                    delete state[`${item}`]?.isNew;
                    delete state[`${item}`]?.lable;
                    delete state[`${item}`]?.value;
                    delete state[`${item}`]?.disabled;
                    delete state[`${item}`]?.status;
                    delete state[`${item}`]?.statusView;
                    delete state[`${item}`]?.statusStyle;
                    delete state[`${item}`]?.refresh;

                    if (isSend) {
                        params = [
                            ...params,
                            {
                                ...state[`${item}`],
                                ReqDocumentStatus: 'E_SUBMIT',
                                listFile
                            }
                        ];
                    } else {
                        params = [
                            ...params,
                            {
                                ...state[`${item}`],
                                ReqDocumentStatus:
                                    state[`${item}`]?.ReqDocumentStatus !== 'E_SUBMIT' &&
                                    state[`${item}`]?.ReqDocumentStatus !== 'E_APPROVED'
                                        ? 'E_SUBMIT_TEMP'
                                        : state[`${item}`]?.ReqDocumentStatus,
                                listFile
                            }
                        ];
                    }
                    //}
                });

                if (params.length > 0) {
                    VnrLoadingSevices.show();
                    HttpService.Post('[URI_CENTER]/api/Hre_ReqDocument/CreateOrUpdateReqDocumentUseList', params)
                        .then(res => {
                            VnrLoadingSevices.hide();
                            if (res?.Status === EnumName.E_SUCCESS) {
                                ToasterSevice.showSuccess('Hrm_Succeed');
                                this.reload();
                            } else {
                                ToasterSevice.showWarning(res?.Message);
                            }
                        })
                        .catch(error => {
                            VnrLoadingSevices.hide();
                            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        });
                }
            }
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    _renderFooterLoading = () => {
        return (
            <View
                style={{
                    flex: 1,
                    paddingBottom: styleSheets.p_20,
                    marginBottom: 60
                }}
            >
                <VnrLoading size="large" isVisible={this.state.isLoadingFooter} />
            </View>
        );
    };

    _renderHeaderLoading = () => {
        return (
            <View style={{ width: Size.deviceWidth }}>
                <VnrIndeterminate
                    isVisible={(this.isHaveFilter && this.state.refreshing) || this.state.isLoadingHeader}
                />
            </View>
        );
    };

    _handleEndRefresh = () => {
        console.log('refreshing...');
    };

    _handleRefresh = () => {};

    reload = () => {
        try {
            if (dataVnrStorage.currentUser.info.ProfileID) {
                VnrLoadingSevices.show();
                HttpService.Get(
                    `[URI_CENTER]/api/Hre_ReqDocument/GetReqDocumentByProfileID?profileID=${
                        dataVnrStorage.currentUser.info.ProfileID
                    }`
                )
                    .then(res => {
                        VnrLoadingSevices.hide();
                        if (res?.Data && res?.Status === EnumName.E_SUCCESS) {
                            let dataWaitingApprove = [];

                            if (Array.isArray(res?.Data?.Hre_ReqDocumentNewPortalAPIModel)) {
                                res?.Data?.Hre_ReqDocumentNewPortalAPIModel.map(item => {
                                    if (
                                        item?.ReqDocumentStatus === 'E_SUBMIT' ||
                                        item?.ReqDocumentStatus === 'E_APPROVED3' ||
                                        item?.ReqDocumentStatus === 'E_FIRST_APPROVED' ||
                                        item?.ReqDocumentStatus === 'E_APPROVED2' ||
                                        item?.ReqDocumentStatus === 'E_APPROVED1'
                                    ) {
                                        dataWaitingApprove.push(item);
                                    }
                                });
                                this.props.setProfileAdded(
                                    `${dataWaitingApprove.length}/${res?.Data?.Hre_ReqDocumentNewPortalAPIModel.length}`
                                );
                                this.props.navigation.setParams({
                                    data: res?.Data?.Hre_ReqDocumentNewPortalAPIModel,
                                    deadline: res?.Data?.ApplicationDeadLine,
                                    isOverDeadline: res?.Data?.StatusDate === 'E_OUTOFDATE',
                                    numberWaitings: dataWaitingApprove.length,
                                    numberTotal: res?.Data?.Hre_ReqDocumentNewPortalAPIModel.length
                                });

                                this.handleData();
                            }
                        }
                    })
                    .catch(error => {
                        VnrLoadingSevices.hide();
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    });
            }
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    render() {
        const { lsState, isReadOnlyButton, refreshing } = this.state,
            { stylePlaceholder } = stylesVnrPickerV3,
            { numberWaitings, numberTotal } = this.props.navigation.state.params;

        const isPermissionButtonSendHR =
                PermissionForAppMobile &&
                PermissionForAppMobile.value['New_Hre_New_btnSendHR_RequestDocs_App'] &&
                PermissionForAppMobile.value['New_Hre_New_btnSendHR_RequestDocs_App']['View'],
            isPermissionButtonSaveTemp =
                PermissionForAppMobile &&
                PermissionForAppMobile.value['New_Hre_New_btnSaveTemp_RequestDocs_App'] &&
                PermissionForAppMobile.value['New_Hre_New_btnSaveTemp_RequestDocs_App']['View'];
        const progressbar = numberWaitings && numberTotal ? (numberWaitings / numberTotal) * 100 : 0;
        console.log(progressbar, 'progressbar');
        return (
            <SafeAreaViewDetail style={styles.container}>
                <View style={{ flex: 1 }}>
                    <View style={styles.wrapAbove}>
                        <View style={[styles.wrapSelectTypeDocs, { width: '100%' }]}>
                            <View style={{ maxWidth: '50%' }}>
                                <Text numberOfLines={2} style={[styleSheets.lable, styles.textRequestDocAndBtn]}>
                                    {translate('HRM_PortalApp_SelectAdditionalRecordTypes')}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.wrapDeadline,
                                    this.props.navigation.state.params?.isOverDeadline && {
                                        backgroundColor: Colors.red
                                    },
                                    { maxWidth: '50%', alignItems: 'flex-start' }
                                ]}
                            >
                                <Text
                                    numberOfLines={2}
                                    style={[
                                        styleSheets.lable,
                                        { fontSize: Size.text },
                                        this.props.navigation.state.params?.isOverDeadline && { color: Colors.white }
                                    ]}
                                >
                                    {translate('HRM_Evaluation_Deadline')}:{' '}
                                    {this.props.navigation.state.params?.deadline}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.wrapMiddle}>
                            <View style={styles.progressbar}>
                                <View
                                    style={[
                                        styles.progressbar,
                                        {
                                            flex: 1,
                                            width: `${progressbar}%`,
                                            maxWidth: `${progressbar}%`,
                                            backgroundColor: Colors.primary
                                        }
                                    ]}
                                />
                            </View>
                            <View style={{ flex: 0.2, alignItems: 'flex-end' }}>
                                <Text style={[styleSheets.lable, { fontSize: Size.text }]}>
                                    {this.props.dataProfileAdded && `(${this.props.dataProfileAdded})`}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ flex: 1 }}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            disableScrollViewPanResponder={true} // fix bug khong the click onPess sau khi pulltoRefresh
                            data={lsState}
                            extraData={this.state}
                            // ListFooterComponent={this._renderFooterLoading}
                            style={{ flex: 1, backgroundColor: Colors.white }}
                            renderItem={({ item, index }) => (
                                <ProfileAdditionItem
                                    item={item}
                                    state={this.state[`${item}`]}
                                    onFinish={(file, isResetFile) => {
                                        if (isResetFile && !this.state[`${item}`]?.isNew) {
                                            this.setState({
                                                [`${item}`]: {
                                                    ...this.state[`${item}`],
                                                    value: [...file.slice(this.state[`${item}`]?.value.length)],
                                                    isNew: true,
                                                    refresh: !this.state[`${item}`]?.refresh
                                                },
                                                isReadOnlyButton: false
                                            });
                                        } else {
                                            this.setState({
                                                [`${item}`]: {
                                                    ...this.state[`${item}`],
                                                    value: file,
                                                    isNew: true,
                                                    refresh: !this.state[`${item}`]?.refresh
                                                },
                                                isReadOnlyButton: false
                                            });
                                        }
                                    }}
                                />
                            )}
                            keyExtractor={(item, index) => {
                                return index;
                            }}
                            refreshControl={
                                <RefreshControl
                                    onRefresh={() => this._handleRefresh()}
                                    refreshing={refreshing}
                                    size="large"
                                    tintColor={Colors.primary}
                                />
                            }
                            onEndReached={aa => {
                                // this.callOnEndReached = true;
                                if (!this.endLoading) {
                                    this.endLoading = true;
                                    this._handleEndRefresh();
                                }
                            }}
                            onEndReachedThreshold={0.5} // khoan cach tinh tu vi tri cuoi ds , se goi onEndReached
                        />
                    </View>

                    {/* button */}
                    {(isPermissionButtonSendHR || isPermissionButtonSaveTemp) && (
                        <View style={styleComonAddOrEdit.wrapButtonHandler}>
                            {isPermissionButtonSendHR && (
                                <TouchableOpacity
                                    style={styleComonAddOrEdit.wrapBtnRegister}
                                    // disabled={isReadOnlyButton}
                                    onPress={() => {
                                        this.onSaveAndSend();
                                    }}
                                >
                                    <VnrText
                                        style={[styleSheets.lable, styleComonAddOrEdit.styRegister]}
                                        i18nKey={'HRM_PortalApp_SendHR'}
                                    />
                                </TouchableOpacity>
                            )}

                            {isPermissionButtonSaveTemp && (
                                <TouchableOpacity
                                    style={styleComonAddOrEdit.btnSaveTemp}
                                    // disabled={isReadOnlyButton}
                                    onPress={() => {
                                        this.onSaveTemp();
                                    }}
                                >
                                    <IconSave size={Size.iconSize} color={'#000'} />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </SafeAreaViewDetail>
        );
    }
}

const PADDING_DEFINE = Size.defineSpace;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    wrapDeadline: {
        backgroundColor: Colors.yellow_6,
        paddingHorizontal: 4,
        alignSelf: 'baseline',
        borderRadius: 4,
        marginVertical: 4
    },

    textRequestDocAndBtn: {
        fontSize: Size.text + 2,
        color: Colors.gray_10
    },

    progressbar: {
        flex: 0.8,
        maxWidth: '80%',
        height: 5,
        backgroundColor: Colors.gray_4,
        borderRadius: 4
    },

    wrapMiddle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 6
    },
    viewStatusBottom: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: PADDING_DEFINE / 2,
        paddingRight: Size.defineSpace,
        flexDirection: 'row'
    },
    lineSatus: {
        // paddingHorizontal: 3,
        alignItems: 'center',
        // paddingVertical: 2,
        padding: 4
    },

    lineSatus_text: {
        fontSize: Size.text - 3,
        fontWeight: '500'
    },

    viewContentTopRight: {
        justifyContent: 'center',
        paddingRight: 12,
        marginLeft: 12
    },

    wrapAbove: {
        padding: 12,
        backgroundColor: Colors.white
    },

    wrapSelectTypeDocs: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

const mapStateToProps = state => {
    return {
        dataProfileAdded: state.profileAddition.dataProfileAdded
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setProfileAdded: data => {
            dispatch(profileAddition.actions.setProfileAdded(data));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileAddition);
