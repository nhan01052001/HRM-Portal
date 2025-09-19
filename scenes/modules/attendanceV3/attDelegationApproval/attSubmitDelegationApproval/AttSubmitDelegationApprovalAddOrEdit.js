import React, { Component } from 'react';
import {
    View,
    Modal,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    Text
} from 'react-native';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../../constants/styleConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ToasterInModal, ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertInModal } from '../../../../../components/Alert/Alert';
import VnrText from '../../../../../components/VnrText/VnrText';
import { IconCancel, IconCloseCircle } from '../../../../../constants/Icons';
import AttSubmitDelegationApprovalComponent from './AttSubmitDelegationApprovalComponent';
import ListButtonRegister from '../../../../../componentsV3/ListButtonRegister/ListButtonRegister';
import { EnumIcon, EnumName } from '../../../../../assets/constant';
import { translate } from '../../../../../i18n/translate';
import HttpService from '../../../../../utils/HttpService';
import { ScrollView } from 'react-native';
import VnrIndeterminate from '../../../../../components/VnrLoading/VnrIndeterminate';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';

const initSateDefault = {
    Profile: {
        ID: null,
        ProfileName: ''
    },
    params: null,
    isShowModal: false,
    modalErrorDetail: {
        isModalVisible: false,
        cacheID: null,
        data: []
    },
    fieldConfig: {
        UserDelegateIDs: {
            visibleConfig: true,
            isValid: true
        },
        DataTypeDelegate: {
            visibleConfig: true,
            isValid: true
        },
        Note: {
            visibleConfig: true,
            isValid: false
        },
        DateFromTo: {
            visibleConfig: true,
            isValid: true
        }
    },
    isShowLoading: false
};

export default class AttSubmitDelegationApprovalAddOrEdit extends Component {
    constructor(props) {
        super(props);
        this.state = initSateDefault;
        // khai báo các biến this trong hàm setVariable

        this.refFlatList = null;
        // Thông báo chi tiết lỗi
        this.IsContinueSave = false;
        this.ProfileRemoveIDs = null;
        this.IsRemoveAndContinue = null;
        this.CacheID = null;

        this.ToasterSevice = {
            showError: null,
            showSuccess: null,
            showWarning: null,
            showInfo: null
        };

        this.listRefGetDataSave = {};
    }

    refreshForm = () => {
        if (typeof this.listRefGetDataSave['1'].unduData === 'function')
            this.listRefGetDataSave['1'].unduData();
    }

    showLoading = isShow => {
        this.setState({
            isShowLoading: isShow
        });
    };

    _renderHeaderLoading = () => {
        if (this.state.isShowLoading) {
            return (
                <View style={styleComonAddOrEdit.styLoadingHeader}>
                    <View style={styleComonAddOrEdit.styViewLoading} />
                    <VnrIndeterminate isVisible={this.state.isShowLoading} />
                </View>
            );
        } else return <View />;
    };

