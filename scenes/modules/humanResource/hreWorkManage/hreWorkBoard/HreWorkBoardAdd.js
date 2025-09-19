import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styleSheets, Size, Colors, stylesVnrPickerV3, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { IconCancel } from '../../../../../constants/Icons';
import VnrText from '../../../../../components/VnrText/VnrText';
import { ToasterInModal } from '../../../../../components/Toaster/Toaster';
import { translate } from '../../../../../i18n/translate';
import { AlertInModal } from '../../../../../components/Alert/Alert';
import { EnumName } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';
import VnrIndeterminate from '../../../../../components/VnrLoading/VnrIndeterminate';
import VnrTextInput from '../../../../../componentsV3/VnrTextInput/VnrTextInput';
import VnrAttachFile from '../../../../../componentsV3/VnrAttachFile/VnrAttachFile';

const initSateDefault = {
    isRefresh: false,
    ID: null,
    record: null,
    Profile: {
        label: 'HRM_Attendance_Leaveday_ProfileID',
        ID: null,
        ProfileName: '',
        disable: true
    },
    Note: {
        lable: 'HRM_PortalApp_Tas_Note',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    AmountOfArrears: {
        lable: 'HRM_PortalApp_Tas_AmountOfArrears',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    AttachFile: {
        lable: 'HRM_PortalApp_TSLRegister_Attachment',
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    dataSelect: [],
    fieldValid: {},
    params: null,
    isShowModal: false,
    isShowLoading: false,
    dayNotHaveShift: null,
    dispensingPoint: null
};

export default class ComComplimentAddOrEdit extends Component {
    constructor(props) {
        super(props);
        this.state = initSateDefault;
        this.refReceiver = null;
        this.listRefGetDataSave = {};
        this.isModify = false;
        this.isProcessing = false;
    }

    //#region [khởi tạo - check đăng ký hộ, lấy các dữ liệu cho control, lấy giá trị mặc đinh]

    //promise get config valid
    getConfigValid = () => {
        const { params } = this.state;

        let { record } = params;
        this.initData(record);
    };

    componentDidMount() {}

    handleSetState = () => {};

    getRecordAndConfigByID = (record, _handleSetState) => {
        // trường hợp có get config thì vào hàm này get
        _handleSetState(record);
    };
    //#endregion

    initData = (record) => {
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
            isShowModal: true,
            record: record
        };

        this.setState(nextState);
    };

    //#endregion

    //#region [lưu]
    onSaveAndSend = () => {
        this.onSave(true);
    };

    onSave = () => {
        const { AttachFile, AmountOfArrears, Note, record, params } = this.state;
        const { onAddDone } = params;
        if (this.isProcessing) return;

        let payload = {
            ...record,
            AmountOfArrears: AmountOfArrears.value ? parseFloat(AmountOfArrears.value.split(',').join('')) : '',
            Note: Note.value,
            AttachFile: AttachFile.value ? AttachFile.value.map((item) => item.fileName).join(',') : null
        };
        this.onClose();
        onAddDone && onAddDone(payload);
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
                params: params ? params : {}
            },
            () => {
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

    render() {
        const { AttachFile, AmountOfArrears, Note, isShowModal, record } = this.state,
            { viewInputMultiline } = stylesVnrPickerV3;

        return (
            <View style={styles.container}>
                <Modal visible={isShowModal} animationType="slide" transparent={false} style={styles.styModal}>
                    <SafeAreaView
                        style={[
                            styleComonAddOrEdit.wrapInsideModal,
                            {
                                height: Size.deviceWidth * 0.8
                            }
                        ]}
                    >
                        <ToasterInModal
                            ref={(refs) => {
                                this.ToasterSevice = refs;
                            }}
                        />
                        <AlertInModal ref={(refs) => (this.AlertSevice = refs)} />

                        <View style={styleComonAddOrEdit.flRowSpaceBetween}>
                            <VnrText
                                style={[
                                    styleSheets.lable,
                                    styleComonAddOrEdit.styHeaderText,
                                    CustomStyleSheet.fontWeight('700')
                                ]}
                                i18nKey={'HRM_PortalApp_Tas_AddInfo'}
                            />
                            <TouchableOpacity onPress={() => this.onClose()}>
                                <IconCancel size={Size.iconSize} color={Colors.gray_8} />
                            </TouchableOpacity>
                        </View>
                        {/*
                                <View style={styleComonAddOrEdit.styViewLogo}>
                                    <Image source={require('../../../../../assets/images/vnrDateFromTo/Group.png')} />
                                </View> */}

                        {this._renderHeaderLoading()}
                        <KeyboardAvoidingView
                            scrollEnabled={true}
                            style={[styleComonAddOrEdit.styAvoiding, styles.styContenGray]}
                            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                        >
                            <ScrollView style={styles.wrapModalAdd}>
                                <View style={styles.flRowSpaceBetween}>
                                    <VnrText
                                        style={[styleSheets.lable, styles.styLableGp]}
                                        value={` ${record?.WorkListCode} - ${record?.WorkListName}`}
                                    />
                                </View>

                                <View style={styles.wrapItem}>
                                    <VnrTextInput
                                        placeholder={translate('HRM_PortalApp_PleaseInput')}
                                        lable={AmountOfArrears.lable}
                                        value={AmountOfArrears.value}
                                        isTextRow={true}
                                        keyboardType={'numeric'}
                                        charType={'money'}
                                        returnKeyType={'done'}
                                        onChangeText={(text) => {
                                            this.setState({
                                                AmountOfArrears: {
                                                    ...AmountOfArrears,
                                                    value: text,
                                                    refresh: !AmountOfArrears.refresh
                                                }
                                            });
                                        }}
                                        refresh={AmountOfArrears.refresh}
                                    />

                                    <VnrTextInput
                                        placeholder={translate('HRM_PortalApp_PleaseInput')}
                                        disable={Note.disable}
                                        lable={Note.lable}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        value={Note.value}
                                        onChangeText={(text) => {
                                            this.setState({
                                                Note: {
                                                    ...Note,
                                                    value: text,
                                                    refresh: !Note.refresh
                                                }
                                            });
                                        }}
                                        refresh={Note.refresh}
                                    />

                                    {/* Tập tin đính kèm */}
                                    <View style={{}}>
                                        <VnrAttachFile
                                            lable={AttachFile.lable}
                                            disable={AttachFile.disable}
                                            refresh={AttachFile.refresh}
                                            value={AttachFile.value}
                                            multiFile={true}
                                            uri={'[URI_CENTER]/api/Sys_Common/saveFileFromApp'}
                                            onFinish={(file) => {
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
                            </ScrollView>
                        </KeyboardAvoidingView>

                        {/* button */}
                        <View style={styles.wrapButtonHandler}>
                            <TouchableOpacity
                                style={[styles.wrapBtnRegister, styles.wrapRegister]}
                                onPress={() => this.onSaveAndSend()}
                            >
                                <VnrText
                                    style={[styleSheets.lable, styles.styRegister]}
                                    i18nKey={'HRM_PortalApp_Compliment_Send'}
                                />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </Modal>
            </View>
        );
    }
}

const styles = {
    ...styleComonAddOrEdit,
    ...StyleSheet.create({
        styModal: { padding: 0, margin: 0 },
        wrapModalAdd: {
            flex: 1
        },
        styContenGray: {
            flex: 1,
            backgroundColor: Colors.gray_4
        },
        styGroup: {
            marginBottom: Size.defineHalfSpace
        },
        styBtnGroup: {
            flexDirection: 'row',
            backgroundColor: Colors.white,
            paddingHorizontal: Size.defineSpace,
            paddingVertical: Size.defineHalfSpace,
            alignItems: 'center',
            borderBottomColor: Colors.gray_5,
            borderBottomWidth: 0.5
        },
        styViewItem: {
            backgroundColor: Colors.white
        },
        styBtnItem: {
            alignItems: 'center',
            flexDirection: 'row',
            marginLeft: Size.defineSpace * 2 + 5,
            paddingVertical: Size.defineHalfSpace,
            paddingRight: Size.defineSpace,
            borderBottomColor: Colors.gray_5,
            borderBottomWidth: 0.5
        },
        styViewIcon: {
            marginRight: Size.defineHalfSpace
        },
        styImgIcon: {
            width: 50,
            height: 50,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.gray_4
        },
        styViewTitle: {
            flex: 1,
            marginLeft: Size.defineHalfSpace
        },
        styTxtTitle: {
            fontSize: Size.text - 1,
            color: Colors.gray_8
        },
        styTxtPoint: {
            fontSize: Size.text - 1,
            color: Colors.orange
        },
        styCheckbox: {
            width: Size.iconSize + 4,
            height: Size.iconSize + 4,
            // borderRadius: (Size.iconSize + 4) / 2,
            // borderWidth: 1,
            // borderColor: Colors.gray_5,
            justifyContent: 'center',
            alignItems: 'center'
        },

        styLableGp: {
            fontSize: Size.text + 1,
            color: Colors.gray_10
        },
        styUserView: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        styUserName: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingLeft: Size.defineSpace + 25
        },
        styUserLable: {
            color: Colors.gray_9,
            marginLeft: Size.defineHalfSpace
        },
        styUserTxtName: {
            marginLeft: Size.defineHalfSpace
        },

        wrapRegister: {
            backgroundColor: Colors.blue
        },
        styInput: {
            paddingHorizontal: 0
        }
    })
};
