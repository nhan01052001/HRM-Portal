import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styleSheets, Size, Colors, CustomStyleSheet } from '../../../../constants/styleConfig';
import { IconCancel } from '../../../../constants/Icons';
import VnrText from '../../../../components/VnrText/VnrText';
import { ToasterSevice, ToasterInModal } from '../../../../components/Toaster/Toaster';
import { AlertInModal } from '../../../../components/Alert/Alert';
import { EnumName, EnumIcon } from '../../../../assets/constant';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import styleComonAddOrEdit from '../../../../constants/styleComonAddOrEdit';
import VnrIndeterminate from '../../../../components/VnrLoading/VnrIndeterminate';
import Modal from 'react-native-modal';
import { TouchableWithoutFeedback } from 'react-native';

const initSateDefault = {
    isRefresh: false,
    ID: null,
    Profile: {
        label: 'HRM_Attendance_Leaveday_ProfileID',
        ID: null,
        ProfileName: '',
        disable: true
    },
    UserReceiver: {
        // label: 'HRM_Attendance_LateEarlyAllowed_UserApproveName',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    Cost: {
        lable: 'HRM_PortalApp_Compliment_Cost',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    dataSelect: [],
    fieldValid: {},
    isConfigMultiShift: false,
    params: null,
    isShowModal: false,
    isShowLoading: false,
    dayNotHaveShift: null,
    dispensingPoint: null
};

export default class GiftConfirmExChangeComCompliment extends Component {
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

        if (!record) {
            // [CREATE] Step 3: Tạo mới
            this.isModify = false;
            this.initData();
        } else {
            // [EDIT] Step 3: Chỉnh sửa
            this.isModify = true;
            this.getRecordAndConfigByID(record, this.handleSetState);
        }
    };

    componentDidMount() {}

    handleSetState = (response) => {
        const { UserReceiver, Profile } = this.state;
        this.levelApprove = response.LevelApproved ? response.LevelApproved : 4;

        const profileInfo = dataVnrStorage
            ? dataVnrStorage.currentUser
                ? dataVnrStorage.currentUser.info
                : null
            : null;

        const { E_ProfileID, E_FullName } = EnumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] };

        let nextState = {
            isShowModal: true,
            Profile: {
                ...Profile,
                ..._profile
            },
            UserReceiver: {
                ...UserReceiver,
                value: [response],
                refresh: !UserReceiver.refresh
            }
        };

        this.setState(nextState, () => {
            this.getCriteriaGroup();
        });
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

        this.setState(nextState, () => {
            // Show modal chọn ngày đăng ký
            //this.onShowUserReceiver();
        });
    };

    refreshForm = () => {
        this.AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            title: 'HRM_PortalApp_OnReset',
            message: 'HRM_PortalApp_OnReset_Message',
            onCancel: () => {},
            onConfirm: () => {
                this.setState(initSateDefault, () => this.onShowUserReceiver());
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
            iconType: EnumIcon.E_WARNING,
            title: 'HRM_PortalApp_OnSave_Temp',
            message: 'HRM_PortalApp_OnSave_Temp_Message',
            onCancel: () => {},
            onConfirm: () => {
                this.onSave();
            }
        });
    };

    onSave = () => {
        ToasterSevice.showSuccess('Hrm_Succeed', 5500);
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
        const { isShowModal } = this.state;

        const { dateItems, totalPoints } = this.props;

        return (
            <View style={styles.container}>
                <Modal
                    onBackButtonPress={() => this.onClose()}
                    isVisible={isShowModal}
                    onBackdropPress={() => this.onClose()}
                    customBackdrop={
                        <TouchableWithoutFeedback onPress={() => this.onClose()}>
                            <View style={styles.styTouchBackDrop} />
                        </TouchableWithoutFeedback>
                    }
                    style={styles.styModal}
                >
                    <SafeAreaView style={styles.wrapInsideModal}>
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
                                i18nKey={'Xác nhận quy đổi'}
                            />
                            <TouchableOpacity onPress={() => this.onClose()}>
                                <IconCancel size={Size.iconSize} color={Colors.gray_8} />
                            </TouchableOpacity>
                        </View>

                        {this._renderHeaderLoading()}
                        <KeyboardAvoidingView
                            scrollEnabled={true}
                            style={[styleComonAddOrEdit.styAvoiding]}
                            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                        >
                            <ScrollView style={styles.wrapModalAdd}>
                                <View style={[styleComonAddOrEdit.styViewLogo, CustomStyleSheet.marginBottom(0)]}>
                                    <Image
                                        source={require('../../../../assets/images/compliment/gift_2.png')}
                                        style={styles.styBtnCreateIcon}
                                    />
                                    <VnrText
                                        style={styleSheets.text}
                                        i18nKey={`Bạn có chắc muốn đổi ${
                                            Array.isArray(dateItems) && dateItems.length
                                        } phần quà với`}
                                    />
                                    <View style={CustomStyleSheet.marginVertical(12)}>
                                        <Text
                                            style={[
                                                styleSheets.lable,
                                                styleComonAddOrEdit.styHeaderText,
                                                CustomStyleSheet.fontWeight('700')
                                            ]}
                                        >
                                            {totalPoints} điểm
                                        </Text>
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
                                    i18nKey={'HRM_PortalApp_Compliment_Commfirm'}
                                />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </Modal>
            </View>
        );
    }
}

const HIGHT_BTN = Size.deviceWidth >= 1024 ? 60 : Size.deviceWidth * 0.15;
const styles = {
    ...styleComonAddOrEdit,
    ...StyleSheet.create({
        styModal: {
            padding: 0,
            margin: 0
        },
        styTouchBackDrop: {
            flex: 1,
            backgroundColor: Colors.black,
            opacity: 0.7
        },
        wrapInsideModal: {
            position: 'absolute',
            bottom: 0,
            // height: Size.deviceheight * 0.4,
            width: Size.deviceWidth,
            backgroundColor: Colors.white
        },
        styCost: {
            borderWidth: 0.5,
            borderColor: Colors.gray_5,
            borderRadius: 2,
            textAlign: 'center'
        },
        styBtnCreateIcon: {
            width: HIGHT_BTN,
            height: HIGHT_BTN,
            borderRadius: HIGHT_BTN / 2,
            resizeMode: 'cover',
            marginBottom: Size.defineSpace
        },
        wrapModalAdd: {
            // flex: 1,
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
        styCheckbox: {
            width: Size.iconSize + 4,
            height: Size.iconSize + 4,
            borderRadius: (Size.iconSize + 4) / 2,
            borderWidth: 1,
            borderColor: Colors.gray_5,
            justifyContent: 'center',
            alignItems: 'center'
        },

        styLableGp: {
            color: Colors.gray_9
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
            backgroundColor: Colors.blue,
            marginRight: 0
        },
        styInput: {
            paddingHorizontal: 0
        }
    })
};
