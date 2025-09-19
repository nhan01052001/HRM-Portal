import React, { Component } from 'react';
import {
    Image,
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
    Platform,
    AppState,
    ScrollView,
    TouchableWithoutFeedback
} from 'react-native';
import { Colors, Size, styleSheets, styleSafeAreaView, stylesModalPopupBottom } from '../../constants/styleConfig';
import { dataVnrStorage, logout, setdataVnrStorage } from '../../assets/auth/authentication';
import generalProfileInfo from '../../redux/generalProfileInfo';
import {
    IconLock,
    IconNext,
    IconLogout,
    IconConfirm,
    IconCancel,
    IconColse,
    IconContacts,
    IconInfo,
    IconMail,
    IconPhone,
    IconAppStore,
    IconAndroid,
    IconFeedback
} from '../../constants/Icons';
import { UpdateVersionApi } from '../../components/modalUpdateVersion/ModalUpdateVersion';
import VnrText from '../../components/VnrText/VnrText';
import { SafeAreaView } from 'react-navigation';
import languageReducer from '../../redux/i18n';
import { connect } from 'react-redux';
import HttpService from '../../utils/HttpService';
import { VnrLoadingSevices } from '../../components/VnrLoading/VnrLoadingPages';
import DeviceInfo from 'react-native-device-info';
import { ToasterSevice } from '../../components/Toaster/Toaster';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import TouchID from 'react-native-touch-id';
import { Switch } from 'react-native-gesture-handler';
import { AlertSevice } from '../../components/Alert/Alert';
import { EnumIcon, EnumName, EnumTask, EnumUser } from '../../assets/constant';
import { translate } from '../../i18n/translate';
import DrawerServices from '../../utils/DrawerServices';
import { SInfoService, getDataLocal, saveDataLocal } from '../../factories/LocalData';
import { PermissionForAppMobile } from '../../assets/configProject/PermissionForAppMobile';
import Modal from 'react-native-modal';
import Vnr_Function from '../../utils/Vnr_Function';
import CodePush from 'react-native-code-push';
import { setDataLang } from '../../i18n/setDataLang';
import TouchIDService from '../../utils/TouchIDService';

const sourceTouchID = '../../assets/images/TouchID.png';
const sourceFaceID = '../../assets/images/FaceID.png';

