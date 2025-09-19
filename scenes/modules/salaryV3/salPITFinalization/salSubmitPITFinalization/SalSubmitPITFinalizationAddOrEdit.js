import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    Modal,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styleSheets, Size, Colors, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { IconSave, IconCloseCircle, IconCancel } from '../../../../../constants/Icons';
import HttpService from '../../../../../utils/HttpService';
import { ToasterSevice, ToasterInModal } from '../../../../../components/Toaster/Toaster';
import { translate } from '../../../../../i18n/translate';
import { AlertInModal } from '../../../../../components/Alert/Alert';
import { EnumName, EnumIcon } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import SalSubmitPITFinalizationComponent from './SalSubmitPITFinalizationComponent';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';
import VnrIndeterminate from '../../../../../components/VnrLoading/VnrIndeterminate';
import DrawerServices from '../../../../../utils/DrawerServices';

const initSateDefault = {
    isRefresh: false,
    Profile: {
        ID: null,
        ProfileName: ''
    },
    fieldValid: {},
    params: null,
    isShowModal: false,
    isShowLoading: false,
    isDisableBtnsave: true,
    fieldConfig: {
        YearFormat: {
            visibleConfig: true,
            isValid: true
        },
        RequestDate: {
            visibleConfig: true,
            isValid: false
        },
        CodeTax: {
            visibleConfig: true,
            isValid: false
        },
        RegisterType: {
            visibleConfig: true,
            isValid: true
        },
        Note: {
            visibleConfig: true,
            isValid: false
        },
        FileAttachment: {
            visibleConfig: true,
            isValid: false
        }
    },
    isPassRecord: false,
    modalErrorDetail: {
        isModalVisible: false,
        cacheID: null,
        data: []
    }
};

export default class SalSubmitPITFinalizationAddOrEdit extends Component {
    constructor(props) {
        super(props);
        this.state = initSateDefault;
        //this.refVnrDateFromTo = null;
        //this.isStatusVnrDateFromTo = false;
        this.listRefGetDataSave = {};
        // khai báo các biến this trong hàm setVariable
        this.setVariable();
    }

    setVariable = () => {
        // Bao nhiêu cấp duyệt
        this.levelApprove = null;
        this.isModify = false;
    };

    //#region [khởi tạo - check đăng ký hộ, lấy các dữ liệu cho control, lấy giá trị mặc đinh]
    refreshView = () => {
        // this.props.navigation.setParams({ title: 'HRM_Category_ShiftItem_Overtime_Create_Title' });
        this.setVariable();
        this.setState(initSateDefault, () => this.getConfigValid());
    };
    //promise get config valid

    getConfigValid = () => {
        let { fieldConfig } = this.state;

        const tblName = 'HumanResources_FormRegisterStopWorking';
        HttpService.MultiRequest([
            HttpService.Get(`[URI_CENTER]/api/Sys_common/GetValidateJson?listFormId=${tblName}`),
            HttpService.Post('[URI_CENTER]/api/Hre_GetData/GetByFieldSysCodeConfig', {
                TableName: 'Sal_PITFinalizationDelegatee'
            })
        ]).then((resAll) => {
            const [res, codeConfig] = resAll;
            const data = res.Status == EnumName.E_SUCCESS && res.Data && res.Data[tblName] ? res.Data[tblName] : null;
            if (data && Object.keys(data).length > 0) {
                const listControl = Object.keys(fieldConfig);
                listControl.forEach((key) => {
                    if (data[key] && data[key]['hasInApp']) {
                        const { validation } = data[key];
                        fieldConfig = {
                            ...fieldConfig,
                            [key]: {
                                visibleConfig: data[key] && data[key]['hidden'] == true ? false : true,
                                isValid: validation && validation.nullable == false ? true : false
                            }
                        };
                    }
                });
            }
            if (codeConfig && codeConfig.Status == EnumName.E_SUCCESS && codeConfig.Data && codeConfig.Data[0])
                fieldConfig = {
                    ...fieldConfig,
                    CodeTax: {
                        ...fieldConfig.CodeTax,
                        disable: codeConfig.Data[0].IsEdit
                    }
                };

            this.setState(
                {
                    fieldConfig
                },
                () => {
                    const { params } = this.state;
                    let { record = null } = params;

                    if (!record) {
                        // [CREATE] Step 3: Tạo mới
                        this.isModify = false;
                        this.initData();
                    } else {
                        // [EDIT] Step 3: Chỉnh sửa
                        this.isModify = true;
                        this.getRecordAndConfigByID(record, this.handleSetState);
                    }
                }
            );
        });
    };

