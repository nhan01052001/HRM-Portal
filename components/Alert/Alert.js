import React, { Component } from 'react';
import { View, TouchableOpacity, Keyboard, TextInput, StyleSheet, Text } from 'react-native';
import Modal from 'react-native-modal';
import moment from 'moment';
import Vnr_Function from '../../utils/Vnr_Function';
import {
    styleSheets,
    Size,
    Colors,
    styleValid,
    stylesVnrPickerV3,
    CustomStyleSheet
} from '../../constants/styleConfig';
import VnrText from '../VnrText/VnrText';
import { EnumIcon } from '../../assets/constant';
import CheckBox from 'react-native-check-box';
import {
    IconColse,
    IconCheckCirlceo,
    IconMail,
    IconDelete,
    IconInfo,
    IconConfirm,
    IconCancel,
    IconKey,
    IconWarning,
    IconCancelMarker,
    IconEyeOff,
    IconEye
} from '../../constants/Icons';
import VnrAttachFile from '../../componentsV3/VnrAttachFile/VnrAttachFile';
import { translate } from '../../i18n/translate';
import VnrTextInput from '../../componentsV3/VnrTextInput/VnrTextInput';

const heightModal = 100;
const api = {};
const height40 = (Size.deviceheight * 50) / 100;

export const AlertSevice = api;