class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thisVersion: '',
            isLoadingCheckVer: false,
            isTouchID: '',
            appState: AppState.currentState,
            isVisible: false,
            data: [],
            dataHelpdesk: {
                isLoading: false,
                data: null,
                isVisibleModal: false
            },
            isVisibleChangePassSal: false,
            isAlignLeft: true
        };
    }

    setupData = async () => {
        const { userid } = dataVnrStorage.currentUser.headers;

        const data = (await SInfoService.getItem(EnumUser.DATASAVEID)) || [];
        const user = data.find((f) => {
            return f.userid === userid;
        });

        if (user && user.touchID && this.state.isTouchID) {
            this.setState({
                isEnabled: true
            });
        } else {
            this.setState({
                isEnabled: false
            });
        }
    };

    // thoát app và xóa vân tay, vào lại app thì tự cập nhật

    _handleAppStateChange = (nextAppState) => {
        const optionalConfigObject = {
            unifiedErrors: false,
            passcodeFallback: true
        };
        if (nextAppState === 'active') {
            TouchID.isSupported(optionalConfigObject)
                .then((biometryType) => {
                    this.setState({
                        isTouchID: biometryType === 'FaceID' ? 'FaceID' : 'TouchID',
                        isVisible: true
                    });
                })
                .catch(() => {
                    this.setState({ isVisible: false });
                });
        }
    };

    _getCurrentRouteName(navState) {
        if (Object.prototype.hasOwnProperty.call(navState, 'index')) {
            this._getCurrentRouteName(navState.routes[navState.index]);
        } else {
            DrawerServices.setHistoryScreen(navState.routeName);
        }
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    async componentDidMount() {
        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Sys_Helpdesk_PortalApp'] &&
            PermissionForAppMobile.value['New_Sys_Helpdesk_PortalApp']['View']
        ) {
            this.getHelpdesk();
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Sys_ChangePassword_Salary_PortalApp'] &&
            PermissionForAppMobile.value['New_Sys_ChangePassword_Salary_PortalApp']['View']
        ) {
            this.checkConfigOnChangePassWordSalary();
        }

        //#region Check touchID supported
        AppState.addEventListener('change', this._handleAppStateChange);
        const optionalConfigObject = {
            unifiedErrors: false,
            passcodeFallback: true
        };
        TouchID.isSupported(optionalConfigObject)
            .then((biometryType) => {
                this.setupData();
                this.setState({
                    isTouchID: biometryType === 'FaceID' ? 'FaceID' : 'TouchID',
                    isVisible: true
                });
            })
            .catch(() => {
                this.setState({ isVisible: false });
            });
        //#endregion
    }

    checkConfigOnChangePassWordSalary = () => {
        HttpService.Get('[URI_SYS]/Sys_GetData/GetConfigConfirmPasswordPayslip').then((res) => {
            if (res && res == 'E_PAYSLIP') {
                this.setState({
                    isVisibleChangePassSal: true
                });
            }
        });
    };

    //#region [Helpdesk]
    getHelpdesk = () => {
        const { dataHelpdesk } = this.state;
        this.setState({
            dataHelpdesk: {
                ...dataHelpdesk,
                isLoading: true,
                data: null
            }
        });

        HttpService.Get('[URI_HR]/Tas_GetData/GetListConfigHotline').then((res) => {
            let data = null;
            if (res && res.Data && res.Data.length > 0) {
                data = res.Data;
            }

            this.setState({
                dataHelpdesk: {
                    ...dataHelpdesk,
                    isLoading: false,
                    data: data
                }
            });
        });
    };

    showModalHelpdesk = () => {
        const { dataHelpdesk } = this.state;
        if (dataHelpdesk.data != null) {
            this.setState({
                dataHelpdesk: {
                    ...dataHelpdesk,
                    isVisibleModal: true
                }
            });
        } else {
            ToasterSevice.showError('EmptyData');
            return;
        }
    };

    hideModalHelpdesk = () => {
        const { dataHelpdesk } = this.state;
        this.setState({
            dataHelpdesk: {
                ...dataHelpdesk,
                isVisibleModal: false
            }
        });
    };

    iconTypeHelp = (type) => {
        if (type == 'E_Email') {
            return <IconMail size={Size.iconSize - 2} color={Colors.gray_10} />;
        } else if (type == 'E_Phone') {
            return <IconPhone size={Size.iconSize - 2} color={Colors.gray_10} />;
        } else {
            return <IconInfo size={Size.iconSize - 2} color={Colors.gray_10} />;
        }
    };

    actionsHelp = (item) => {
        if (item.TypeIcon == 'E_Email') {
            Vnr_Function.openLink(`mailto:${item.DataHotline}`);
        } else if (item.TypeIcon == 'E_Phone') {
            Vnr_Function.openLink(`tel:${item.DataHotline}`);
        } else {
            return;
        }
    };

    viewListItemHelpdesk = () => {
        const { dataHelpdesk } = this.state;
        if (dataHelpdesk.data && dataHelpdesk.data.length > 0) {
            return dataHelpdesk.data.map((item, index) => {
                return (
                    <TouchableOpacity key={index} style={styles.bnt_action} onPress={() => this.actionsHelp(item)}>
                        <View style={styles.bnt_action__left}>
                            <View style={styles.bnt_action__IconLeft}>{this.iconTypeHelp(item.TypeIcon)}</View>
                            <VnrText style={[styleSheets.text, styles.bnt_action__text]} value={item.DataHotline} />
                        </View>
                    </TouchableOpacity>
                );
            });
        }
    };

    //#endregion

    checkVersionCodePush = () => {
        const { thisVersion } = this.state;
        if (thisVersion == '') {
            // gọi hàm cập nhật version
            UpdateVersionApi.checkVersion(true);
            CodePush.getUpdateMetadata().then((metadata) => {
                this.setState({
                    thisVersion: metadata.label,
                    isLoadingCheckVer: false
                });
            });
        } else {
            this.setState({
                thisVersion: '',
                isLoadingCheckVer: false
            });
        }
    };

    setEnabled = (enabled) => {
        this.setState({ isEnabled: enabled });
    };

    openTouchID = async () => {
        if (dataVnrStorage.currentUser.info && dataVnrStorage.currentUser.info.isLoginSSO) {
            TouchIDService.openTouchID(this.setEnabled.bind(this));
        } else {
            try {
                let message;
                const configs = {
                    title: translate('HRM_Authentication_Required'), // Android
                    imageColor: Colors.primary, // Android
                    imageErrorColor: Colors.red, // Android
                    sensorDescription: translate('HRM_Login_TouchID'), // Android
                    sensorErrorDescription: translate('HRM_Login_TouchID_Failed'), // Android
                    cancelText: translate('HRM_Login_TouchID_Cancel'), // Android
                    fallbackLabel: '', // iOS (if empty, then label is hidden)
                    unifiedErrors: false, // use unified error messages (default false)
                    passcodeFallback: false // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
                };
                const type = await TouchID.isSupported();
                switch (type) {
                    case 'TouchID':
                        message = '';

                        break;
                    case 'FaceID':
                        message = '';

                        break;
                }
                if (type) {
                    TouchID.authenticate(message, configs)
                        .then(() => {
                            AlertSevice.alert({
                                iconType: EnumIcon.E_KEY,
                                placeholder: translate('HRM_System_User_Password'),
                                isValidInputText: true,
                                title: translate('Hrm_Portal_Login_Enter_Password'),
                                isInputText: true,
                                autoFocus: true,
                                typeInputText: 'E_PASSWORD',
                                onConfirm: (valueText) => {
                                    // kiểm tra password
                                    this.confirmPassWord(valueText);
                                }
                            });
                        })
                        .catch(() => {
                            ToasterSevice.showError('HRM_Authentication_Failed', 7000);
                            // AlertSevice.alert({
                            //   iconType: EnumIcon.E_DEFAULT,
                            //   title: translate(EnumName.E_CANCEL),
                            //   message: translate('HRM_Login_Bio_Cancel'),
                            // })
                        });
                }
            } catch (err) {
                // ToasterSevice.showInfo(translate('HRM_Open_Setting_TouchID'), 7000)
            }
        }
    };

    removeTouchID = async () => {
        if (dataVnrStorage.currentUser.info && dataVnrStorage.currentUser.info.isLoginSSO) {
            TouchIDService.removeTouchID(this.setEnabled.bind(this));
        } else {
            AlertSevice.alert({
                iconType: EnumIcon.E_INFO,
                title: translate(EnumName.E_CANCEL),
                message: translate('HRM_Login_Bio_Cancel'),
                textRightButton: translate(EnumName.E_CANCEL),
                onBackDrop: () => {},
                onCancel: () => {},
                onConfirm: () => {
                    this.setState(
                        {
                            isEnabled: false
                        },
                        async () => {
                            const data = await SInfoService.getItem(EnumUser.DATASAVEID);
                            const appendData = data.map((m) => ({
                                ...m,
                                touchID: null
                            }));
                            await SInfoService.setItem(EnumUser.DATASAVEID, appendData);
                        }
                    );
                }
            });
        }
    };

    confirmPassWord = async (passWord) => {
        if (dataVnrStorage.currentUser) {
            const dataBody = {
                UserName: dataVnrStorage.currentUser.headers.userlogin,
                Password: passWord,
                UserID: dataVnrStorage.currentUser.headers.userid
            };
            VnrLoadingSevices.show();
            const res = await HttpService.Post('[URI_HR]/Por_GetData/LoginAppMobile', dataBody);
            VnrLoadingSevices.hide();

            if (res != undefined && res != null) {
                if (res.LoginStatus) {
                    const data = (await SInfoService.getItem(EnumUser.DATASAVEID)) || [];
                    // // lần đầu tiên, chưa đăng kí nên null, cho giá trị là mảng rỗng

                    const { userid, userlogin } = dataVnrStorage.currentUser.headers;

                    const existedUser = data?.find((d) => d[EnumUser.USERID] === userid);

                    let target = existedUser;

                    if (existedUser) {
                        target[EnumUser.TOUCHID] = DeviceInfo.getUniqueId();

                        const dataChanged = data.map((m) => ({
                            ...m,
                            touchID: m.userid === userid ? target.touchID : null
                        })); //**************** */

                        await SInfoService.setItem(EnumUser.DATASAVEID, dataChanged);
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        this.setState({
                            isEnabled: true
                        });
                    } else {
                        // laàn đầu : mảng rỗng => append : rỗng
                        target = {};
                        target[EnumUser.USERID] = userid;
                        target[EnumUser.USERNAME] = userlogin;
                        target[EnumUser.TOUCHID] = DeviceInfo.getUniqueId();
                        target[EnumUser.PASSWORD] = passWord;
                        const appendData = data.map((m) => ({ ...m, touchID: null })); // lần đầu rỗng

                        await SInfoService.setItem(EnumUser.DATASAVEID, [...appendData, target]);
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        this.setState({
                            isEnabled: true
                        });
                    }
                } else {
                    AlertSevice.alert({
                        iconType: EnumIcon.E_KEY,
                        placeholder: translate('HRM_System_User_Password'),
                        isValidInputText: true,
                        title: translate('Hrm_Portal_Login_Enter_Password'),
                        message: res.LoginErrorStatusMessage,
                        isInputText: true,
                        autoFocus: true,
                        typeInputText: 'E_PASSWORD',
                        onBackDrop: () => {},
                        onCancel: () => {
                            this.setState({
                                isEnabled: false
                            });
                        },
                        onConfirm: (valueText) => {
                            this.setState({
                                isEnabled: false
                            });
                            this.confirmPassWord(valueText);
                        }
                    });
                }
            } else {
                DrawerServices.goBack();
            }
        }
    };

    setLanguage = (language) => {
        if (language == dataVnrStorage.languageApp) {
            return;
        }
        VnrLoadingSevices.show();

        dataVnrStorage.languageApp = language;
        dataVnrStorage.currentUser.headers.languagecode = language;
        setdataVnrStorage(dataVnrStorage);

        //update
        HttpService.Post('[URI_HR]/Por_GetData/ChangeLanguage', {
            LanguageValue: language,
            UserCreateID: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.userid : null,
            UserLogin: dataVnrStorage.currentUser.headers.userlogin
        }).then(() => {
            HttpService.Get(`[URI_POR]/Portal/GetLangMobile?langcode=${dataVnrStorage.languageApp}`).then(
                (dataLang) => {
                    this.savedDataLocalLang(language, dataLang);
                }
            );
        });
    };

    savedDataLocalLang = async (language, dataLang) => {
        const dataListLocal = await getDataLocal(EnumTask.KT_Permission_RequestDataConfig),
            dataConfigLocal = dataListLocal ? dataListLocal[EnumName.E_PRIMARY_DATA] : null;
        const { setLanguage } = this.props;

        dataConfigLocal[2] = dataLang;
        await saveDataLocal(EnumTask.KT_Permission_RequestDataConfig, {
            [EnumName.E_PRIMARY_DATA]: dataConfigLocal
        });

        setLanguage(language);
        setDataLang(dataLang, dataVnrStorage.languageApp);

        VnrLoadingSevices.hide();
        this.router('Permission');
    };

    router = (roouterName, params) => {
        const { navigation } = this.props;
        navigation.navigate(roouterName, params);
    };

    handelOnpress = (item) => {
        const { screenName, type, callBack } = item;
        if (type == 'E_SCREEN' && screenName) {
            this.router(screenName);
        } else if (type == 'E_ONPRESS') {
            callBack && typeof callBack === 'function' && callBack();
        } else if (type == 'E_LOGOUT') {
            logout();
        }
    };

    // handleAlignOptions = (isSelectedAlignLeft) => {
    //     const { isAlignLeft } = this.state;
    //     if (isSelectedAlignLeft && isAlignLeft) {
    //         return;
    //     } else if (!isSelectedAlignLeft && !isAlignLeft) {
    //         return;
    //     } else {
    //         this.setState(
    //             {
    //                 isAlignLeft: !isAlignLeft
    //             },
    //             () => {
    //                 this.saveConfigLocalAlign();
    //             }
    //         );
    //     }
    // };

    // saveConfigLocalAlign = async () => {
    //     const res = await getDataLocal(EnumTask.KT_Permission_RequestDataConfig);
    //     const getDataConfig = res && res[EnumName.E_PRIMARY_DATA] ? res[EnumName.E_PRIMARY_DATA] : null;
    //     let { isAlignLeft } = this.state

    //     if (getDataConfig && getDataConfig != null) {
    //         //config list, fields
    //         if (getDataConfig[0]) {
    //             const configApp = getDataConfig[0];
    //             configApp[7] = isAlignLeft ? 'E_LEFT_LAYOUT' : 'E_ALIGN_LAYOUT'
    //         }
    //         await saveDataLocal(EnumTask.KT_Permission_RequestDataConfig, {
    //             [EnumName.E_PRIMARY_DATA]: getDataConfig
    //         });
    //     }
    // };

    render() {
        const {
                thisVersion,
                isLoadingCheckVer,
                isEnabled,
                isTouchID,
                dataHelpdesk,
                isVisibleChangePassSal,
                isAlignLeft
            } = this.state,
            urlIcon =
                dataVnrStorage.currentUser && dataVnrStorage.currentUser.info
                    ? dataVnrStorage.currentUser.info.ImagePath
                    : '',
            { language } = this.props,
            userName =
                dataVnrStorage.currentUser && dataVnrStorage.currentUser.info
                    ? dataVnrStorage.currentUser.info.FullName
                    : '';

        return (
            <SafeAreaView {...styleSafeAreaView} style={styles.container}>
                {/*
        {thisVersion != '' && (
          <ModalUpdateVersion isFromSetting={true} />
        )} */}
                <View style={styles.ContentAvatarUser}>
                    <View style={styles.viewAvatar}>
                        <View style={styles.avatar}>
                            <Image source={{ uri: urlIcon }} style={styles.imgAvatar} />
                        </View>
                    </View>

                    <View style={styles.viewInfo}>
                        <View style={styleSheets.viewLable}>
                            <VnrText style={[styleSheets.textFontMedium, styles.textLableInfo]} i18nKey={userName} />
                        </View>
                        {PermissionForAppMobile &&
                            PermissionForAppMobile.value['Personal_GeneralProfileDetail_btnUpdateBasic_Portal'] &&
                            PermissionForAppMobile.value['Personal_GeneralProfileDetail_btnUpdateBasic_Portal'][
                                'View'
                            ] && (
                            <View style={styleSheets.viewControl}>
                                <TouchableOpacity
                                    style={styles.bnt_profile}
                                    onPress={() => DrawerServices.navigateForVersion('ProfileInfo')}
                                >
                                    <VnrText
                                        style={[styleSheets.textFontMedium, styles.bnt_profile__text]}
                                        i18nKey={'E_MODIFYING'}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>

                {/* ChangePassword */}
                <TouchableOpacity
                    style={styles.bnt_action}
                    onPress={() => {
                        if (dataVnrStorage.isNewLayoutV3) {
                            this.router('ChangePasswordV3', { setupData : this.setupData });
                        } else {
                            this.router('ChangePassword', { setupData : this.setupData });
                        }
                    }}
                >
                    <View style={styles.bnt_action__left}>
                        <View style={styles.bnt_action__IconLeft}>
                            <IconLock size={Size.iconSize - 2} color={Colors.gray_10} />
                        </View>
                        <VnrText
                            style={[styleSheets.text, styles.bnt_action__text]}
                            i18nKey={'HRM_System_User_ChangePass'}
                        />
                    </View>
                    <IconNext size={Size.iconSize} color={Colors.gray_5} />
                </TouchableOpacity>

                {/* 0155183: [Portal_Hotfix PMC_v8.10.32.01.12 ]Thêm chức năng đổi mật khẩu xem lương lần đầu tiên/Cấu hình sử dụng mất khẩu Azure để xem	 */}
                {isVisibleChangePassSal && (
                    <TouchableOpacity
                        style={styles.bnt_action}
                        onPress={() => {
                            if (dataVnrStorage.isNewLayoutV3) {
                                this.router('SalChangePasswordV3');
                            } else {
                                this.router('SalChangePassword');
                            }
                        }}
                    >
                        <View style={styles.bnt_action__left}>
                            <View style={styles.bnt_action__IconLeft}>
                                <IconLock size={Size.iconSize - 2} color={Colors.gray_10} />
                            </View>
                            <VnrText
                                style={[styleSheets.text, styles.bnt_action__text]}
                                i18nKey={'HRM_System_ConfirmChangePasswordPayslip'}
                            />
                        </View>
                        <IconNext size={Size.iconSize} color={Colors.gray_5} />
                    </TouchableOpacity>
                )}

                {/* AppendixInfomation - Hướng dẫn sử dụng phần mềm */}
                {PermissionForAppMobile &&
                    PermissionForAppMobile.value['New_AppendixInformation_New_Index'] &&
                    PermissionForAppMobile.value['New_AppendixInformation_New_Index']['View'] && (
                    <TouchableOpacity style={styles.bnt_action} onPress={() => this.router('AppendixInfomation')}>
                        <View style={styles.bnt_action__left}>
                            <View style={styles.bnt_action__IconLeft}>
                                <IconConfirm size={Size.iconSize - 2} color={Colors.gray_10} />
                            </View>
                            <VnrText
                                style={[styleSheets.text, styles.bnt_action__text]}
                                i18nKey={'HRM_Menu_AppendixInfomationView_PopUp_Name'}
                            />
                        </View>
                        <IconNext size={Size.iconSize} color={Colors.gray_5} />
                    </TouchableOpacity>
                )}

                {/* Helpdesk - Thông tin hỗ trợ */}
                {PermissionForAppMobile &&
                    PermissionForAppMobile.value['New_Sys_Helpdesk_PortalApp'] &&
                    PermissionForAppMobile.value['New_Sys_Helpdesk_PortalApp']['View'] && (
                    <TouchableOpacity style={styles.bnt_action} onPress={() => this.showModalHelpdesk()}>
                        <View style={styles.bnt_action__left}>
                            <View style={styles.bnt_action__IconLeft}>
                                <IconContacts size={Size.iconSize - 2} color={Colors.gray_10} />
                            </View>
                            <VnrText
                                style={[styleSheets.text, styles.bnt_action__text]}
                                i18nKey={'HRM_PortalApp_Setting_Helpdesk'}
                            />
                        </View>

                        {dataHelpdesk.isLoading ? (
                            <VnrLoading size="small" color={Colors.primary} style={{}} />
                        ) : (
                            <IconNext size={Size.iconSize} color={Colors.gray_5} />
                        )}
                    </TouchableOpacity>
                )}

                {/* Notification */}
                {/* <TouchableOpacity
          style={styles.bnt_action}
          onPress={() => this.router('SettingNotification')}>
          <View style={styles.bnt_action__left}>
            <View style={styles.bnt_action__IconLeft}>
              <IconNotify size={Size.iconSize - 2} color={Colors.gray_10} />
            </View>
            <VnrText
              style={[styleSheets.text, styles.bnt_action__text]}
              i18nKey={'Hrm_Notification'}
            />
          </View>
          <IconNext size={Size.iconSize} color={Colors.gray_5} />
        </TouchableOpacity> */}

                {/* Check version */}
                <TouchableOpacity style={styles.bnt_action} onPress={this.checkVersionCodePush}>
                    <View style={styles.bnt_action__left}>
                        <View style={styles.bnt_action__IconLeft}>
                            {Platform.OS == 'ios' ? (
                                <IconAppStore size={Size.iconSize - 2} color={Colors.gray_10} />
                            ) : (
                                <IconAndroid size={Size.iconSize - 2} color={Colors.gray_10} />
                            )}
                        </View>
                        <VnrText
                            style={[styleSheets.text, styles.bnt_action__text]}
                            i18nKey={'HRM_Title_Check_Version'}
                        />
                    </View>
                    {isLoadingCheckVer ? (
                        <VnrLoading size="small" style={{}} />
                    ) : (
                        <Text style={[styleSheets.text]}>{thisVersion}</Text>
                    )}
                </TouchableOpacity>

                {/* van tay */}
                <View style={styles.bnt_action}>
                    <View style={styles.bnt_action__left}>
                        <View style={[styles.bnt_action__IconLeft]}>
                            <Image
                                source={isTouchID === 'TouchID' ? require(sourceTouchID) : require(sourceFaceID)}
                                style={styles.styIconLeft}
                            />
                        </View>
                        {isTouchID === 'TouchID' ? (
                            <VnrText
                                style={[styleSheets.text, styles.bnt_action__text]}
                                i18nKey={'HRM_Login_TouchID'}
                            />
                        ) : (
                            <VnrText style={[styleSheets.text, styles.bnt_action__text]} i18nKey={'HRM_Login_FaceID'} />
                        )}
                    </View>
                    <View style={styles.bnt_action__right}>
                        <Switch
                            trackColor={{ false: Colors.gray_5, true: Colors.primary }}
                            thumbColor={Colors.white}
                            ios_backgroundColor={Colors.gray_5}
                            onValueChange={isEnabled ? () => this.removeTouchID() : () => this.openTouchID()}
                            value={isEnabled}
                        />
                    </View>
                </View>

                {/* <View style={styles.bnt_action}>
                    <TouchableOpacity
                        onPress={() => this.handleAlignOptions(true)}
                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Text style={[styleSheets.text, styles.bnt_action__text, { marginRight: 5 }]}>Căn trái</Text>
                        <View>
                            <View
                                style={[
                                    {
                                        borderWidth: 1.5,
                                        width: 15,
                                        height: 15,
                                        borderColor: isAlignLeft ? Colors.primary : Colors.gray_10,
                                        borderRadius: 100,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }
                                ]}
                            >
                                {isAlignLeft && (
                                    <View
                                        style={{
                                            borderWidth: 1.5,
                                            borderColor: Colors.primary,
                                            width: 10,
                                            height: 10,
                                            borderRadius: 100,
                                            backgroundColor: Colors.primary
                                        }}
                                    />
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.handleAlignOptions(false)}
                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Text style={[styleSheets.text, styles.bnt_action__text, { marginRight: 5 }]}>Căn đều</Text>
                        <View>
                            <View
                                style={[
                                    {
                                        borderWidth: 1.5,
                                        width: 15,
                                        height: 15,
                                        borderColor: !isAlignLeft ? Colors.primary : Colors.gray_10,
                                        borderRadius: 100,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }
                                ]}
                            >
                                {!isAlignLeft && (
                                    <View
                                        style={{
                                            borderWidth: 1.5,
                                            borderColor: Colors.primary,
                                            width: 10,
                                            height: 10,
                                            borderRadius: 100,
                                            backgroundColor: Colors.primary
                                        }}
                                    />
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                </View> */}

                {/* Feedback */}
                <TouchableOpacity
                    style={styles.bnt_action}
                    onPress={() => {
                        DrawerServices.navigate('Feedback');
                    }}
                >
                    <View style={styles.bnt_action__left}>
                        <View style={[styles.bnt_action__IconLeft, styles.bnt_action__marginLeft]}>
                            <IconFeedback size={Size.iconSize - 3} color={Colors.gray_10} />
                        </View>
                        <VnrText
                            style={[styleSheets.text, styles.bnt_action__text]}
                            i18nKey={'HRM_PortalApp_Feedback_SendFeedback'}
                        />
                    </View>
                </TouchableOpacity>

                {/* Cài đặt hình ảnh (Face scan) */}
                {/* <TouchableOpacity
          style={styles.bnt_action}
          onPress={() => {
            DrawerServices.navigate('FaceScanSetting');
          }}>
          <View style={styles.bnt_action__left}>
            <View style={[styles.bnt_action__IconLeft, { marginLeft: -3 }]}>
              <IconScan size={Size.iconSize - 3} color={Colors.gray_10} />
            </View>
            <VnrText
              style={[styleSheets.text, styles.bnt_action__text]}
              i18nKey={'HRM_PortalApp_ScanSetting_face'}
            />
          </View>
        </TouchableOpacity> */}

                {/* Logout */}
                <TouchableOpacity style={styles.bnt_action} onPress={() => logout()}>
                    <View style={styles.bnt_action__left}>
                        <View style={[styles.bnt_action__IconLeft, styles.bnt_action__marginLeft]}>
                            <IconLogout size={Size.iconSize - 3} color={Colors.gray_10} />
                        </View>
                        <VnrText style={[styleSheets.text, styles.bnt_action__text]} i18nKey={'Logout'} />
                    </View>
                </TouchableOpacity>

                {/* {listAction.map(item => {
          return (
            <TouchableOpacity
              style={styles.bnt_action}
              onPress={() => this.handelOnpress(item)}>
              <View style={styles.bnt_action__left}>
                {item.IconLeft}
                <VnrText
                  style={[styleSheets.text, styles.bnt_action__text]}
                  i18nKey={item.title}
                />
              </View>
              {item.IconRight}
            </TouchableOpacity>
          );
        })} */}

                <View style={styles.viewlang}>
                    {dataVnrStorage.useLanguage &&
                        dataVnrStorage.useLanguage.split(',').map((lang, index) => (
                            <TouchableOpacity
                                accessibilityLabel={`CHANGE-${lang}`}
                                key={index}
                                onPress={() => this.setLanguage(lang)}
                                style={[
                                    index == dataVnrStorage.useLanguage.split(',').length - 1
                                        ? styles.bnt_Changelang__Right
                                        : styles.bnt_Changelang__left,
                                    language === lang ? styles.bnt_Changelang__active : styles.bnt_Changelang__inactive
                                ]}
                            >
                                <VnrText
                                    style={[
                                        styleSheets.text,
                                        language === lang
                                            ? styles.bnt_Changelang___textActive
                                            : styles.bnt_Changelang___textInactive
                                    ]}
                                    i18nKey={lang}
                                />
                            </TouchableOpacity>
                        ))}

                    {/* <TouchableOpacity
            onPress={() => this.setLanguage('EN')}
            style={[
              styles.bnt_Changelang__Right,
              language === 'EN'
                ? styles.bnt_Changelang__active
                : styles.bnt_Changelang__inactive,
            ]}>
            <VnrText
              style={[
                styleSheets.text,
                language === 'EN'
                  ? styles.bnt_Changelang___textActive
                  : styles.bnt_Changelang___textInactive,
              ]}
              i18nKey={'English'}
            />
          </TouchableOpacity> */}
                </View>

                <Modal
                    onBackButtonPress={() => this.hideModalHelpdesk()}
                    isVisible={dataHelpdesk.isVisibleModal}
                    onBackdropPress={() => this.hideModalHelpdesk()}
                    customBackdrop={
                        <TouchableWithoutFeedback onPress={() => this.hideModalHelpdesk()}>
                            <View style={styles.styModalHelp} />
                        </TouchableWithoutFeedback>
                    }
                    style={styles.stybtnModalHelp}
                >
                    <View style={[stylesModalPopupBottom.viewModalTime, { height: Size.deviceheight * 0.8 }]}>
                        <SafeAreaView {...styleSafeAreaView} style={stylesModalPopupBottom.safeRadius}>
                            <View style={stylesModalPopupBottom.headerCloseModal}>
                                <IconColse color={Colors.white} size={Size.iconSize} />
                                <VnrText
                                    style={styleSheets.headerTitleStyle}
                                    i18nKey={'HRM_PortalApp_Setting_Helpdesk'}
                                />
                                <TouchableOpacity onPress={() => this.hideModalHelpdesk()}>
                                    <IconCancel color={Colors.black} size={Size.iconSize} />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={[stylesModalPopupBottom.scrollViewError]}>
                                {this.viewListItemHelpdesk()}
                            </ScrollView>
                        </SafeAreaView>
                    </View>
                </Modal>
            </SafeAreaView>
        );
    }
}

const HIGHT_AVATAR = Size.deviceWidth >= 1024 ? 80 : Size.deviceWidth * 0.17;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: Size.deviceheight * 0.075,
        paddingHorizontal: 16,
        backgroundColor: Colors.white
    },
    viewInfo: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 10
    },
    bnt_profile__text: {
        color: Colors.white,
        fontWeight: '500'
    },
    styModalHelp: {
        margin: 0
    },
    stybtnModalHelp: {
        flex: 1,
        backgroundColor: Colors.black,
        opacity: 0.8
    },
    ContentAvatarUser: {
        paddingVertical: 12,
        flexDirection: 'row',
        backgroundColor: Colors.white,
        alignItems: 'center',
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    },
    viewAvatar: {},
    avatar: {
        height: HIGHT_AVATAR,
        width: HIGHT_AVATAR,
        backgroundColor: Colors.borderColor,
        borderRadius: 18 //HIGHT_AVATAR / 3,
    },
    imgAvatar: {
        height: HIGHT_AVATAR,
        width: HIGHT_AVATAR,

        borderRadius: 18 // HIGHT_AVATAR / 3,
    },
    textLableInfo: {
        fontSize: Size.text,
        color: Colors.gray_10,
        fontWeight: '500'
    },
    bnt_profile: {
        backgroundColor: Colors.primary,
        height: 37,
        borderRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: 15
    },
    bnt_action: {
        flexDirection: 'row',
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        justifyContent: 'space-between',
        height: Size.deviceWidth * 0.13,
        maxHeight: 70,
        minHeight: 40,
        alignItems: 'center'
    },
    bnt_action__left: {
        flexDirection: 'row',
        height: '100%',
        alignItems: 'center'
    },
    bnt_action__text: {
        // paddingHorizontal: 5,
    },
    bnt_action__IconLeft: {
        width: Size.iconSize + 12
    },
    bnt_action__marginLeft: {
        marginLeft: -3
    },
    viewlang: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        marginTop: 30,
        paddingHorizontal: 15
    },
    bnt_Changelang___textActive: {
        color: Colors.primary,
        fontWeight: '500'
    },
    bnt_Changelang___textInactive: {
        color: Colors.gray_10,
        fontWeight: '500'
    },
    bnt_Changelang__active: {
        borderColor: Colors.primary,
        backgroundColor: Colors.white
    },
    bnt_Changelang__inactive: {
        borderColor: Colors.gray_3,
        backgroundColor: Colors.gray_3
    },
    bnt_Changelang__left: {
        flex: 1,
        borderWidth: 1,
        height: Size.deviceWidth * 0.13,
        maxHeight: 70,
        minHeight: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 8
    },
    bnt_Changelang__Right: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.primary,
        height: Size.deviceWidth * 0.13,
        maxHeight: 70,
        minHeight: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        borderRadius: 8
    },
    styIconLeft: {
        width: Size.iconSize - 3,
        height: Size.iconSize - 3
    }
});

const mapStateToProps = (state) => {
    return {
        language: state.languageReducer.language,
        generalProfileInfo: state.generalProfileInfo.data
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setLanguage: (language) => {
            dispatch(languageReducer.actions.changeLanguage(language));
        },
        fetchGeneralProfileInfo: () => {
            dispatch(generalProfileInfo.actions.fetchGeneralProfileInfo());
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Setting);