    // Step 1: Gọi hàm onShow để tạo mới hoặc chỉnh sửa hoặc onShowFromWorkDay để tạo mới
    onShow = params => {
        const profileInfo = dataVnrStorage
            ? dataVnrStorage.currentUser
                ? dataVnrStorage.currentUser.info
                : null
            : null;

        const { E_ProfileID, E_FullName } = EnumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] };

        const { Profile } = this.state;

        let nextState = {
            Profile: {
                ...Profile,
                ..._profile
            }
        };

        this.setState(
            {
                ...nextState,
                ...{ ...initSateDefault },
                params: { ...params },
                isShowModal: true
            });
    };

    onClose = () => {
        this.setState({
            isShowModal: false
        });
    };

    onScrollToInputIOS = (index, height) => {
        try {
            if (this.refFlatList && this.refFlatList.scrollToOffset && index && height) {
                setTimeout(() => {
                    this.refFlatList.scrollToOffset({ animated: true, offset: height * index - 200 });
                }, 260);
            }
        } catch (error) {
            //
        }
    };


    ToasterSeviceCallBack = () => {
        return this.ToasterSevice;
    };

    renderItems = () => {
        const { fieldConfig } = this.state;


        return (
            <FlatList
                ref={refs => (this.refFlatList = refs)}
                style={styles.styFlatListContainer}
                data={[1]}
                renderItem={({ item, index }) => {
                    return <AttSubmitDelegationApprovalComponent
                        ToasterSevice={this.ToasterSeviceCallBack}
                        ref={(ref) => {
                            this.listRefGetDataSave[`${item}`] = ref;
                        }} fieldConfig={fieldConfig} dataItem={item} onScrollToInputIOS={this.onScrollToInputIOS} key={index} index={index} />;
                }}
                keyExtractor={(item, index) => index}
                ItemSeparatorComponent={() => <View style={styleComonAddOrEdit.separate} />}
            />
        );
    }

    SaveCacheViolation = (dataError) => {
        this.showLoading(true);
        HttpService.Post('[URI_HR]/Att_GetData/SaveCacheViolation', { ...dataError }).then(res => {
            this.showLoading(false);
            if (typeof res === 'string' && res === 'True') {
                this.getErrorMessageRespone();
            }
        });
    }

    onSave = (isSend, isconfirm) => {
        const { params, modalErrorDetail } = this.state;


        if (typeof this.listRefGetDataSave['1']?.getAllData !== 'function')
            return;

        let payload = this.listRefGetDataSave['1'].getAllData();

        payload = {
            ...payload,
            Status: 'E_WAITING_CONFIRM',
            IsPortal: true,
            UserSubmit: dataVnrStorage.currentUser?.info?.ProfileID,
            UserID: dataVnrStorage.currentUser?.headers?.userid
        };

        const callSave = () => {
            this.isProcessing = true;
            this.showLoading(true);
            HttpService.Post('[URI_SYS]/api/Sys_DelegateApprove', payload).then(res => {
                this.isProcessing = false;
                this.showLoading(false);
                if (res) {
                    if (res?.ActionStatus == EnumName.E_Success) {
                        this.onClose();

                        ToasterSevice.showSuccess('Hrm_Succeed', 5500);

                        const { reload } = params;
                        if (reload && typeof reload === 'function') {
                            reload();
                        }
                    } else if (res?.ActionStatus == EnumName.E_FAIL || res?.ErrorRespone) {
                        res.Data = res?.ErrorRespone;

                        if (res.Data) {
                            if (res.Data.IsBlock == true) {
                                if (res.Data.IsRemoveAndContinue) {
                                    this.AlertSevice.alert({
                                        title: translate('Hrm_Notification'),
                                        iconType: EnumIcon.E_WARNING,
                                        message: translate(
                                            'HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'
                                        ),
                                        //lưu và tiếp tục
                                        colorSecondConfirm: Colors.primary,
                                        textSecondConfirm: translate('Button_OK'),
                                        onSecondConfirm: () => {
                                            this.ProfileRemoveIDs = res.Data.ProfileRemoveIDs;
                                            this.IsRemoveAndContinue = true;
                                            this.CacheID = res.Data.CacheID;
                                            this.onSave(isSend);
                                        },
                                        //đóng
                                        onCancel: () => { },
                                        //chi tiết lỗi
                                        textRightButton: translate('Button_Detail'),
                                        onConfirm: () => {
                                            this.setState(
                                                {
                                                    modalErrorDetail: {
                                                        ...modalErrorDetail,
                                                        cacheID: res.Data.CacheID,
                                                        isModalVisible: true
                                                    }
                                                },
                                                () => {
                                                    this.SaveCacheViolation(res.Data);
                                                }
                                            );
                                        }
                                    });
                                } else {
                                    this.AlertSevice.alert({
                                        title: translate('Hrm_Notification'),
                                        iconType: EnumIcon.E_WARNING,
                                        message: translate(
                                            'HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'
                                        ),
                                        textRightButton: translate('Button_Detail'),
                                        //đóng popup
                                        onCancel: () => { },
                                        //chi tiết lỗi
                                        onConfirm: () => {
                                            this.setState(
                                                {
                                                    modalErrorDetail: {
                                                        ...modalErrorDetail,
                                                        cacheID: res.Data.CacheID,
                                                        isModalVisible: true
                                                    }
                                                },
                                                () => {
                                                    this.SaveCacheViolation(res.Data);
                                                }
                                            );
                                        }
                                    });
                                }
                            } else {
                                this.AlertSevice.alert({
                                    title: translate('Hrm_Notification'),
                                    iconType: EnumIcon.E_WARNING,
                                    message: translate('HRM_Attendance_Message_InvalidRequestDataDoYouWantToSave'),
                                    //lưu và tiếp tục
                                    colorSecondConfirm: Colors.primary,
                                    textSecondConfirm: translate('Button_OK'),
                                    onSecondConfirm: () => {
                                        this.IsContinueSave = true;
                                        this.ProfileRemoveIDs = res.Data.ProfileRemoveIDs;
                                        this.IsRemoveAndContinue = true;
                                        this.CacheID = res.Data.CacheID;
                                        this.onSave(isSend);
                                    },
                                    //đóng
                                    onCancel: () => { },
                                    //chi tiết lỗi
                                    textRightButton: translate('Button_Detail'),
                                    onConfirm: () => {
                                        this.setState(
                                            {
                                                modalErrorDetail: {
                                                    ...modalErrorDetail,
                                                    cacheID: res.Data.CacheID,
                                                    isModalVisible: true
                                                }
                                            },
                                            () => {
                                                this.getErrorMessageRespone();
                                            }
                                        );
                                    }
                                });
                            }
                        } else if (res.Message) {
                            this.ToasterSevice.showWarning(res.Message, 4000);
                        }
                    } else if (res?.ActionStatus == 'Hrm_Locked') {
                        this.ToasterSevice.showWarning('Hrm_Locked', 4000);
                    } else if (res?.ActionStatus == 'INVALID_REQUEST_VALIDATOR') {
                        this.ToasterSevice.showError(res?.Data[0]?.description, 4000);
                    } else if (res.Message) {
                        this.ToasterSevice.showWarning(res.Message, 4000);
                    }
                }
            });
        };

        if (isconfirm) {
            this.AlertSevice.alert({
                iconType: EnumIcon.E_CONFIRM,
                title: 'HRM_PortalApp_OnSave_Temp',
                message: 'HRM_PortalApp_OnSave_Temp_Message',
                onCancel: () => { },
                onConfirm: () => {
                    callSave();
                }
            });
        } else {
            callSave();
        }
    }

    //#region [xử lý group theo Message để thông báo lỗi]
    groupByMessage = (array, key) => {
        // Return the end result
        return array.reduce((result, currentValue) => {
            // If an array already present for key, push it to the array. Else create an array and push the object
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
            return result;
        }, {}); // empty object is the initial value for result object
    };

    mappingDataGroup = dataGroup => {
        let dataSource = [];
        let key = '';
        for (key in dataGroup) {
            let title =
                translate('HRM_Attendance_Message_MessageName') +
                ': ' +
                key +
                ' (' +
                translate('NumberCount') +
                ': ' +
                dataGroup[key].length +
                ')';

            dataSource = [...dataSource, { Type: 'E_GROUP', TitleGroup: title }, ...dataGroup[key]];
        }

        return dataSource;
    };

    renderErrorDetail = () => {
        const { modalErrorDetail } = this.state,
            { data } = modalErrorDetail;

        if (data) {
            const dataGroup = this.groupByMessage(data, 'MessageName'),
                dataSourceError = this.mappingDataGroup(dataGroup);

            return dataSourceError.map((dataItem, index) => {
                let viewContent = <View />;
                if (dataItem['Type'] && dataItem['Type'] == 'E_GROUP') {
                    viewContent = (
                        <View style={styles.styleViewTitleGroup}>
                            <VnrText
                                style={[styleSheets.lable, styles.styFontErrTitle]}
                                i18nKey={dataItem['TitleGroup']}
                            />
                        </View>
                    );
                } else {
                    viewContent = (
                        <View style={styles.styFontErrInfo}>
                            <View style={styles.styFontErrLine}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styles.styFontErrText]}
                                    i18nKey={'HRM_PortalApp_Message_ErrorCodeEmp'}
                                />

                                <View style={styles.styFontErrVal}>
                                    <Text numberOfLines={1} style={[styleSheets.textItalic, styles.styFontErrText]}>
                                        {dataItem['CodeEmp']}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.styFontErrLine}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styles.styFontErrText]}
                                    i18nKey={'HRM_PortalApp_Message_ErrorProfileName'}
                                />

                                <View style={styles.styFontErrVal}>
                                    <Text numberOfLines={1} style={[styleSheets.textItalic, styles.styFontErrText]}>
                                        {dataItem['ProfileName']}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.styFontErrLine}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styles.styFontErrText]}
                                    i18nKey={'HRM_PortalApp_Message_ErrorDescription'}
                                />

                                <View style={styles.styFontErrVal}>
                                    <Text style={[styleSheets.textItalic, styles.styFontErrText]}>
                                        {dataItem['ErrorDescription']}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    );
                }

                return (
                    <View
                        key={index}
                        style={[
                            styles.styleViewBorderButtom,
                            dataSourceError.length - 1 == index && styles.styleViewNoBorder
                        ]}
                    >
                        {viewContent}
                    </View>
                );
            });
        } else {
            return <View />;
        }
    };

    getErrorMessageRespone() {
        const { modalErrorDetail } = this.state,
            { cacheID } = modalErrorDetail;

        this.showLoading(true);
        HttpService.Post('[URI_HR]/Att_GetData/GetErrorMessageRespone', { cacheID: cacheID }).then(res => {
            console.log(res, 'res');

            this.showLoading(false);
            if (res && Array.isArray(res.Data) && res.Data.length > 0) {
                const data = res.Data;
                this.setState({
                    modalErrorDetail: {
                        ...modalErrorDetail,
                        data: data
                    }
                });
            }
        });
    }

    closeModalErrorDetail = () => {
        let nextState = {
            modalErrorDetail: {
                ...this.state.modalErrorDetail,
                isModalVisible: false
            }
        };

        this.setState(nextState);
    };
    //#endregion

    render() {
        const { isShowModal, modalErrorDetail } = this.state;

        const listActions = [];
        listActions.push({
            type: EnumName.E_REFRESH,
            title: '',
            onPress: () => this.refreshForm()
        });

        listActions.push({
            type: EnumName.E_REGISTER,
            title: 'HRM_PortalApp_Register',
            onPress: () => this.onSave()
        });

        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={isShowModal}
                style={{ ...CustomStyleSheet.padding(0), ...CustomStyleSheet.margin(0) }}
            >
                <SafeAreaView style={styleComonAddOrEdit.wrapInsideModal}>
                    <ToasterInModal
                        ref={refs => {
                            this.ToasterSevice = refs;
                        }}
                    />
                    <AlertInModal ref={refs => (this.AlertSevice = refs)} />

                    <View style={styleComonAddOrEdit.flRowSpaceBetween}>
                        <VnrText
                            style={[
                                styleSheets.lable,
                                styleComonAddOrEdit.styHeaderText,
                                CustomStyleSheet.fontWeight('700')
                            ]}
                            i18nKey={'HRM_PortalApp_RegisterApprovalDelegation'}
                        />
                        <TouchableOpacity onPress={() => this.onClose()}>
                            <IconCancel size={Size.iconSize} color={Colors.gray_8} />
                        </TouchableOpacity>
                    </View>

                    {this._renderHeaderLoading()}

                    <KeyboardAvoidingView
                        scrollEnabled={true}
                        style={styleComonAddOrEdit.styAvoiding}
                        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                    >
                        {
                            this.renderItems()
                        }
                    </KeyboardAvoidingView>
                    {/* button */}
                    <ListButtonRegister listActions={listActions} />
                </SafeAreaView>
                {modalErrorDetail.isModalVisible && (
                    <Modal animationType="slide" transparent={true} isVisible={true}>
                        <View style={styles.wrapModalError}>
                            <TouchableOpacity
                                style={[styles.bgOpacity]}
                                onPress={() => this.closeModalErrorDetail()}
                            />
                            <SafeAreaView style={styles.wrapContentModalError}>
                                <View style={styles.wrapTitileHeaderModalError}>
                                    <VnrText
                                        style={[styleSheets.text, styles.styRegister, styles.fS16fW600]}
                                        i18nKey={'HRM_PortalApp_Message_ErrorDetail'}
                                    />

                                    <TouchableOpacity onPress={() => this.closeModalErrorDetail()}>
                                        <IconCloseCircle size={Size.iconSize} color={Colors.white} />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView style={styles.wrapLevelError}>
                                    {this.renderErrorDetail()}
                                </ScrollView>
                            </SafeAreaView>
                        </View>
                    </Modal>
                )}
            </Modal>
        );
    }
}

const styles = styleComonAddOrEdit;