export const AlertInModal = class AlertInModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isCheckBox: null,
            inputValue: null,
            keyboardSpace: 0,
            modalAlert: {
                typeInputText: 'E_TEXT',
                isInputText: false,
                isVisible: false,
                placeholder: '',
                title: '',
                message: '',
                icon: null,
                iconColor: null,
                onConfirm: null,
                onCancel: null,
                isValidInputText: false,
                showConfirm: true,
                iconType: null
            },
            Modals: []
        };

        //for get keyboard height
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (frames) => {
            if (!frames.endCoordinates) return;
            this.setState({ keyboardSpace: frames.endCoordinates.height });
        });

        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            this.setState({ keyboardSpace: 0 });
        });

        this.heightModalLayout = 0;
        this.keyTextConfirm = 'Confirm';
    }

    componentWillUnmount() {
        this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
        this.keyboardDidShowListener && this.keyboardDidHideListener.remove();
    }

    addModal = (objModal) => {
        const newID = moment(new Date()).format('DD-MM-YYYY HH:mm:ss:SSS');
        this.setState(
            {
                inputValue: objModal.inputValue ? objModal.inputValue : '',
                Modals: [
                    {
                        ...objModal,
                        ...{
                            isVisible: true,
                            isShowHidePass: false,
                            id: newID
                        }
                    },
                    ...this.state.Modals
                ],
                isCheckBox: objModal.isCheckBox != null && objModal.isCheckBox != undefined ? objModal.isCheckBox : null
            },
            () => {
                if (objModal.timeHideModal != null && typeof objModal.timeHideModal == 'number') {
                    let timeOut = setTimeout(() => {
                        this._closeModal(newID);
                        clearTimeout(timeOut);
                    }, objModal.timeHideModal);
                }
            }
        );
    };

    _closeModal = (ID) => {
        let { Modals } = this.state;
        const modalAlert = Modals.filter((item) => {
            return item.id == ID;
        })[0];
        if (modalAlert) {
            Modals = Vnr_Function.removeObjectInArray(Modals, { id: ID }, 'id');
            let callbackOnCancel = null;
            modalAlert.isVisible = false;

            if (!Vnr_Function.CheckIsNullOrEmpty(modalAlert.onCancel) && typeof modalAlert.onCancel == 'function') {
                callbackOnCancel = modalAlert.onCancel;
            }
            this.setState({ Modals: Modals, inputValue: null, isCheckBox: null }, () => {
                callbackOnCancel != null && callbackOnCancel();
            });
        }
    };

    showHidePassword = (ID) => {
        let { Modals } = this.state;
        const modalAlert = Modals.filter((item) => {
            return item.id == ID;
        })[0];
        modalAlert.isShowHidePass = !modalAlert.isShowHidePass;
        this.setState({ Modals: Modals });
    };

    backDropOnPress = (ID) => {
        let { Modals } = this.state;

        const modalAlert = Modals.filter((item) => {
            return item.id == ID;
        })[0];

        const { showCancel } = modalAlert;

        let _showCancel = showCancel === undefined || showCancel ? true : false;

        if (_showCancel) {
            return;
        }

        Modals = Vnr_Function.removeObjectInArray(Modals, { id: ID }, 'id');
        let callbackOnBackDrop = null;
        modalAlert.isVisible = false;

        if (!Vnr_Function.CheckIsNullOrEmpty(modalAlert.onBackDrop) && typeof modalAlert.onBackDrop == 'function') {
            callbackOnBackDrop = modalAlert.onBackDrop;
        }
        this.setState({ Modals: Modals, inputValue: null, isCheckBox: null }, () => {
            callbackOnBackDrop != null && callbackOnBackDrop();
        });
    };

    _onConfirm = (ID, isValidInputText) => {
        let { Modals, inputValue, isCheckBox } = this.state;
        const modalAlert = Modals.filter((item) => {
            return item.id == ID;
        })[0];

        if (!isValidInputText || (isValidInputText && !Vnr_Function.CheckIsNullOrEmpty(inputValue))) {
            Modals = Vnr_Function.removeObjectInArray(Modals, { id: ID }, 'id');
        }

        let callbackOnConfirm = null;
        if (!Vnr_Function.CheckIsNullOrEmpty(modalAlert.onConfirm) && typeof modalAlert.onConfirm == 'function') {
            callbackOnConfirm = modalAlert.onConfirm;
        }

        this.setState({ Modals: Modals, inputValue: null, isCheckBox: null }, () => {
            callbackOnConfirm != null && callbackOnConfirm(inputValue, isCheckBox);
        });
    };

    _onConfirmSecond = (ID) => {
        let { Modals } = this.state;
        const modalAlert = Modals.filter((item) => {
            return item.id == ID;
        })[0];

        Modals = Vnr_Function.removeObjectInArray(Modals, { id: ID }, 'id');
        modalAlert.isVisible = false;
        let callbackOnSecondConfirm = null;
        if (
            !Vnr_Function.CheckIsNullOrEmpty(modalAlert.onSecondConfirm) &&
            typeof modalAlert.onSecondConfirm == 'function'
        ) {
            callbackOnSecondConfirm = modalAlert.onSecondConfirm;
        }

        this.setState({ Modals: Modals, inputValue: null, isCheckBox: null }, () => {
            callbackOnSecondConfirm != null && callbackOnSecondConfirm();
        });
    };

    autoFocusInput = () => {
        setTimeout(() => {
            if (this.refsTextInput) {
                this.refsTextInput.focus();
            }
        }, 500);
    };

    renderButtonAlert = (modal) => {
        const {
            textLeftButton,
            isValidInputText,
            textRightButton,
            id,
            showConfirm,
            showCancel,
            iconType,
            onSecondConfirm,
            colorSecondConfirm,
            textSecondConfirm
        } = modal;

        let _showConfirm = showConfirm === undefined || showConfirm ? true : false,
            _showCancel = showCancel === undefined || showCancel ? true : false,
            _showSecondConfirm = onSecondConfirm && colorSecondConfirm && textSecondConfirm ? true : false,
            colorConfirm = null,
            keyTextConfirm = '';

        switch (iconType) {
            case EnumIcon.E_WARNING:
                keyTextConfirm = 'HRM_Common_Continue';
                colorConfirm = Colors.orange;
                break;
            case EnumIcon.E_CONFIRM:
                keyTextConfirm = 'Confirm';
                colorConfirm = Colors.primary;
                break;
            case EnumIcon.E_CANCEL:
                keyTextConfirm = 'HRM_Common_Cancel';
                colorConfirm = Colors.red;
                break;
            case EnumIcon.E_APPROVE:
                keyTextConfirm = 'HRM_Common_Approve';
                colorConfirm = Colors.success;
                break;
            case EnumIcon.E_REJECT:
                keyTextConfirm = 'HRM_Common_Reject';
                colorConfirm = Colors.volcano;
                break;
            case EnumIcon.E_SENDMAIL:
                keyTextConfirm = 'HRM_Common_SendMail';
                colorConfirm = Colors.purple;
                break;
            case EnumIcon.E_DELETE:
                keyTextConfirm = 'HRM_Common_Delete';
                colorConfirm = Colors.red;
                break;
            case EnumIcon.E_KEY:
                keyTextConfirm = 'Confirm';
                colorConfirm = Colors.primary;
                break;
            case EnumIcon.E_INFO:
                keyTextConfirm = 'Confirm';
                colorConfirm = Colors.primary;
                break;
            case EnumIcon.E_AGREE:
                keyTextConfirm = 'E_AGREE';
                colorConfirm = Colors.primary;
                break;
            // task 0164850
            case EnumIcon.E_FORWARD:
                keyTextConfirm = 'HRM_Common_ForwardTitle_Sal';
                colorConfirm = Colors.purple;
                break;
            default:
                keyTextConfirm = 'HRM_Common_Continue';
                colorConfirm = Colors.primary;
                break;
        }

        return (
            <View
                style={[
                    stylesAlert.buttomAlert,
                    !_showCancel && !_showSecondConfirm && !_showConfirm && CustomStyleSheet.borderTopWidth(0)
                ]}
            >
                <View style={stylesAlert.contentButton}>
                    {_showCancel && (
                        <TouchableOpacity
                            accessibilityLabel={'Alert-Close'}
                            onPress={() => {
                                this._closeModal(id);
                            }}
                            style={[
                                stylesAlert.bnt_Cancel,
                                !_showConfirm && !_showSecondConfirm && stylesAlert.bnt_CancelActive
                            ]}
                        >
                            <VnrText
                                style={[styleSheets.text, { color: Colors.greySecondary }]}
                                i18nKey={
                                    !Vnr_Function.CheckIsNullOrEmpty(textLeftButton)
                                        ? textLeftButton
                                        : 'HRM_Common_Close'
                                }
                            />
                        </TouchableOpacity>
                    )}

                    {_showConfirm && (
                        <TouchableOpacity
                            accessibilityLabel={'Alert-Confirm'}
                            onPress={() => {
                                this._onConfirm(id, isValidInputText);
                            }}
                            style={[stylesAlert.bnt_Second, !_showConfirm && CustomStyleSheet.borderRightWidth(0)]}
                        >
                            <VnrText
                                style={[styleSheets.lable, stylesAlert.bnt_Ok__text, { color: colorConfirm }]}
                                i18nKey={
                                    !Vnr_Function.CheckIsNullOrEmpty(textRightButton) ? textRightButton : keyTextConfirm
                                }
                            />
                        </TouchableOpacity>
                    )}

                    {_showSecondConfirm && (
                        <TouchableOpacity
                            accessibilityLabel={'Alert-SecondConfirm'}
                            onPress={() => {
                                this._onConfirmSecond(id);
                            }}
                            style={[stylesAlert.bnt_Ok]}
                        >
                            <VnrText
                                style={[styleSheets.lable, stylesAlert.bnt_Ok__text, { color: colorSecondConfirm }]}
                                i18nKey={textSecondConfirm}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    renderTitleIncon = (modal) => {
        const { title, iconType } = modal,
            iconSize = Size.iconSize - 2;

        let keyTextConfirm = '',
            iconView = <View />;

        switch (iconType) {
            case EnumIcon.E_WARNING:
                keyTextConfirm = 'HRM_Common_Continue';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconWarning size={iconSize} color={Colors.orange} />
                    </View>
                );
                break;
            case EnumIcon.E_CONFIRM:
                keyTextConfirm = 'Confirm';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconConfirm size={iconSize} color={Colors.primary} />
                    </View>
                );
                break;
            // case EnumIcon.E_MODIFY:
            //   this.keyTextConfirm = 'HRM_System_Resource_Sys_Edit';
            //   return (
            //     <View style={[stylesAlert.icon, { backgroundColor: Colors.warning }]}>
            //       <IconEdit size={iconSize} color={Colors.white} />
            //     </View>
            //   );
            case EnumIcon.E_CANCEL:
                keyTextConfirm = 'HRM_Common_Cancel';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconCancelMarker size={iconSize} color={Colors.red} />
                    </View>
                );
                break;
            case EnumIcon.E_APPROVE:
                keyTextConfirm = 'HRM_Common_Approve';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconCheckCirlceo size={iconSize} color={Colors.success} />
                    </View>
                );
                break;
            case EnumIcon.E_REJECT:
                keyTextConfirm = 'HRM_Common_Reject';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconColse size={iconSize} color={Colors.volcano} />
                    </View>
                );
                break;
            case EnumIcon.E_SENDMAIL:
                keyTextConfirm = 'HRM_Common_SendMail';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconMail size={iconSize} color={Colors.purple} />
                    </View>
                );
                break;
            case EnumIcon.E_DELETE:
                keyTextConfirm = 'HRM_Common_Delete';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconDelete size={iconSize} color={Colors.red} />
                    </View>
                );
                break;
            case EnumIcon.E_KEY:
                keyTextConfirm = 'Confirm';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconKey size={iconSize} color={Colors.primary} />
                    </View>
                );
                break;
            case EnumIcon.E_INFO:
                keyTextConfirm = 'Confirm';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconInfo size={iconSize} color={Colors.primary} />
                    </View>
                );
                break;
            // task 0164850
            case EnumIcon.E_FORWARD:
                keyTextConfirm = 'HRM_Common_ForwardTitle_Sal';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconMail size={iconSize} color={Colors.purple} />
                    </View>
                );
                break;
            default:
                keyTextConfirm = 'Confirm';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconInfo size={iconSize} color={Colors.primary} />
                    </View>
                );
                break;
        }

        return (
            <View style={stylesAlert.itemTopAlert}>
                {iconView}
                <VnrText
                    style={[styleSheets.lable, stylesAlert.itemTopAlert_title__text]}
                    i18nKey={title ? title : keyTextConfirm}
                />
            </View>
        );
    };

    alert = (object) => {
        this.addModal(object);
    };

    // componentDidMount() {
    //   api.alert = this.showAlert;
    // }

    // componentDidUpdate(){
    //   this.autoFocusInput();
    // }

    createModal(modal) {
        const { keyboardSpace, inputValue } = this.state,
            {
                isVisible,
                title,
                message,
                isValidInputText,
                id,
                isInputText,
                typeInputText,
                placeholder,
                autoFocus,
                isShowHidePass,
                lableCheckBox,
                isCheckBox
            } = modal,
            marginTopModal = Size.deviceheight / 2 - heightModal / 2 - (isInputText ? 71 : 50),
            marginTopAfterKeyboardShow =
                Size.deviceheight - keyboardSpace - this.heightModalLayout - (isInputText ? 71 : 50);

        if (autoFocus && autoFocus === true) {
            this.autoFocusInput();
        }

        return (
            <Modal
                animationIn="fadeIn"
                animationOut="fadeOut"
                key={id}
                isVisible={isVisible}
                onBackdropPress={() => this.backDropOnPress(id)}
                style={[
                    stylesAlert.modal,
                    {
                        minHeight: heightModal,
                        //height: 'auto',
                        top:
                            keyboardSpace && marginTopAfterKeyboardShow < marginTopModal
                                ? marginTopAfterKeyboardShow
                                : marginTopModal
                    }
                ]}
            >
                <View
                    style={stylesAlert.styViewContent}
                    onLayout={(event) => {
                        this.heightModalLayout = event.nativeEvent.layout.height;
                    }}
                >
                    <View style={[stylesAlert.contentToaster]}>
                        <View style={stylesAlert.topAlert}>
                            {title && this.renderTitleIncon(modal)}

                            {message && (
                                <View style={stylesAlert.itemTopAlert}>
                                    <VnrText
                                        i18nKey={message}
                                        style={[styleSheets.text, stylesAlert.itemTopAlert_message__text]}
                                    />
                                </View>
                            )}

                            {isCheckBox != null && isCheckBox != undefined && (
                                <View style={stylesAlert.itemTopAlert}>
                                    <View style={stylesAlert.styViewCheckbox}>
                                        <VnrText
                                            style={[styleSheets.text]}
                                            i18nKey={lableCheckBox ? lableCheckBox : 'E_CONFREPORT_CONTTYPE_CHECKBOX'}
                                        />
                                        <CheckBox
                                            checkBoxColor={Colors.primary}
                                            checkedCheckBoxColor={Colors.primary}
                                            isChecked={isCheckBox}
                                            onClick={() =>
                                                this.setState({
                                                    isCheckBox: !isCheckBox
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {isInputText && typeInputText === 'E_PASSWORD' && (
                                <View style={stylesAlert.itemTopAlertPassWord}>
                                    <TextInput
                                        ref={(ref) => (this.refsTextInput = ref)}
                                        style={[
                                            styleSheets.text,
                                            stylesAlert.itemTopAlert_input,
                                            CustomStyleSheet.paddingVertical(8),
                                            CustomStyleSheet.borderWidth(0)
                                        ]}
                                        secureTextEntry={isShowHidePass ? false : true}
                                        onSubmitEditing={() => this._onConfirm(id, isValidInputText)}
                                        returnKeyType={'done'}
                                        placeholder={placeholder}
                                        onChangeText={(text) => this.setState({ inputValue: text })}
                                        value={inputValue}
                                        multiline={false}
                                        numberOfLines={2}
                                        autoCapitalize={'none'}
                                    />

                                    <TouchableOpacity
                                        style={stylesAlert.styBtnShowHide}
                                        onPress={() => this.showHidePassword(id)}
                                    >
                                        {isShowHidePass ? (
                                            <IconEyeOff size={Size.iconSize - 3} color={Colors.grey} />
                                        ) : (
                                            <IconEye size={Size.iconSize - 3} color={Colors.grey} />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            )}

                            {isInputText && typeInputText !== 'E_PASSWORD' && (
                                <View style={stylesAlert.itemTopAlert}>
                                    <View style={stylesAlert.styViewInputValid}>
                                        <TextInput
                                            ref={(ref) => (this.refsTextInput = ref)}
                                            style={[
                                                styleSheets.text,
                                                stylesAlert.itemTopAlert_input_valid,

                                                typeInputText == 'E_PASSWORD' && CustomStyleSheet.paddingVertical(8)
                                            ]}
                                            // autoFocus={typeInputText == 'E_PASSWORD'}
                                            secureTextEntry={typeInputText == 'E_PASSWORD' ? true : false}
                                            onSubmitEditing={() => this._onConfirm(id, isValidInputText)}
                                            returnKeyType={'done'}
                                            placeholder={placeholder}
                                            onChangeText={(text) => this.setState({ inputValue: text })}
                                            value={inputValue}
                                            multiline={typeInputText == 'E_PASSWORD' ? false : true}
                                            numberOfLines={2}
                                            autoCapitalize={'none'}
                                        />
                                        {(inputValue === null || inputValue === '') && isValidInputText && (
                                            <VnrText
                                                style={[
                                                    styleSheets.lable,
                                                    stylesAlert.itemTopAlert_title__text,
                                                    styleValid
                                                ]}
                                                i18nKey={'HRM_Valid_Char'}
                                            />
                                        )}
                                    </View>
                                </View>
                            )}
                        </View>

                        {this.renderButtonAlert(modal)}
                    </View>
                </View>
            </Modal>
        );
    }

    render() {
        const { Modals } = this.state;
        return <View style={CustomStyleSheet.zIndex(2)}>{Modals.map((modal) => this.createModal(modal))}</View>;
    }
};

export default class AlertComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isCheckBox: null,
            inputValue: null,
            keyboardSpace: 0,
            modalAlert: {
                typeInputText: 'E_TEXT',
                isInputText: false,
                isVisible: false,
                placeholder: '',
                title: '',
                message: '',
                icon: null,
                iconColor: null,
                onConfirm: null,
                onCancel: null,
                isValidInputText: false,
                showConfirm: true,
                iconType: null
            },
            Modals: [],
            FileAttachment: {
                lable: 'HRM_PortalApp_TakeLeave_FileAttachment',
                visible: true,
                visibleConfig: true,
                disable: false,
                refresh: false,
                value: [],
                isOverLimitFile: false
            }
        };

        //for get keyboard height
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (frames) => {
            if (!frames.endCoordinates) return;
            this.setState({ keyboardSpace: frames.endCoordinates.height });
        });

        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            this.setState({ keyboardSpace: 0 });
        });

        this.heightModalLayout = 0;
        this.keyTextConfirm = 'Confirm';
        this.showAlert = this.showAlert.bind(this);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
        this.keyboardDidShowListener && this.keyboardDidHideListener.remove();
    }

    addModal = (objModal) => {
        const newID = moment(new Date()).format('DD-MM-YYYY HH:mm:ss:SSS');
        this.setState(
            {
                inputValue: objModal.inputValue ? objModal.inputValue : '',
                Modals: [
                    {
                        ...objModal,
                        ...{
                            isVisible: true,
                            isShowHidePass: false,
                            id: newID
                        }
                    },
                    ...this.state.Modals
                ],
                isCheckBox: objModal.isCheckBox != null && objModal.isCheckBox != undefined ? objModal.isCheckBox : null
            },
            () => {
                if (objModal.timeHideModal != null && typeof objModal.timeHideModal == 'number') {
                    let timeOut = setTimeout(() => {
                        this._closeModal(newID);
                        clearTimeout(timeOut);
                    }, objModal.timeHideModal);
                }
            }
        );
    };

    _closeModal = (ID) => {
        let { Modals, FileAttachment } = this.state;
        const modalAlert = Modals.filter((item) => {
            return item.id == ID;
        })[0];

        if (modalAlert) {
            Modals = Vnr_Function.removeObjectInArray(Modals, { id: ID }, 'id');
            let callbackOnCancel = null;
            modalAlert.isVisible = false;

            if (!Vnr_Function.CheckIsNullOrEmpty(modalAlert.onCancel) && typeof modalAlert.onCancel == 'function') {
                callbackOnCancel = modalAlert.onCancel;
            }
            this.setState(
                {
                    Modals: Modals,
                    inputValue: null,
                    isCheckBox: null,
                    FileAttachment: {
                        ...FileAttachment,
                        value: null,
                        refresh: !FileAttachment.refresh
                    }
                },
                () => {
                    callbackOnCancel != null && callbackOnCancel();
                }
            );
        }
    };

    showHidePassword = (ID) => {
        let { Modals } = this.state;
        const modalAlert = Modals.filter((item) => {
            return item.id == ID;
        })[0];
        modalAlert.isShowHidePass = !modalAlert.isShowHidePass;
        this.setState({ Modals: Modals });
    };

    backDropOnPress = (ID) => {
        let { Modals, FileAttachment } = this.state;

        const modalAlert = Modals.filter((item) => {
            return item.id == ID;
        })[0];

        const { showCancel } = modalAlert;

        let _showCancel = showCancel === undefined || showCancel ? true : false;

        if (_showCancel) {
            return;
        }

        Modals = Vnr_Function.removeObjectInArray(Modals, { id: ID }, 'id');
        let callbackOnBackDrop = null;
        modalAlert.isVisible = false;

        if (!Vnr_Function.CheckIsNullOrEmpty(modalAlert.onBackDrop) && typeof modalAlert.onBackDrop == 'function') {
            callbackOnBackDrop = modalAlert.onBackDrop;
        }
        this.setState(
            {
                Modals: Modals,
                inputValue: null,
                isCheckBox: null,
                FileAttachment: {
                    ...FileAttachment,
                    value: null,
                    refresh: !FileAttachment.refresh
                }
            },
            () => {
                callbackOnBackDrop != null && callbackOnBackDrop();
            }
        );
    };

    _onConfirm = (ID, isValidInputText) => {
        let { Modals, inputValue, isCheckBox, FileAttachment } = this.state;
        const modalAlert = Modals.filter((item) => {
            return item.id == ID;
        })[0];

        if (!isValidInputText || (isValidInputText && !Vnr_Function.CheckIsNullOrEmpty(inputValue))) {
            Modals = Vnr_Function.removeObjectInArray(Modals, { id: ID }, 'id');
        }

        let callbackOnConfirm = null;
        if (!Vnr_Function.CheckIsNullOrEmpty(modalAlert.onConfirm) && typeof modalAlert.onConfirm == 'function') {
            callbackOnConfirm = modalAlert.onConfirm;
        }

        this.setState(
            {
                Modals: Modals,
                inputValue: null,
                isCheckBox: null,
                FileAttachment: {
                    ...FileAttachment,
                    value: null,
                    refresh: !FileAttachment.refresh
                }
            },
            () => {
                callbackOnConfirm != null && callbackOnConfirm(inputValue, isCheckBox, FileAttachment.value);
            }
        );
    };

    _onConfirmSecond = (ID) => {
        let { Modals } = this.state;
        const modalAlert = Modals.filter((item) => {
            return item.id == ID;
        })[0];

        Modals = Vnr_Function.removeObjectInArray(Modals, { id: ID }, 'id');
        modalAlert.isVisible = false;
        let callbackOnSecondConfirm = null;
        if (
            !Vnr_Function.CheckIsNullOrEmpty(modalAlert.onSecondConfirm) &&
            typeof modalAlert.onSecondConfirm == 'function'
        ) {
            callbackOnSecondConfirm = modalAlert.onSecondConfirm;
        }

        this.setState({ Modals: Modals, inputValue: null, isCheckBox: null }, () => {
            callbackOnSecondConfirm != null && callbackOnSecondConfirm();
        });
    };

    autoFocusInput = () => {
        setTimeout(() => {
            if (this.refsTextInput) {
                this.refsTextInput.focus();
            }
        }, 500);
    };

    renderButtonAlert = (modal) => {
        const {
            textLeftButton,
            isValidInputText,
            textRightButton,
            id,
            showConfirm,
            showCancel,
            iconType,
            onSecondConfirm,
            colorSecondConfirm,
            textSecondConfirm,
            limit,
            textLimit,
            limitFile
        } = modal;

        let _showConfirm = showConfirm === undefined || showConfirm ? true : false,
            _showCancel = showCancel === undefined || showCancel ? true : false,
            _showSecondConfirm = onSecondConfirm && colorSecondConfirm && textSecondConfirm ? true : false,
            colorConfirm = null,
            keyTextConfirm = '',
            isDisable =
                (limit &&
                    !isNaN(Number(limit)) &&
                    textLimit &&
                    this.state.inputValue &&
                    this.state.inputValue.length > limit) ||
                (this.state.FileAttachment.isOverLimitFile && this.state.FileAttachment.value.length > limitFile);

        switch (iconType) {
            case EnumIcon.E_WARNING:
                keyTextConfirm = 'HRM_Common_Continue';
                colorConfirm = Colors.orange;
                break;
            case EnumIcon.E_CONFIRM:
                keyTextConfirm = 'Confirm';
                colorConfirm = Colors.primary;
                break;
            case EnumIcon.E_CANCEL:
                keyTextConfirm = 'HRM_Common_Cancel';
                colorConfirm = Colors.red;
                break;
            case EnumIcon.E_REQUEST_CANCEL:
                keyTextConfirm = 'HRM_Common_Cancel';
                colorConfirm = Colors.green;
                break;
            case EnumIcon.E_APPROVE:
                keyTextConfirm = 'HRM_Common_Approve';
                colorConfirm = Colors.success;
                break;
            case EnumIcon.E_REJECT:
                keyTextConfirm = 'HRM_Common_Reject';
                colorConfirm = Colors.volcano;
                break;
            case EnumIcon.E_SENDMAIL:
                keyTextConfirm = 'HRM_Common_SendMail';
                colorConfirm = Colors.purple;
                break;
            case EnumIcon.E_DELETE:
                keyTextConfirm = 'HRM_Common_Delete';
                colorConfirm = Colors.red;
                break;
            case EnumIcon.E_KEY:
                keyTextConfirm = 'Confirm';
                colorConfirm = Colors.primary;
                break;
            case EnumIcon.E_INFO:
                keyTextConfirm = 'Confirm';
                colorConfirm = Colors.primary;
                break;
            case EnumIcon.E_AGREE:
                keyTextConfirm = 'E_AGREE';
                colorConfirm = Colors.primary;
                break;
            // task 0164850
            case EnumIcon.E_FORWARD:
                keyTextConfirm = 'HRM_Common_ForwardTitle_Sal';
                colorConfirm = Colors.purple;
                break;
            default:
                keyTextConfirm = 'HRM_Common_Continue';
                colorConfirm = Colors.primary;
                break;
        }

        return (
            <View
                style={[
                    stylesAlert.buttomAlert,
                    !_showCancel && !_showSecondConfirm && !_showConfirm && CustomStyleSheet.borderTopWidth(0)
                ]}
            >
                <View style={stylesAlert.contentButton}>
                    {_showCancel && (
                        <TouchableOpacity
                            accessibilityLabel={'Alert-Close'}
                            onPress={() => {
                                this._closeModal(id);
                            }}
                            style={[
                                stylesAlert.bnt_Cancel,
                                !_showConfirm && !_showSecondConfirm && stylesAlert.bnt_CancelActive
                            ]}
                        >
                            <VnrText
                                style={[styleSheets.text, { color: Colors.greySecondary }]}
                                i18nKey={
                                    !Vnr_Function.CheckIsNullOrEmpty(textLeftButton)
                                        ? textLeftButton
                                        : 'HRM_Common_Close'
                                }
                            />
                        </TouchableOpacity>
                    )}

                    {_showConfirm && (
                        <TouchableOpacity
                            accessibilityLabel={'Alert-Confirm'}
                            disabled={isDisable}
                            onPress={() => {
                                this._onConfirm(id, isValidInputText);
                            }}
                            style={[stylesAlert.bnt_Second, !_showConfirm && CustomStyleSheet.borderRightWidth(0)]}
                        >
                            <VnrText
                                style={[styleSheets.lable, stylesAlert.bnt_Ok__text, { color: colorConfirm }]}
                                i18nKey={
                                    !Vnr_Function.CheckIsNullOrEmpty(textRightButton) ? textRightButton : keyTextConfirm
                                }
                            />
                        </TouchableOpacity>
                    )}

                    {_showSecondConfirm && (
                        <TouchableOpacity
                            accessibilityLabel={'Alert-SecondConfirm'}
                            disabled={isDisable}
                            onPress={() => {
                                this._onConfirmSecond(id);
                            }}
                            style={[stylesAlert.bnt_Ok]}
                        >
                            <VnrText
                                style={[styleSheets.lable, stylesAlert.bnt_Ok__text, { color: colorSecondConfirm }]}
                                i18nKey={textSecondConfirm}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    renderTitleIncon = (modal) => {
        const { title, iconType } = modal,
            iconSize = Size.iconSize - 2;

        let keyTextConfirm = '',
            iconView = <View />;

        switch (iconType) {
            case EnumIcon.E_WARNING:
                keyTextConfirm = 'HRM_Common_Continue';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconWarning size={iconSize} color={Colors.orange} />
                    </View>
                );
                break;
            case EnumIcon.E_CONFIRM:
                keyTextConfirm = 'Confirm';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconConfirm size={iconSize} color={Colors.primary} />
                    </View>
                );
                break;
            // case EnumIcon.E_MODIFY:
            //   this.keyTextConfirm = 'HRM_System_Resource_Sys_Edit';
            //   return (
            //     <View style={[stylesAlert.icon, { backgroundColor: Colors.warning }]}>
            //       <IconEdit size={iconSize} color={Colors.white} />
            //     </View>
            //   );
            case EnumIcon.E_CANCEL:
                keyTextConfirm = 'HRM_Common_Cancel';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconCancelMarker size={iconSize} color={Colors.red} />
                    </View>
                );
                break;
            case EnumIcon.E_REQUEST_CANCEL:
                keyTextConfirm = 'HRM_Common_Cancel';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconCancelMarker size={iconSize} color={Colors.green} />
                    </View>
                );
                break;
            case EnumIcon.E_APPROVE:
                keyTextConfirm = 'HRM_Common_Approve';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconCheckCirlceo size={iconSize} color={Colors.success} />
                    </View>
                );
                break;
            case EnumIcon.E_REJECT:
                keyTextConfirm = 'HRM_Common_Reject';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconColse size={iconSize} color={Colors.volcano} />
                    </View>
                );
                break;
            case EnumIcon.E_SENDMAIL:
                keyTextConfirm = 'HRM_Common_SendMail';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconMail size={iconSize} color={Colors.purple} />
                    </View>
                );
                break;
            case EnumIcon.E_DELETE:
                keyTextConfirm = 'HRM_Common_Delete';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconDelete size={iconSize} color={Colors.red} />
                    </View>
                );
                break;
            case EnumIcon.E_KEY:
                keyTextConfirm = 'Confirm';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconKey size={iconSize} color={Colors.primary} />
                    </View>
                );
                break;
            case EnumIcon.E_INFO:
                keyTextConfirm = 'Confirm';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconInfo size={iconSize} color={Colors.primary} />
                    </View>
                );
                break;
            // task 0164850
            case EnumIcon.E_FORWARD:
                keyTextConfirm = 'HRM_Common_ForwardTitle_Sal';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconMail size={iconSize} color={Colors.purple} />
                    </View>
                );
                break;
            default:
                keyTextConfirm = 'Confirm';
                iconView = (
                    <View style={stylesAlert.icon}>
                        <IconInfo size={iconSize} color={Colors.primary} />
                    </View>
                );
                break;
        }

        return (
            <View style={stylesAlert.itemTopAlert}>
                {iconView}
                <VnrText
                    style={[styleSheets.lable, stylesAlert.itemTopAlert_title__text]}
                    i18nKey={title ? title : keyTextConfirm}
                />
            </View>
        );
    };

    showAlert = (object) => {
        this.addModal(object);
    };

    componentDidMount() {
        api.alert = this.showAlert;
    }

    // componentDidUpdate(){
    //   this.autoFocusInput();
    // }

    createModal(modal) {
        const { keyboardSpace, inputValue, FileAttachment } = this.state,
            {
                isVisible,
                title,
                message,
                isValidInputText,
                id,
                isInputText,
                typeInputText,
                placeholder,
                autoFocus,
                isShowHidePass,
                lableCheckBox,
                isCheckBox,
                isAttachFile,
                isNotNullAttachFile,
                limit,
                textLimit,
                limitFile,
                textLimitFile
            } = modal;

        let marginTopModal = Size.deviceheight / 2 - heightModal / 2 - (isInputText ? 71 : 50),
            marginTopAfterKeyboardShow =
                Size.deviceheight - keyboardSpace - this.heightModalLayout - (isInputText ? 71 : 50);

        if (isAttachFile) {
            marginTopModal = marginTopModal - 50;
        }

        if (autoFocus && autoFocus === true) {
            this.autoFocusInput();
        }

        return (
            <Modal
                animationIn="fadeIn"
                animationOut="fadeOut"
                key={id}
                isVisible={isVisible}
                onBackdropPress={() => this.backDropOnPress(id)}
                style={[
                    stylesAlert.modal,
                    {
                        minHeight: heightModal,
                        //height: 'auto',
                        top:
                            keyboardSpace && marginTopAfterKeyboardShow < marginTopModal
                                ? marginTopAfterKeyboardShow
                                : marginTopModal
                    }
                ]}
            >
                <View
                    style={stylesAlert.styViewContent}
                    onLayout={(event) => {
                        this.heightModalLayout = event.nativeEvent.layout.height;
                    }}
                >
                    <View style={[stylesAlert.contentToaster]}>
                        <View style={stylesAlert.topAlert}>
                            {title && this.renderTitleIncon(modal)}

                            {message && (
                                <View style={stylesAlert.itemTopAlert}>
                                    <VnrText
                                        i18nKey={message}
                                        style={[styleSheets.text, stylesAlert.itemTopAlert_message__text]}
                                    />
                                </View>
                            )}

                            {isCheckBox != null && isCheckBox != undefined && (
                                <View style={stylesAlert.itemTopAlert}>
                                    <View style={stylesAlert.styViewCheckbox}>
                                        <VnrText
                                            style={[styleSheets.text]}
                                            i18nKey={lableCheckBox ? lableCheckBox : 'E_CONFREPORT_CONTTYPE_CHECKBOX'}
                                        />
                                        <CheckBox
                                            checkBoxColor={Colors.primary}
                                            checkedCheckBoxColor={Colors.primary}
                                            isChecked={isCheckBox}
                                            onClick={() =>
                                                this.setState({
                                                    isCheckBox: !isCheckBox
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {isInputText && typeInputText === 'E_PASSWORD' && (
                                <View style={stylesAlert.itemTopAlertPassWord}>
                                    <TextInput
                                        ref={(ref) => (this.refsTextInput = ref)}
                                        style={[
                                            styleSheets.text,
                                            stylesAlert.itemTopAlert_input,
                                            CustomStyleSheet.paddingVertical(8),
                                            CustomStyleSheet.borderWidth(0)
                                        ]}
                                        secureTextEntry={isShowHidePass ? false : true}
                                        onSubmitEditing={() => this._onConfirm(id, isValidInputText)}
                                        returnKeyType={'done'}
                                        placeholder={placeholder}
                                        onChangeText={(text) => this.setState({ inputValue: text })}
                                        value={inputValue}
                                        multiline={false}
                                        numberOfLines={2}
                                        autoCapitalize={'none'}
                                    />

                                    <TouchableOpacity
                                        style={stylesAlert.styBtnShowHide}
                                        onPress={() => this.showHidePassword(id)}
                                    >
                                        {isShowHidePass ? (
                                            <IconEyeOff size={Size.iconSize - 3} color={Colors.grey} />
                                        ) : (
                                            <IconEye size={Size.iconSize - 3} color={Colors.grey} />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            )}

                            {isInputText && typeInputText !== 'E_PASSWORD' && (
                                <View style={stylesAlert.itemTopAlert}>
                                    <View style={stylesAlert.styViewInputValid}>
                                        <TextInput
                                            ref={(ref) => (this.refsTextInput = ref)}
                                            style={[
                                                styleSheets.text,
                                                stylesAlert.itemTopAlert_input_valid,

                                                typeInputText == 'E_PASSWORD' && CustomStyleSheet.paddingVertical(8)
                                            ]}
                                            // autoFocus={typeInputText == 'E_PASSWORD'}
                                            secureTextEntry={typeInputText == 'E_PASSWORD' ? true : false}
                                            onSubmitEditing={() => this._onConfirm(id, isValidInputText)}
                                            returnKeyType={'done'}
                                            placeholder={placeholder}
                                            onChangeText={(text) => this.setState({ inputValue: text })}
                                            value={inputValue}
                                            multiline={typeInputText == 'E_PASSWORD' ? false : true}
                                            numberOfLines={2}
                                            autoCapitalize={'none'}
                                        />
                                        {(inputValue === null || inputValue === '') && isValidInputText && (
                                            <VnrText
                                                style={[
                                                    styleSheets.lable,
                                                    stylesAlert.itemTopAlert_title__text,
                                                    styleValid
                                                ]}
                                                i18nKey={'HRM_Valid_Char'}
                                            />
                                        )}
                                    </View>
                                </View>
                            )}

                            {limit && !isNaN(Number(limit)) && textLimit && inputValue && inputValue.length > limit ? (
                                <View style={CustomStyleSheet.paddingHorizontal(5)}>
                                    <Text numberOfLines={2} style={CustomStyleSheet.color(Colors.red)}>
                                        {translate(textLimit)}
                                    </Text>
                                </View>
                            ) : null}

                            {isAttachFile && (
                                <VnrAttachFile
                                    ref={(ref) => (this.refVnrAttachFile = ref)}
                                    fieldValid={isNotNullAttachFile ? isNotNullAttachFile : false}
                                    lable={FileAttachment.lable}
                                    refresh={FileAttachment.refresh}
                                    value={FileAttachment.value}
                                    multiFile={true}
                                    style={stylesAlert.styVnrAttach}
                                    styleUserUpload={CustomStyleSheet.paddingHorizontal(0)}
                                    uri={'[URI_CENTER]/api/Sys_Common/saveFileFromApp'}
                                    onFinish={(file) => {
                                        if (Array.isArray(file) && file.length > limitFile) {
                                            this.setState({
                                                FileAttachment: {
                                                    ...FileAttachment,
                                                    refresh: !FileAttachment.refresh,
                                                    isOverLimitFile: true
                                                }
                                            });
                                        } else {
                                            this.setState({
                                                FileAttachment: {
                                                    ...FileAttachment,
                                                    value: file,
                                                    refresh: !FileAttachment.refresh,
                                                    isOverLimitFile: false
                                                }
                                            });
                                        }
                                    }}
                                >
                                    <TouchableOpacity
                                        style={stylesAlert.stylesBtnAttach}
                                        onPress={() =>
                                            this.refVnrAttachFile ? this.refVnrAttachFile.showActionSheet() : null
                                        }
                                    >
                                        <VnrText
                                            style={[styleSheets.text, { color: Colors.white }]}
                                            i18nKey={FileAttachment.lable}
                                        />
                                    </TouchableOpacity>
                                </VnrAttachFile>
                            )}

                            {FileAttachment?.isOverLimitFile ? (
                                <View style={CustomStyleSheet.paddingHorizontal(5)}>
                                    <Text numberOfLines={2} style={CustomStyleSheet.color(Colors.red)}>
                                        {translate(textLimitFile)}
                                    </Text>
                                </View>
                            ) : null}
                        </View>

                        {this.renderButtonAlert(modal)}
                    </View>
                </View>
            </Modal>
        );
    }

    // #region: modal V3
    renderButtonAlertV3 = (modal) => {
        const { isValidInputText, textRightButton, id, iconType, limit, textLimit, limitFile } = modal;

        let colorConfirm = null,
            keyTextConfirm = '',
            isDisable =
                (limit &&
                    !isNaN(Number(limit)) &&
                    textLimit &&
                    this.state.inputValue &&
                    this.state.inputValue.length > limit) ||
                (this.state.FileAttachment.isOverLimitFile && this.state.FileAttachment.value.length > limitFile) ||
                (isValidInputText && this.state.inputValue.length === 0);

        switch (iconType) {
            case EnumIcon.E_WARNING:
                keyTextConfirm = 'HRM_Common_Continue';
                colorConfirm = Colors.orange;
                break;
            case EnumIcon.E_CONFIRM:
                keyTextConfirm = 'Confirm';
                colorConfirm = Colors.primary;
                break;
            case EnumIcon.E_CANCEL:
                keyTextConfirm = 'HRM_Common_Cancel';
                colorConfirm = Colors.red;
                break;
            case EnumIcon.E_REQUEST_CANCEL:
                keyTextConfirm = 'HRM_Common_Cancel';
                colorConfirm = Colors.green;
                break;
            case EnumIcon.E_APPROVE:
                keyTextConfirm = 'HRM_PortalApp_ConfirmationOfApprove';
                colorConfirm = Colors.success;
                break;
            case EnumIcon.E_REJECT:
                keyTextConfirm = 'HRM_PortalApp_ConfirmationOfRejection';
                colorConfirm = Colors.volcano;
                break;
            case EnumIcon.E_SENDMAIL:
                keyTextConfirm = 'HRM_Common_SendMail';
                colorConfirm = Colors.purple;
                break;
            case EnumIcon.E_DELETE:
                keyTextConfirm = 'HRM_Common_Delete';
                colorConfirm = Colors.red;
                break;
            case EnumIcon.E_KEY:
                keyTextConfirm = 'Confirm';
                colorConfirm = Colors.primary;
                break;
            case EnumIcon.E_INFO:
                keyTextConfirm = 'Confirm';
                colorConfirm = Colors.primary;
                break;
            case EnumIcon.E_AGREE:
                keyTextConfirm = 'E_AGREE';
                colorConfirm = Colors.primary;
                break;
            // task 0164850
            case EnumIcon.E_FORWARD:
                keyTextConfirm = 'HRM_Common_ForwardTitle_Sal';
                colorConfirm = Colors.purple;
                break;
            case EnumIcon.E_REQUEST_CHANGE:
                keyTextConfirm = 'HRM_PortalApp_ConfirmationofChangeRequest';
                colorConfirm = Colors.purple;
                break;
            default:
                keyTextConfirm = 'HRM_Common_Continue';
                colorConfirm = Colors.primary;
                break;
        }

        return (
            <View style={stylesAlert.wrapBtnModalV3}>
                <TouchableOpacity
                    accessibilityLabel={`Alert-${iconType}`}
                    disabled={isDisable}
                    onPress={() => {
                        this._onConfirm(id, isValidInputText);
                    }}
                    style={[
                        stylesAlert.btnModalV3,
                        {
                            backgroundColor: colorConfirm
                        },
                        isDisable && {
                            backgroundColor: Colors.gray_3
                        }
                    ]}
                >
                    <VnrText
                        style={[
                            styleSheets.lable,
                            stylesAlert.bnt_Ok__text,
                            { color: Colors.white },
                            isDisable && {
                                color: Colors.black
                            }
                        ]}
                        i18nKey={!Vnr_Function.CheckIsNullOrEmpty(textRightButton) ? textRightButton : keyTextConfirm}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    renderModalV3 = (modal) => {
        const { inputValue } = this.state,
            { iconType, isVisible, title, message, id, autoFocus, placeholder, isValidInputText } = modal;

        if (autoFocus && autoFocus === true) {
            this.autoFocusInput();
        }

        return (
            <Modal
                animationIn="fadeIn"
                animationOut="fadeOut"
                avoidKeyboard={true}
                key={id}
                isVisible={isVisible}
                onBackdropPress={() => {
                    this._closeModal(id);
                }}
                style={[
                    stylesAlert.containerModalV3
                    // Platform.OS === 'ios' && { marginBottom: keyboardSpace }
                ]}
            >
                <View
                    style={stylesAlert.wrapViewModalV3}
                    onLayout={(event) => {
                        this.heightModalLayout = event.nativeEvent.layout.height;
                    }}
                >
                    <View style={[stylesAlert.contentToaster, CustomStyleSheet.backgroundColor(Colors.white)]}>
                        <View style={stylesAlert.wrapContentModalV3}>
                            <View style={stylesAlert.headerModalV3}>
                                <Text style={[styleSheets.lable]}>{title ? translate(title) : ''}</Text>

                                <TouchableOpacity
                                    accessibilityLabel={'Alert-Close'}
                                    onPress={() => {
                                        this._closeModal(id);
                                    }}
                                >
                                    <IconCancel size={22} color={Colors.black} />
                                </TouchableOpacity>
                            </View>

                            {message && message.length > 0 ? (
                                <View style={[stylesAlert.messageModalV3]}>
                                    <VnrText
                                        i18nKey={message}
                                        style={[
                                            styleSheets.text,
                                            {
                                                fontSize: Size.text
                                            }
                                        ]}
                                    />
                                </View>
                            ) : null}

                            <View style={stylesAlert.styViewInput}>
                                <View style={stylesAlert.wrapReasonModalV3}>
                                    <VnrTextInput
                                        lable={placeholder}
                                        textField={iconType}
                                        fieldValid={(inputValue === null || inputValue === '') && isValidInputText}
                                        ref={(ref) => (this.refsTextInput = ref)}
                                        placeHolder={'HRM_PortalApp_PleaseInput'}
                                        style={[
                                            // CustomStyleSheet.flex(1),
                                            styleSheets.text,
                                            stylesVnrPickerV3.viewInputMultiline,
                                            CustomStyleSheet.maxHeight('100%')
                                        ]}
                                        styleContent={stylesAlert.reasonModalV3}
                                        multiline={true}
                                        value={inputValue}
                                        onChangeText={(text) => this.setState({ inputValue: text })}
                                    />
                                </View>
                            </View>
                        </View>

                        {this.renderButtonAlertV3(modal)}
                    </View>
                </View>
            </Modal>
        );
    };

    // #endregion

    render() {
        const { Modals } = this.state;
        return (
            <View style={CustomStyleSheet.zIndex(2)}>
                {Modals.map((modal) => {
                    if (modal?.isInputText && modal?.typeInputText !== 'E_PASSWORD') {
                        return this.renderModalV3(modal);
                    } else {
                        return this.createModal(modal);
                    }
                })}
            </View>
        );
    }
}

const stylesAlert = StyleSheet.create({
    styVnrAttach: {
        borderWidth: 0,
        borderColor: Colors.gray_5,
        marginBottom: 10,
        paddingLeft: 0,
        borderBottomWidth: 0
    },
    styViewContent: {
        flex: 1,
        flexDirection: 'column'
    },
    stylesBtnAttach: {
        backgroundColor: Colors.primary,
        height: 44,
        borderRadius: 8,
        paddingHorizontal: Size.defineSpace,
        justifyContent: 'center',
        marginTop: 5
    },
    modal: {
        backgroundColor: Colors.white,
        position: 'absolute',
        maxWidth: 400,
        width: Size.deviceWidth * 0.8,
        marginHorizontal:
            Size.deviceWidth * 0.8 >= 400
                ? (Size.deviceWidth - 400) / 2
                : (Size.deviceWidth - Size.deviceWidth * 0.8) / 2,
        borderRadius: 8,
        borderColor: Colors.gray_5,
        borderWidth: 0.5
    },
    contentButton: {
        flex: 1,
        flexDirection: 'row'
        // paddingVertical: styleSheets.p_10,
    },
    contentToaster: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        position: 'relative'

        // paddingVertical: 14
        // paddingTop: 55,
    },
    topAlert: {
        width: '100%',
        minHeight: '30%',
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: styleSheets.p_10,
        // paddingTop: 5,k
        paddingTop: 18,
        paddingBottom: 10
    },
    itemTopAlert: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        flexDirection: 'row',
        paddingHorizontal: 5
    },
    itemTopAlertPassWord: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.gray_5,
        paddingHorizontal: 10
    },
    styBtnShowHide: {
        marginRight: 10
    },
    buttomAlert: {
        // width: '100%',
        // height: '20%',
        flex: 1,
        justifyContent: 'center',
        borderTopColor: Colors.gray_5,
        borderTopWidth: 0.5,
        paddingVertical: 3
        // paddingHorizontal: styleSheets.p_10,
    },
    bnt_Cancel: {
        minHeight: 44,
        // backgroundColor: Colors.borderColor,
        // borderRadius: styleSheets.radius_5,
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightColor: Colors.gray_5,
        borderRightWidth: 0.5
    },
    bnt_CancelActive: { flex: 10, borderRightWidth: 0 },
    bnt_Ok: {
        minHeight: 44,
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bnt_Second: {
        minHeight: 44,
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightColor: Colors.gray_5,
        borderRightWidth: 0.5
    },
    bnt_Ok__text: {
        fontWeight: '600',
        fontSize: Size.text + 1
    },
    itemTopAlert_title__text: {
        textAlign: 'center',
        paddingRight: 11,
        fontSize: Size.text,
        fontWeight: '600'
    },
    itemTopAlert_message__text: {
        textAlign: 'center',
        fontSize: Size.text
    },
    itemTopAlert_input: {
        width: '100%',
        height: 44,
        fontSize: Size.text,
        paddingHorizontal: 10,
        paddingVertical: 0,
        borderWidth: 1,
        borderColor: Colors.gray_5,
        borderRadius: 8
    },
    itemTopAlert_input_valid: {
        flex: 1,
        width: 'auto',
        height: 44,
        fontSize: Size.text
    },
    icon: {
        paddingRight: 11
        // backgroundColor: Colors.white,
        // maxWidth: 85,
        // maxHeight: 85,
        // height: Size.deviceWidth * 0.18,
        // width: Size.deviceWidth * 0.18,
        // justifyContent: 'center',
        // alignItems: 'center',
        // borderRadius: Size.deviceWidth * 0.18 > 90 ? 42.5 : (Size.deviceWidth * 0.18) / 2,
    },
    styViewInputValid: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingVertical: 0,
        borderWidth: 1,
        borderColor: Colors.gray_5,
        borderRadius: 8
    },
    styViewCheckbox: {
        height: 44,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Size.defineHalfSpace,
        borderWidth: 1,
        borderColor: Colors.gray_5,
        borderRadius: 8
    },

    containerModalV3: {
        justifyContent: 'flex-end',
        margin: 0
    },

    wrapViewModalV3: {
        width: '100%',
        height: height40,
        justifyContent: 'flex-end'
    },

    wrapContentModalV3: {
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.white
    },
    styViewInput: {
        flex: 1,
        paddingLeft: Size.defineSpace,
        paddingHorizontal: Size.defineHalfSpace,
        backgroundColor: Colors.white
    },
    headerModalV3: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: Colors.gray_2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    messageModalV3: {
        marginTop: 6,
        paddingHorizontal: 12,
        backgroundColor: Colors.white
    },

    wrapReasonModalV3: {
        flex: 1
    },

    reasonModalV3: {
        paddingHorizontal: 0,
        borderBottomWidth: 0,
        height: '100%'
    },

    wrapBtnModalV3: {
        height: 74,
        width: '100%',
        paddingHorizontal: 14,
        paddingVertical: 16,
        borderTopColor: Colors.gray_5,
        borderTopWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white
    },

    btnModalV3: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8
    }
});