    componentDidMount() {
        //get config validate
        // this.getConfigValid('New_Portal_Att_Overtime')
    }

    handleSetState = (response) => {
        let nextState = {
            isShowModal: true,
            ID: response.ID,
            Profile: {
                ID: response.ProfileID,
                ProfileName: response.ProfileName
            }
        };
        this.setState(nextState);
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        // trường hợp có get config thì vào hàm này get
        _handleSetState(record);
    };
    //#endregion

    initData = () => {
        this.showLoading(false);
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
            },
            isShowModal: true
        };

        this.setState(nextState);
    };

    refreshForm = () => {
        this.AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            title: 'HRM_PortalApp_OnReset',
            message: 'HRM_PortalApp_OnReset_Message',
            onCancel: () => {},
            onConfirm: () => {
                const { params } = this.state;

                let { record = null } = params;

                if (record) {
                    // Nếu bấm refresh khi Chỉnh sửa
                    this.isModify = true;
                    this.getRecordAndConfigByID(record, this.handleSetState);
                }

                Object.keys(this.listRefGetDataSave).map((key) => {
                    if (this.listRefGetDataSave[key]) {
                        this.listRefGetDataSave[key].unduData();
                    }
                });
            }
        });
    };

    //#endregion

    //#region [lưu]
    onSaveAndSend = () => {
        this.onSave(true);
    };

    onSaveTemp = () => {
        this.AlertSevice.alert({
            iconType: EnumIcon.E_CONFIRM,
            title: 'HRM_PortalApp_OnSave_Temp',
            message: 'HRM_PortalApp_OnSave_Temp_Message',
            onCancel: () => {},
            onConfirm: () => {
                this.onSave();
            }
        });
    };

    getPayload = (isSend) => {
        const { params, modalErrorDetail } = this.state,
            { record = null } = params;

        let payload = {};
        if (this.listRefGetDataSave && Object.keys(this.listRefGetDataSave).length > 0) {
            Object.keys(this.listRefGetDataSave).map((key) => {
                if (this.listRefGetDataSave[key]) {
                    const data = this.listRefGetDataSave[key].getAllData();
                    if (data) {
                        payload = {
                            ...payload,
                            ...data
                        };
                    }
                }
            });
        }

        if (!isSend) {
            payload = {
                ...payload,
                IsSaveTemp: true
            };
        }

        if (this.IsContinueSave && (this.CacheID || modalErrorDetail.cacheID)) {
            payload = {
                ...payload,
                IsContinueSave: true,
                CacheID: this.CacheID ? this.CacheID : modalErrorDetail.cacheID
            };
        }

        if (this.isModify === true && params && record) {
            payload = {
                ...payload,
                ID: record && record.ID ? record.ID : null,
                Status: record.Status
            };
        }
        return payload;
    };

    onSave = (isSend) => {
        let payload = this.getPayload(isSend);
        const { modalErrorDetail } = this.state;
        this.isProcessing = true;
        this.showLoading(true);
        HttpService.Post('[URI_CENTER]api/Sal_PITFinalizationDelegatee/CreateOrUpdatePITFinalizationDelegatee', payload)
            .then((res) => {
                this.isProcessing = false;
                this.showLoading(false);
                if (res && typeof res === EnumName.E_object) {
                    if (res.Status == EnumName.E_SUCCESS) {
                        this.IsContinueSave = false;
                        this.CacheID = null;
                        this.onClose();

                        ToasterSevice.showSuccess('Hrm_Succeed', 5500);

                        const { reload } = this.state?.params;
                        if (reload && typeof reload === 'function') {
                            reload();
                        }
                    } else if (res.Status == EnumName.E_FAIL) {
                        if (res.Data) {
                            if (res?.Data?.ActionStatus) {
                                this.ToasterSevice.showWarning(res?.Data?.ActionStatus, 4000);
                            } else if (res.Data.IsBlock == true) {
                                if (res.Data.IsRemoveAndContinue) {
                                    this.AlertSevice.alert({
                                        title: translate('Hrm_Notification'),
                                        iconType: EnumIcon.E_WARNING,
                                        message: translate('HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'),
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
                                        onCancel: () => {},
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
                                } else {
                                    this.AlertSevice.alert({
                                        title: translate('Hrm_Notification'),
                                        iconType: EnumIcon.E_WARNING,
                                        message: translate('HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'),
                                        textRightButton: translate('Button_Detail'),
                                        //đóng popup
                                        onCancel: () => {},
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
                                                    this.getErrorMessageRespone();
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
                                    onCancel: () => {},
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
                    } else if (res && res.Data && res.Data[0]?.description) {
                        this.ToasterSevice.showWarning(res.Data[0]?.description, 4000);
                    } else if (res.Message) {
                        this.ToasterSevice.showWarning(res.Message, 4000);
                    } else {
                        this.ToasterSevice.showWarning('Hrm_Fail', 4000);
                    }
                }
            })
            .catch((error) => {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            });
    };
    //#endregion

    onClose = () => {
        this.setState({
            isShowModal: false
        });
    };

    // Step 1: Gọi hàm onShow để tạo mới hoặc chỉnh sửa hoặc onShowFromWorkDay để tạo mới
    onShow = (params) => {
        this.setState(
            {
                ...{ ...initSateDefault },
                params: params
            },
            () => {
                // Step 2: Lấy cấu hình ẩn hiện
                this.getConfigValid();
            }
        );
    };

    showLoading = (isShow) => {
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

    ToasterSeviceCallBack = () => {
        return this.ToasterSevice;
    };

    onScrollToInputIOS = (index, height) => {
        try {
            if (this.refFlatList && this.refFlatList.scrollToOffset && index && height) {
                setTimeout(() => {
                    this.refFlatList.scrollToOffset({ animated: true, offset: height * index - 200 });
                }, 260);
            }
        } catch (error) {
            return;
        }
    };

    renderBtnSave = () => {
        const { isDisableBtnsave } = this.state;
        if (isDisableBtnsave) {
            return (
                <View
                    style={[
                        styleComonAddOrEdit.wrapBtnRegister,
                        {
                            backgroundColor: Colors.gray_3
                        }
                    ]}
                >
                    <Text style={[styleSheets.lable, styleComonAddOrEdit.styRegister, { color: Colors.gray_7 }]}>
                        {translate('HRM_PortalApp_Register')}
                    </Text>
                </View>
            );
        } else {
            return (
                <TouchableOpacity style={styleComonAddOrEdit.wrapBtnRegister} onPress={() => this.onSaveAndSend()}>
                    <Text style={[styleSheets.lable, styleComonAddOrEdit.styRegister]}>
                        {translate('HRM_PortalApp_Register')}
                    </Text>
                </TouchableOpacity>
            );
        }
    };

    renderItems = () => {
        const { fieldConfig, params } = this.state;
        const newKey = Vnr_Function.MakeId(10);
        return (
            <FlatList
                ref={(refs) => (this.refFlatList = refs)}
                style={styles.styFlatListContainer}
                data={[{}]}
                renderItem={({ index }) => (
                    <SalSubmitPITFinalizationComponent
                        key={index}
                        ref={(refCom) => {
                            this.listRefGetDataSave[`${newKey}`] = refCom;
                        }}
                        indexDay={index}
                        record={params?.record}
                        fieldConfig={fieldConfig}
                        showLoading={this.showLoading}
                        ToasterSevice={() => this.ToasterSeviceCallBack}
                        onScrollToInputIOS={this.onScrollToInputIOS}
                        setDisableSave={this.setDisableSave}
                    />
                )}
                keyExtractor={(item, index) => index}
                ItemSeparatorComponent={() => <View style={styles.separate} />}
            />
        );
    };

    setDisableSave = (bool) => {
        this.setState({
            isDisableBtnsave: bool
        });
    };

    getErrorMessageRespone() {
        const { modalErrorDetail, Profile } = this.state,
            { cacheID } = modalErrorDetail;

        if (cacheID) {
            this.showLoading(true);
            HttpService.Post('[URI_CENTER]/api/Att_GetData/GetErrorMessageRespone', {
                cacheID: cacheID,
                IsPortal: true,
                ProfileID: Profile.ID
            }).then((res) => {
                this.showLoading(false);
                if (res && res.Data && res.Status == EnumName.E_SUCCESS) {
                    const data = res.Data.Data;
                    this.setState({
                        modalErrorDetail: {
                            ...modalErrorDetail,
                            data: data
                        }
                    });
                }
            });
        }
    }

    renderErrorDetail = () => {
        const { modalErrorDetail } = this.state,
            { data } = modalErrorDetail;

        if (data && data.length > 0) {
            const dataGroup = this.groupByMessage(data, 'MessageName'),
                dataSourceError = this.mappingDataGroup(dataGroup);

            return dataSourceError.map((dataItem, index) => {
                let viewContent = <View />;
                if (dataItem['Type'] && dataItem['Type'] == 'E_GROUP') {
                    viewContent = (
                        <View style={styleComonAddOrEdit.styleViewTitleGroup}>
                            <Text style={[styleSheets.lable, styleComonAddOrEdit.styFontErrTitle]}>
                                {dataItem['TitleGroup'] ? dataItem['TitleGroup'] : ''}
                            </Text>
                        </View>
                    );
                } else {
                    viewContent = (
                        <View style={styleComonAddOrEdit.styFontErrInfo}>
                            <View style={styleComonAddOrEdit.styFontErrLine}>
                                <Text style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}>
                                    {translate('HRM_PortalApp_Message_ErrorCodeEmp')}
                                </Text>

                                <View style={styleComonAddOrEdit.styFontErrVal}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    >
                                        {dataItem['CodeEmp']}
                                    </Text>
                                </View>
                            </View>

                            <View style={styleComonAddOrEdit.styFontErrLine}>
                                <Text
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                >
                                    {translate('HRM_PortalApp_Message_ErrorProfileName')}
                                </Text>

                                <View style={styleComonAddOrEdit.styFontErrVal}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    >
                                        {dataItem['ProfileName']}
                                    </Text>
                                </View>
                            </View>

                            <View style={styleComonAddOrEdit.styFontErrLine}>
                                <Text
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                >
                                    {translate('HRM_PortalApp_Message_ErrorDescription')}
                                </Text>

                                <View style={[styleComonAddOrEdit.styFontErrVal, CustomStyleSheet.marginLeft(6)]}>
                                    <Text style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}>
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
                            styleComonAddOrEdit.styleViewNoBorder,
                            dataSourceError.length - 1 == index && styleComonAddOrEdit.styleViewNoBorder,
                            CustomStyleSheet.marginBottom(12)
                        ]}
                    >
                        {viewContent}
                    </View>
                );
            });
        } else {
            return (
                <View style={styles.noData}>
                    <Text style={[styleComonAddOrEdit.styHeaderText, { color: Colors.white }]}>
                        {translate('HRM_HR_NoneData')}
                    </Text>
                </View>
            );
        }
    };

    groupByMessage = (array, key) => {
        // Return the end result
        return array.reduce((result, currentValue) => {
            // If an array already present for key, push it to the array. Else create an array and push the object
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
            return result;
        }, {}); // empty object is the initial value for result object
    };

    mappingDataGroup = (dataGroup) => {
        let dataSource = [];
        // eslint-disable-next-line no-unused-vars
        for (let key in dataGroup) {
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

    closeModalErrorDetail = () => {
        let nextState = {
            modalErrorDetail: {
                ...this.state.modalErrorDetail,
                isModalVisible: false
            }
        };

        this.setState(nextState);
    };

    render() {
        const { Profile, isShowModal, isDisableBtnsave, modalErrorDetail } = this.state;

        return (
            <View style={styles.container}>
                {Profile.ID && (
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={isShowModal} //isShowModal
                        style={{ ...CustomStyleSheet.padding(0), ...CustomStyleSheet.margin(0) }}
                    >
                        <SafeAreaView style={styleComonAddOrEdit.wrapInsideModal}>
                            <ToasterInModal
                                ref={(refs) => {
                                    this.ToasterSevice = refs;
                                }}
                            />
                            <AlertInModal ref={(refs) => (this.AlertSevice = refs)} />

                            <View style={styleComonAddOrEdit.flRowSpaceBetween}>
                                <Text
                                    style={[
                                        styleSheets.lable,
                                        styleComonAddOrEdit.styHeaderText,
                                        CustomStyleSheet.fontWeight('700')
                                    ]}
                                >
                                    {this.isModify
                                        ? translate('HRM_PortalApp_PITFinalization_Edit')
                                        : translate('HRM_PortalApp_PITFinalization_AddNew')}
                                </Text>
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
                                {this.renderItems()}
                            </KeyboardAvoidingView>

                            {/* button */}
                            <View style={styleComonAddOrEdit.wrapButtonHandler}>
                                <TouchableOpacity
                                    style={styleComonAddOrEdit.btnRefresh}
                                    onPress={() => this.refreshForm()}
                                >
                                    <Image
                                        style={{ width: Size.iconSize, height: Size.iconSize }}
                                        resizeMode="cover"
                                        source={require('../../../../../assets/images/vnrDateFromTo/reset-sm.png')}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    disabled={isDisableBtnsave}
                                    style={styleComonAddOrEdit.btnSaveTemp}
                                    onPress={() => this.onSaveTemp()}
                                >
                                    <IconSave size={Size.iconSize} color={'#000'} />
                                </TouchableOpacity>

                                {this.renderBtnSave()}
                            </View>
                        </SafeAreaView>

                        {modalErrorDetail.isModalVisible && (
                            <Modal animationType="slide" transparent={true} isVisible={true}>
                                <View style={styleComonAddOrEdit.wrapModalError}>
                                    <TouchableOpacity
                                        style={[styleComonAddOrEdit.bgOpacity]}
                                        onPress={() => this.closeModalErrorDetail()}
                                    />
                                    <View style={styleComonAddOrEdit.wrapContentModalError}>
                                        <View style={styleComonAddOrEdit.wrapTitileHeaderModalError}>
                                            <Text
                                                style={[
                                                    styleSheets.text,
                                                    styleComonAddOrEdit.styRegister,
                                                    styleComonAddOrEdit.fS16fW600
                                                ]}
                                            >
                                                {translate('HRM_PortalApp_Message_ErrorDetail')}
                                            </Text>

                                            <TouchableOpacity onPress={() => this.closeModalErrorDetail()}>
                                                <IconCloseCircle size={Size.iconSize} color={Colors.white} />
                                            </TouchableOpacity>
                                        </View>
                                        <ScrollView
                                            style={[
                                                styleComonAddOrEdit.wrapLevelError,
                                                CustomStyleSheet.paddingHorizontal(8)
                                            ]}
                                        >
                                            {this.renderErrorDetail()}
                                        </ScrollView>
                                    </View>
                                </View>
                            </Modal>
                        )}
                    </Modal>
                )}
            </View>
        );
    }
}

const styles = styleComonAddOrEdit;
