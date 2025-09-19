import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleSafeAreaView,
    Size,
    Colors,
    stylesListPickerControl,
    styleValid,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import { translate } from '../../../../../i18n/translate';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import DrawerServices from '../../../../../utils/DrawerServices';
import HttpService from '../../../../../utils/HttpService';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { EnumIcon, EnumName, ScreenName } from '../../../../../assets/constant';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import { IconCloseCircle } from '../../../../../constants/Icons';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import { BankAccountConfirmedBusinessFunction } from './bankAccountConfirmed/BankAccountConfirmedBusinessFunction';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';
import { AlertSevice } from '../../../../../components/Alert/Alert';

const initSateDefault = {
    ID: null,
    Profile: {},
    // thông tin tài khoản
    EWalletType: {
        label: 'HRM_Sal_EWalletInformation_EWalletType',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    AccountNo: {
        label: 'HRM_Payroll_Sal_SalaryInformation_AccountNoGeneral',
        disable: false,
        refresh: false,
        value: '',
        visibleConfig: true,
        visible: true
    },
    EWalletNo: {
        label: 'HRM_Sal_EWalletInformation_EWalletNo',
        disable: false,
        refresh: false,
        value: '',
        visibleConfig: true,
        visible: true
    },
    Note: {
        label: 'HRM_Sal_EWalletInformation_Note',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true
    },
    AttachFile: {
        label: 'HRM_Sal_EWalletInformation_AttachFile',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    fieldValid: {},
    isUpperCaseText: {},
    modalErrorDetail: {
        isModalVisible: false,
        cacheID: null,
        data: []
    }
};

export default class BankWalletAddOrEdit extends Component {
    constructor(props) {
        super(props);
        this.state = initSateDefault;
        this.setVariable();
        if (
            props.navigation.state &&
            props.navigation.state.params &&
            props.navigation.state.params.record &&
            props.navigation.state.params.record.ID
        ) {
            props.navigation.setParams({
                title: 'HRM_Payroll_Sal_EWalletInformation_Update_Title'
            });
        } else {
            props.navigation.setParams({
                title: 'HRM_Payroll_Sal_EWalletInformation_Create_Title'
            });
        }

        // props.navigation.setParams({
        //     headerLeft: (
        //         <TouchableOpacity
        //             onPress={() => {
        //                 DrawerServices.goBack();
        //                 rollbackAccount && typeof rollbackAccount == 'function' &&
        //                     rollbackAccount();
        //             }}>
        //             <View style={styleSheets.bnt_HeaderRight}>
        //                 <IconBack color={Colors.gray_10} size={Size.iconSizeHeader} />
        //             </View>
        //         </TouchableOpacity >
        //     )
        // });
    }

    //#region [khởi tạo , lấy các dữ liệu cho control, lấy giá trị mặc đinh]

    setVariable = () => {
        this.isModify = false;

        this.isProcessing = false;
        this.profileInfo = dataVnrStorage && dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info : {};

        this.IsContinueSave = false;
        this.ProfileRemoveIDs = null;
        this.IsRemoveAndContinue = null;
        this.CacheID = null;
    };

    // refreshView = () => {
    //     this.props.navigation.setParams({ title: 'HRM_Insurance_Hre_HouseholdInfo_PopUp_Addnew_Title' });
    //     this.setVariable();
    //     const { AttachImage } = this.state;
    //     let resetState = {
    //         ...initSateDefault,
    //         AttachImage: {
    //             ...initSateDefault.AttachImage,
    //             refresh: !AttachImage.refresh
    //         }
    //     }

    //     this.setState(resetState, () => this.getConfigValid('Sal_EWalletInformationInfo', true));
    // }

    //promise get config valid
    getConfigValid = (tblName, isRefresh) => {
        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName).then(resConfigValid => {
            if (resConfigValid) {
                try {
                    VnrLoadingSevices.hide();
                    //map field hidden by config
                    const _configField =
                            ConfigField && ConfigField.value['BankWalletAddOrEdit']
                                ? ConfigField.value['BankWalletAddOrEdit']['Hidden']
                                : [],
                        { E_ProfileID, E_FullName } = EnumName,
                        _profile = { ID: this.profileInfo[E_ProfileID], ProfileName: this.profileInfo[E_FullName] };

                    let nextState = {
                        fieldValid: resConfigValid,
                        Profile: _profile
                    };

                    _configField.forEach(fieldConfig => {
                        let _field = this.state[fieldConfig];
                        if (_field && typeof _field === 'object') {
                            _field = {
                                ..._field,
                                visibleConfig: false
                            };

                            nextState = {
                                ...nextState,
                                [fieldConfig]: { ..._field }
                            };
                        }
                    });

                    this.setState(nextState, () => {
                        let { record } = !isRefresh ? this.props.navigation.state.params : {};
                        //get config khi đăng ký
                        if (!record) {
                            this.getConfig();
                        } else {
                            this.isModify = true;
                            this.setRecordForModify(record);
                        }
                    });
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }
        });
    };

    componentDidMount() {
        this.getConfigValid('Sal_EWalletInformationInfo');
    }

    getConfig = () => {
        this.getDefaultValue();
    };

    getDefaultValue = () => {
        const { EWalletType } = this.state;
        VnrLoadingSevices.show();
        HttpService.Get('[URI_SYS]/Sys_GetData/GetEnum?text=WalletType').then(data => {
            VnrLoadingSevices.hide();
            try {
                if (data) {
                    let nextState = {
                        EWalletType: {
                            ...EWalletType,
                            data: data,
                            value: data && data.length == 1 ? data[0] : null,
                            refresh: !EWalletType.refresh
                        }
                    };

                    this.setState(nextState);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    setRecordForModify = response => {
        VnrLoadingSevices.show();
        HttpService.MultiRequest([HttpService.Get('[URI_SYS]/Sys_GetData/GetEnum?text=WalletType')]).then(data => {
            VnrLoadingSevices.hide();
            try {
                this.handleState(response, data);
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    handleState = (response, dataWallet) => {
        let nextState = {};
        const { EWalletNo, EWalletType, AttachFile, Note } = this.state;

        nextState = {
            ID: response.ID,
            ObjectID: response.ObjectID ? response.ObjectID : null,
            EWalletNo: {
                ...EWalletNo,
                value: response.EWalletNo ? response.EWalletNo : '',
                refresh: !EWalletNo.refresh
            },
            EWalletType: {
                ...EWalletType,
                data: dataWallet,
                value: response.EWalletType ? { Text: response.EWalletTypeName, Value: response.EWalletType } : null,
                refresh: !EWalletNo.refresh
            },
            Note: {
                ...Note,
                value: response.Note ? response.Note : '',
                refresh: !Note.refresh
            },
            AttachFile: {
                ...AttachFile,
                value: response.lstFileAttach,
                refresh: !AttachFile.refresh
            }
        };

        this.setState(nextState);
    };

    onSaveAndCreate = () => {
        this.onSave(true, null);
    };

    onSaveAndSend = () => {
        this.onSave(null, true);
    };

    onAddAccounts = () => {
        this.onSave();
    };

    checkConfigDuplicateEWallet = () => {
        const { ID, EWalletNo, EWalletType } = this.state;

        VnrLoadingSevices.show();

        HttpService.Post('[URI_HR]/Sal_GetData/CheckConfigDuplicateEWallet', {
            id: ID ? ID : '00000000-0000-0000-0000-000000000000',
            eWalletNo: EWalletNo.value ? EWalletNo.value : '',
            eWalletType: EWalletType.value ? EWalletType.value.Value : null
        }).then(data => {
            VnrLoadingSevices.hide();
            if (data && data.Success == false && data.Messenger) {
                ToasterSevice.showWarning(data.Messenger);
            }
        });
    };

    onSave = (isCreate, isSend) => {
        if (this.isProcessing) {
            return;
        }

        const { ID, ObjectID, EWalletNo, EWalletType, AttachFile, Note, fieldValid, modalErrorDetail } = this.state;
        let params = {};

        if (
            (fieldValid.EWalletNo && (EWalletNo.value == null || EWalletNo.value == '')) ||
            (fieldValid.EWalletType && EWalletType.value == null)
        ) {
            ToasterSevice.showWarning('HRM_PortalApp_InputValue_Please');
            return;
        }

        // if (DateReleased.value && DateExpired.value && !moment(DateReleased.value).isBefore(moment(DateExpired.value))) {
        //     ToasterSevice.showWarning('HRM_Validate_ExpirationDate_Expiration_Date');
        //     return;
        // }

        // if (Note.value && Note.value.length >= 500) {
        //     ToasterSevice.showWarning('HRM_Portal_RequirementTrain_NoMoreThan500Characters');
        //     return;
        // }

        params = {
            ...params,
            ProfileID: this.profileInfo.ProfileID,
            UserID: this.profileInfo.userid,
            // Thông tin chung
            EWalletType: EWalletType.value ? EWalletType.value.Value : null,
            EWalletNo: EWalletNo.value,
            Note: Note.value,
            AttachFile: AttachFile.value ? AttachFile.value.map(item => item.fileName).join(',') : null,

            ProfileRemoveIDs: this.ProfileRemoveIDs,
            IsRemoveAndContinue: this.IsRemoveAndContinue,
            CacheID: this.CacheID,
            IsContinueSave: this.IsContinueSave
        };

        // Send mail
        if (isSend) {
            params = {
                ...params,
                IsSubmitSave: true
            };
        }

        if (ID) {
            params = {
                ...params,
                ID: ID,
                ObjectID: ObjectID
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Sal_GetData/UpdateOrCreateEWalletInformation', params).then(data => {
            this.isProcessing = false;
            VnrLoadingSevices.hide();
            if (data && typeof data == 'object') {
                if (data.ErrorRespone) {
                    if (data.ErrorRespone.IsBlock) {
                        // Nếu có IsBlock, kiểm tra có IsShowRemoveAndContinue hay không
                        if (data.ErrorRespone.IsShowRemoveAndContinue) {
                            AlertSevice.alert({
                                title: translate('Hrm_Notification'),
                                iconType: EnumIcon.E_WARNING,
                                message: translate('HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'),
                                // Lưu và tiếp tục
                                colorSecondConfirm: Colors.primary,
                                textSecondConfirm: translate('Button_OK'),
                                onSecondConfirm: () => {
                                    this.ProfileRemoveIDs = data.ErrorRespone.ProfileRemoveIDs;
                                    this.IsRemoveAndContinue = true;
                                    this.CacheID = data.ErrorRespone.CacheID;
                                    this.onSave(null, isSend);
                                },
                                // Đóng
                                onCancel: () => {},
                                // Chi tiết lỗi
                                textRightButton: translate('Button_Detail'),
                                onConfirm: () => {
                                    this.setState(
                                        {
                                            modalErrorDetail: {
                                                ...modalErrorDetail,
                                                cacheID: data.ErrorRespone.CacheID,
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
                            AlertSevice.alert({
                                title: translate('Hrm_Notification'),
                                iconType: EnumIcon.E_WARNING,
                                message: translate('HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'),
                                textRightButton: translate('Button_Detail'),
                                // Đóng popup
                                onCancel: () => {},
                                // Chi tiết lỗi
                                onConfirm: () => {
                                    this.setState(
                                        {
                                            modalErrorDetail: {
                                                ...modalErrorDetail,
                                                cacheID: data.ErrorRespone.CacheID,
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
                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_WARNING,
                            message: translate('HRM_Attendance_Message_InvalidRequestDataDoYouWantToSave'),
                            // Lưu và tiếp tục
                            colorSecondConfirm: Colors.primary,
                            textSecondConfirm: translate('Button_OK'),
                            onSecondConfirm: () => {
                                this.IsContinueSave = true;
                                this.ProfileRemoveIDs = data.ErrorRespone.ProfileRemoveIDs;
                                this.IsRemoveAndContinue = true;
                                this.CacheID = data.ErrorRespone.CacheID;
                                this.onSave(null, isSend);
                            },
                            // Đóng
                            onCancel: () => {},
                            // Chi tiết lỗi
                            textRightButton: translate('Button_Detail'),
                            onConfirm: () => {
                                this.setState(
                                    {
                                        modalErrorDetail: {
                                            ...modalErrorDetail,
                                            cacheID: data.ErrorRespone.CacheID,
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
                } else if (data.ActionStatus && data.ActionStatus == EnumName.E_Success) {
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                    const { reload } = this.props.navigation.state.params;
                    if (reload && typeof reload === 'function') {
                        reload();
                    }

                    BankAccountConfirmedBusinessFunction.checkForLoadEditDelete[
                        ScreenName.BankAccountConfirm
                    ] = true;
                    DrawerServices.navigate('BankAccountConfirm');
                } else if (data.Message && typeof data.Message == 'string') {
                    ToasterSevice.showWarning(data.Message, 4000);
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                }
            }
        });
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
                        <View style={styleComonAddOrEdit.styleViewTitleGroup}>
                            <VnrText
                                style={[styleSheets.lable, styleComonAddOrEdit.styFontErrTitle]}
                                i18nKey={dataItem['TitleGroup']}
                            />
                        </View>
                    );
                } else {
                    viewContent = (
                        <View style={styleComonAddOrEdit.styFontErrInfo}>
                            <View style={styleComonAddOrEdit.styFontErrLine}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    i18nKey={'HRM_PortalApp_Message_ErrorCodeEmp'}
                                />

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
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    i18nKey={'HRM_PortalApp_Message_ErrorProfileName'}
                                />

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
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    i18nKey={'HRM_PortalApp_Message_ErrorDescription'}
                                />

                                <View style={styleComonAddOrEdit.styFontErrVal}>
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
                            styleComonAddOrEdit.styleViewBorderButtom,
                            dataSourceError.length - 1 == index && styleComonAddOrEdit.styleViewNoBorder
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

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetErrorMessageRespone', { cacheID: cacheID }).then(res => {
            VnrLoadingSevices.hide();
            if (res && res.Data) {
                this.setState({
                    modalErrorDetail: {
                        ...modalErrorDetail,
                        data: res.Data
                    }
                });
            }
        });
    }

    render() {
        const { fieldValid, EWalletNo, EWalletType, AttachFile, Note, modalErrorDetail } = this.state;

        const {
            textLableInfo,
            contentViewControl,
            viewLable,
            viewControl,
            viewInputMultiline
        } = stylesListPickerControl;

        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        listActions.push({
            type: EnumName.E_SAVE_SENMAIL,
            title: translate('HRM_Common_SaveAndSendRequest'),
            onPress: () => this.onSaveAndSend()
        });

        listActions.push({
            type: EnumName.E_SAVE_CLOSE,
            title: translate('HRM_Common_SaveClose'),
            onPress: () => this.onSave()
        });

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView contentContainerStyle={CustomStyleSheet.flexGrow(1)}>
                        <View>
                            {/* Ngân hàng - EWalletType */}
                            {EWalletType.visibleConfig && EWalletType.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={EWalletType.label}
                                        />

                                        {/* valid EWalletType */}
                                        {fieldValid.EWalletType && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerQuickly
                                            autoFilter={true}
                                            dataLocal={EWalletType.data}
                                            value={EWalletType.value}
                                            refresh={EWalletType.refresh}
                                            textField="Text"
                                            valueField="Value"
                                            filter={true}
                                            filterServer={false}
                                            filterParams="Text"
                                            disable={EWalletType.disable}
                                            onFinish={item => {
                                                this.setState({
                                                    EWalletType: {
                                                        ...EWalletType,
                                                        value: item,
                                                        refresh: !EWalletType.refresh
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Số ví - EWalletNo */}
                            {EWalletNo.visibleConfig && EWalletNo.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={EWalletNo.label} />

                                        {/* valid EWalletNo */}
                                        {fieldValid.EWalletNo && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            keyboardType={'numeric'}
                                            charType={'int'}
                                            disable={EWalletNo.disable}
                                            refresh={EWalletNo.refresh}
                                            value={EWalletNo.value}
                                            onBlur={() => this.checkConfigDuplicateEWallet()}
                                            onSubmitEditing={() => this.checkConfigDuplicateEWallet()}
                                            onChangeText={text => {
                                                this.setState({
                                                    EWalletNo: {
                                                        ...EWalletNo,
                                                        value: text,
                                                        refresh: !EWalletNo.refresh
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Ghi chú - Note */}
                            {Note.visibleConfig && Note.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Note.label} />

                                        {/* valid ProfileID */}
                                        {fieldValid.Note && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            style={[styleSheets.text, viewInputMultiline]}
                                            multiline={true}
                                            disable={Note.disable}
                                            refresh={Note.refresh}
                                            value={Note.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    Note: {
                                                        ...Note,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* File đính kèm - AttachFile */}
                            {AttachFile.visibleConfig && AttachFile.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={AttachFile.label} />
                                    </View>
                                    <View style={viewControl}>
                                        <VnrAttachFile
                                            disable={AttachFile.disable}
                                            value={AttachFile.value}
                                            multiFile={true}
                                            uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                            refresh={AttachFile.refresh}
                                            onFinish={file => {
                                                this.setState({
                                                    AttachFile: {
                                                        ...AttachFile,
                                                        value: file,
                                                        refresh: !AttachFile.refresh
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                    </KeyboardAwareScrollView>

                    {modalErrorDetail.isModalVisible && (
                        <Modal animationType="slide" transparent={true} isVisible={true}>
                            <View style={styleComonAddOrEdit.wrapModalError}>
                                <TouchableOpacity
                                    style={[styleComonAddOrEdit.bgOpacity]}
                                    onPress={() => this.closeModalErrorDetail()}
                                />
                                <SafeAreaView style={styleComonAddOrEdit.wrapContentModalError}>
                                    <View style={styleComonAddOrEdit.wrapTitileHeaderModalError}>
                                        <VnrText
                                            style={[
                                                styleSheets.text,
                                                styleComonAddOrEdit.styRegister,
                                                styleComonAddOrEdit.fS16fW600
                                            ]}
                                            i18nKey={'HRM_PortalApp_Message_ErrorDetail'}
                                        />

                                        <TouchableOpacity onPress={() => this.closeModalErrorDetail()}>
                                            <IconCloseCircle size={Size.iconSize} color={Colors.white} />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView style={styleComonAddOrEdit.wrapLevelError}>
                                        {this.renderErrorDetail()}
                                    </ScrollView>
                                </SafeAreaView>
                            </View>
                        </Modal>
                    )}

                    <ListButtonSave listActions={listActions} />
                </View>
            </SafeAreaView>
        );
    }
}