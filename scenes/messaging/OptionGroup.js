import React, { Component } from 'react';
import { Image, View, TouchableOpacity, StyleSheet, Keyboard, Switch } from 'react-native';
import { Colors, Size, styleSheets, styleSafeAreaView, stylesListPickerControl } from '../../constants/styleConfig';
import DrawerServices from '../../utils/DrawerServices';
import { dataVnrStorage, updateTopNavigate } from '../../assets/auth/authentication';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
    IconPlus,
    IconNotify,
    IconUserPlus,
    IconImage,
    IconNext,
    IconLogout,
    IconChat,
    IconDelete
} from '../../constants/Icons';
import VnrTextInput from '../../components/VnrTextInput/VnrTextInput';
import VnrText from '../../components/VnrText/VnrText';
import { translate } from '../../i18n/translate';
import { SafeAreaView } from 'react-navigation';
import MessagingListMemberGroup from './messagingListMemberGroup/MessagingListMemberGroup';
import { ScreenName, EnumName, EnumIcon } from '../../assets/constant';
import ImagePicker from 'react-native-image-picker';
import { ToasterSevice } from '../../components/Toaster/Toaster';
import { AlertSevice } from '../../components/Alert/Alert';
import HttpService from '../../utils/HttpService';
import { VnrLoadingSevices } from '../../components/VnrLoading/VnrLoadingPages';
import { ConfigVersionBuild } from '../../assets/configProject/ConfigVersionBuild';

export default class OptionGroup extends Component {
    constructor(props) {
        super(props);

        const { dataAgent, dataItem, dataStatus } = props.navigation.state.params;
        this.itemGroup = dataItem;
        this.sheetActionsStatus = dataStatus;
        this.dataAgent = dataAgent;
        const dataMember = this.compareStatus(dataAgent, this.itemGroup.ListUser);
        this.chatEndpointApi = dataVnrStorage.apiConfig.chatEndpointApi;
        this.userid = dataVnrStorage.currentUser.headers.userid;
        this.state = {
            GroupName: this.itemGroup.NameView,
            GroupReName: this.itemGroup.NameView,
            listMember: [...dataMember],

            // Tính năng này có từ build 30 trở lên
            isActiveNew32: parseInt(ConfigVersionBuild.value) > parseInt('081030'),
            isSwichIsAllUserChat: dataItem.IsAllUserChat,
            isSwichNotify: dataItem.IsNotify,
            sourceAvatar: {
                dataReview: this.itemGroup.Image
            },
            isRefreshListMember: false
        };
    }

    compareStatus(arrAgent, listMember) {
        return listMember.map(item => {
            item = {
                ...item,
                StatusConfig: item.Status
            };
            let findAgent = arrAgent.find(itemAgent => itemAgent.userID == item.UserID);

            if (findAgent && findAgent.socketIDs.length) {
                //có socketID => set Status ONLINE
                let objSttOnline = this.sheetActionsStatus.find(itemStt => itemStt.value == 'E_ON'),
                    objStatus = objSttOnline;

                //check User có cấu hình Status
                if (item.StatusConfig) {
                    //set lại Status theo cấu hình user
                    objStatus = this.sheetActionsStatus.find(itemStt => itemStt.value == item.StatusConfig);

                    //k có thì set mặc định OFF
                    if (!objStatus) {
                        objStatus = objSttOnline;
                    }
                }

                item = {
                    ...item,
                    Status: objStatus
                };
            } else {
                let objSttOffline = this.sheetActionsStatus.find(itemStt => itemStt.value == 'E_OFF');
                item = {
                    ...item,
                    Status: objSttOffline
                };
            }

            return item;
        });
    }

    reloadListMember = (dataItem, listUserSelect) => {
        this.itemGroup = dataItem;

        const { getListTopic, addUserToGroup } = this.props.navigation.state.params,
            dataMember = this.compareStatus(this.dataAgent, [...dataItem.ListUser]),
            { isActiveNew32 } = this.state;

        this.setState({ listMember: [...dataMember], isRefreshListMember: !this.state.isRefreshListMember });

        this.itemGroup = {
            ...this.itemGroup,
            ListUser: [...dataMember]
        };

        if (addUserToGroup && typeof addUserToGroup === 'function' && isActiveNew32) {
            addUserToGroup(listUserSelect);
        }
    };

    router = (roouterName, params) => {
        const { navigation } = this.props;
        navigation.navigate(roouterName, params);
    };

    onChangeTextName = textValue => {
        this.setState({ GroupReName: textValue }, () => {
            if (textValue !== '' && this.itemGroup.NameView !== textValue) {
                this.showButtonRightHeader();
            } else {
                this.hideButtonRightHeader();
            }
        });
    };

    hideButtonRightHeader = () => {
        this.props.navigation.setParams({
            headerRight: null
        });
    };

    showButtonRightHeader = () => {
        this.props.navigation.setParams({
            headerRight: (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => this.saveGroupInfo()} style={{ flex: 1 }}>
                        <View style={stylesListPickerControl.headerButtonStyle}>
                            <VnrText
                                i18nKey={'HRM_Common_Save'}
                                style={[styleSheets.lable, styles.headerTitleCancel]}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            )
        });
    };

    saveGroupInfo = () => {
        const { GroupReName, sourceAvatar } = this.state,
            { getListTopic, updateNameApp } = this.props.navigation.state.params;
        let listRequest = [];

        if (sourceAvatar != null) {
            listRequest.push(
                HttpService.Post(`${this.chatEndpointApi}/restapi/chat/uploadImageGroupBase64`, {
                    base64String: sourceAvatar.data,
                    topicID: this.itemGroup.TopicID,
                    contentType: sourceAvatar.type
                })
            );
        }

        if (GroupReName !== '' && this.itemGroup.NameView !== GroupReName) {
            listRequest.push(
                HttpService.Post(`${this.chatEndpointApi}/restapi/chat/RenameTopic`, {
                    TopicID: this.itemGroup.TopicID,
                    TopicName: GroupReName
                })
            );
        }

        VnrLoadingSevices.show();

        if (listRequest.length > 0) {
            HttpService.MultiRequest(listRequest).then(() => {
                this.setState({ GroupName: GroupReName }, () => {
                    VnrLoadingSevices.hide();
                    this.hideButtonRightHeader();
                    Keyboard.dismiss();
                    ToasterSevice.showSuccess('Hrm_Succeed');

                    // cập nhật Name Group
                    if (updateNameApp && typeof updateNameApp === 'function') {
                        updateNameApp(GroupReName);
                    }

                    // reload DS
                    if (getListTopic && typeof getListTopic === 'function') {
                        getListTopic();
                    }

                    DrawerServices.goBack();
                });
            });
        }
    };

    toggleSwitchNotify = () => {
        this.setState(
            {
                isSwichNotify: !this.state.isSwichNotify
            },
            () => {
                const { isSwichNotify } = this.state,
                    { updateEnableNotify } = this.props.navigation.state.params;

                if (updateEnableNotify && typeof updateEnableNotify == 'function') {
                    updateEnableNotify(isSwichNotify);
                }
            }
        );
    };

    toggleSwitchIsAllUserchat = () => {
        this.setState(
            {
                isSwichIsAllUserChat: !this.state.isSwichIsAllUserChat
            },
            () => {
                const { updateIsAllUserChatTopic } = this.props.navigation.state.params,
                    { isSwichIsAllUserChat } = this.state;

                if (updateIsAllUserChatTopic && typeof updateIsAllUserChatTopic == 'function') {
                    updateIsAllUserChatTopic(isSwichIsAllUserChat);
                }
            }
        );
    };

    grantPermission = item => {
        let key = translate('HRM_Title_Alert_Grant_Permission_Group'),
            keyMessage = translate('HRM_Title_Alert_Grant_Permission_Message'),
            keyTranslate = key.replace('[E_NAME]', item.UserInfoName),
            keyTranslateMess = keyMessage.replace('[E_NAME]', item.UserInfoName);

        AlertSevice.alert({
            iconType: EnumIcon.E_APPROVE,
            textLeftButton: 'CANCEL',
            textRightButton: 'Confirm',
            title: keyTranslate,
            message: keyTranslateMess,
            onCancel: () => {},
            onConfirm: () => {
                const { listMember, isRefreshListMember } = this.state;

                let toListUser = listMember.map(el => {
                    if (el.UserID == item.UserID) {
                        el.Permission = 'Admin';
                    } else {
                        el.Permission = 'User';
                    }
                    return el;
                });

                this.setState(
                    {
                        isAdmin: false,
                        listMember: [...toListUser],
                        isRefreshListMember: !isRefreshListMember
                    },
                    () => {
                        const { adminGrantPermission } = this.props.navigation.state.params;
                        if (adminGrantPermission && typeof adminGrantPermission == 'function') {
                            adminGrantPermission(item.UserID, item.UserInfoName);
                        }

                        DrawerServices.goBack();
                    }
                );
            }
        });
    };

    getOutGroupChat = item => {
        AlertSevice.alert({
            iconType: EnumIcon.E_DELETE,
            textLeftButton: 'CANCEL',
            textRightButton: 'HRM_Chat_Action_Kick',
            title: ` ${translate('HRM_Title_Alert_Leave_Group_Confirm')} ${item.UserInfoName} ${translate(
                'HRM_Title_Alert_Leave_Group'
            )}`,
            message: `${translate('HRM_Title_Alert_Leave_Group_Warning')}`,
            onCancel: () => {},
            onConfirm: () => {
                const { listMember, isRefreshListMember } = this.state;

                let toListUser = listMember.filter(n => n.UserID != item.UserID);
                this.setState({ listMember: [...toListUser], isRefreshListMember: !isRefreshListMember }, () => {
                    const { getOutUserGoupChat } = this.props.navigation.state.params;
                    if (getOutUserGoupChat && typeof getOutUserGoupChat == 'function') {
                        getOutUserGoupChat(item.UserID, item.UserInfoName);
                    }
                });
            }
        });
    };

    adminRemoveGroup = () => {
        AlertSevice.alert({
            iconType: EnumIcon.E_DELETE,
            textLeftButton: 'CANCEL',
            textRightButton: 'Confirm',
            message: translate('HRM_Chat_Action_Remove_Group_Message'),
            title: translate('HRM_Chat_Action_Remove_Group_Title'),
            onCancel: () => {},
            onConfirm: () => {
                const { removeGroupChat, getListTopic } = this.props.navigation.state.params;

                if (getListTopic && typeof getListTopic === 'function') {
                    getListTopic();
                }

                if (removeGroupChat && typeof removeGroupChat == 'function') {
                    removeGroupChat();
                }

                DrawerServices.goBack();
            }
        });
    };

    userLoginOutGroup = () => {
        if (this.state.isActiveNew32) {
            AlertSevice.alert({
                iconType: EnumIcon.E_WARNING,
                textRightButton: 'E_AGREE',
                textLeftButton: 'CANCEL',
                title: 'HRM_Chat_Action_Out_Group',
                message: 'HRM_Chat_Action_Out_Group_Message',
                onCancel: () => {},
                onConfirm: () => {
                    const { getOutUserGoupChat, getListTopic } = this.props.navigation.state.params,
                        { userid } = dataVnrStorage.currentUser.headers,
                        { FullName } = dataVnrStorage.currentUser.info;

                    if (getOutUserGoupChat && typeof getOutUserGoupChat == 'function') {
                        getOutUserGoupChat(userid, FullName);
                    }

                    if (getListTopic && typeof getListTopic === 'function') {
                        getListTopic();
                    }

                    DrawerServices.goBack();
                }
            });
        } else {
            AlertSevice.alert({
                iconType: EnumIcon.E_WARNING,
                textRightButton: 'E_AGREE',
                textLeftButton: 'CANCEL',
                title: 'HRM_Chat_Action_Out_Group',
                message: 'HRM_Chat_Action_Out_Group_Message',
                onCancel: () => {},
                onConfirm: () => {
                    const { getListTopic } = this.props.navigation.state.params;
                    HttpService.Post(`${this.chatEndpointApi}/restapi/chat/RemoveUserOffTopic`, {
                        TopicID: this.itemGroup.TopicID,
                        UserID: dataVnrStorage.currentUser.headers.userid
                    });

                    if (getListTopic && typeof getListTopic === 'function') {
                        getListTopic();
                    }

                    DrawerServices.navigate('Messaging');
                }
            });
        }
    };

    handleUnhandledTouches() {
        Keyboard.dismiss();
        return false;
    }

    showPickerImage = () => {
        const options = {
            title: translate('AttachImage'),
            cancelButtonTitle: translate('HRM_Common_Close'),
            takePhotoButtonTitle: translate('Att_TAMScanLog_Camera'),
            chooseFromLibraryButtonTitle: translate('HRM_ChooseFromLibrary'),
            cameraType: 'front',
            mediaType: 'photo',
            // quality: 0.3,
            // maxWidth: 100,
            // width: 100,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                if (response.fileSize && response.fileSize * 0.000001 >= 4) {
                    ToasterSevice.showWarning('HRM_File_Size_Less_4', 50000);
                    return;
                }

                if (response.data != null) {
                    response.dataReview = `data:image/png;base64,${response.data} `;
                }
                this.setState({ sourceAvatar: response }, () => this.showButtonRightHeader());
            }
        });
    };

    componentDidMount() {
        const { NameView, ListUser } = this.itemGroup,
            { isActiveNew32 } = this.state;
        // ListUser[0] =  {
        //   ...ListUser[0],
        //   Permission : 'Admin'
        // }
        // check userLogin có phải admin của nhóm hay không
        let isAdmin = false;
        if (isActiveNew32) {
            let indexAdmin = ListUser.findIndex(item => item.Permission === 'Admin');

            let getItem = indexAdmin > -1 ? ListUser[indexAdmin] : null;

            if (getItem !== null && getItem.UserID === this.userid) {
                isAdmin = true;
            } else {
                isAdmin = false;
            }
        } else {
            isAdmin = true;
        }
        console.log(ListUser, 'ListUser');
        this.setState({
            isAdmin: isAdmin,
            groupName: NameView,
            listMenber: ListUser
        });
    }

    render() {
        const {
            GroupReName,
            isSwichNotify,
            sourceAvatar,
            listMember,
            isRefreshListMember,
            isAdmin,
            isSwichIsAllUserChat,
            isActiveNew32
        } = this.state;

        let _rowActions = [];

        if (isActiveNew32) {
            if (isAdmin) {
                _rowActions = [
                    {
                        title: translate('Ủy quyền trưởng nhóm'),
                        type: EnumName.E_GRANT_PERMISSION,
                        onPress: item => this.grantPermission(item)
                    },
                    {
                        title: translate('Mời ra khỏi nhóm'),
                        type: EnumName.E_DELETE,
                        onPress: item => this.getOutGroupChat(item)
                    }
                ];
            }
        } else {
            _rowActions = [
                {
                    title: translate('HRM_Chat_Action_Kick'),
                    type: EnumName.E_DELETE,
                    onPress: item => this.getOutGroupChat(item)
                }
            ];
        }
        return (
            <SafeAreaView {...styleSafeAreaView} style={[styles.container]}>
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.keyboardContent}
                    extraScrollHeight={20} // khoan cach
                    keyboardShouldPersistTaps={'handled'}
                    bounces={false}
                >
                    <View style={styles.viewUpload}>
                        <TouchableOpacity style={styles.viewUpload_bnt} onPress={() => this.showPickerImage()}>
                            {sourceAvatar != null && sourceAvatar.dataReview != null ? (
                                <Image
                                    // resizeMode={'cover'}
                                    source={{ uri: sourceAvatar.dataReview }}
                                    style={styles.viewUpload_Avatar}
                                />
                            ) : (
                                <IconImage size={Size.iconSizeHeader + 10} color={Colors.gray_10} />
                            )}
                            <View style={styles.viewUpload_iconPlus}>
                                <IconPlus size={Size.iconSizeHeader} color={Colors.primary} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.viewForm}>
                        <View style={styles.viewForm_Input}>
                            <VnrTextInput
                                onClearText={() => this.onChangeTextName('')}
                                placeholder={translate('GroupName')}
                                onChangeText={text => this.onChangeTextName(text)}
                                value={GroupReName}
                                returnKeyType="done"
                                onSubmitEditing={() => {}}
                                style={[styleSheets.text, styles.viewForm_Input__style]}
                            />
                        </View>
                    </View>

                    {/* Add user */}
                    {isAdmin && (
                        <TouchableOpacity
                            onPress={() =>
                                DrawerServices.navigate('AddFriendToGroup', {
                                    AddFriendToGroup: { ...this.itemGroup, ListUser: listMember },
                                    dataStatus: this.sheetActionsStatus,
                                    dataAgent: this.dataAgent,
                                    reloadListMember: this.reloadListMember
                                })
                            }
                            style={styles.bnt_action}
                        >
                            <View style={styles.bnt_action__left}>
                                <View style={[styles.bnt_action__IconLeft, { paddingLeft: 3 }]}>
                                    <IconUserPlus size={Size.iconSize - 2} color={Colors.gray_10} />
                                </View>
                                <View style={styles.bnt_action__content}>
                                    <VnrText
                                        style={[styleSheets.text, styles.bnt_action__text]}
                                        i18nKey={'HRM_Chat_Title_Add_People'}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* Ảnh */}
                    <TouchableOpacity
                        onPress={() => this.router('ImageLibary', { dataItem: this.itemGroup })}
                        style={styles.bnt_action}
                    >
                        <View style={styles.bnt_action__left}>
                            <View style={styles.bnt_action__IconLeft}>
                                <IconImage size={Size.iconSize - 3} color={Colors.gray_10} />
                            </View>
                            <View style={styles.bnt_action__content}>
                                <VnrText
                                    style={[styleSheets.text, styles.bnt_action__text]}
                                    i18nKey={'HRM_Chat_Action_Image'}
                                />
                            </View>
                            <IconNext size={Size.iconSize} color={Colors.gray_5} />
                        </View>
                    </TouchableOpacity>

                    {/* nhan thong bao */}
                    {isActiveNew32 && (
                        <View style={styles.bnt_action}>
                            <View style={styles.bnt_action__left}>
                                <View style={styles.bnt_action__IconLeft}>
                                    <IconNotify size={Size.iconSize} color={Colors.gray_10} />
                                </View>
                                <View style={styles.bnt_action__content}>
                                    <VnrText
                                        style={[styleSheets.text, styles.bnt_action__text]}
                                        i18nKey={'Hrm_Notification'}
                                    />
                                </View>
                                <Switch
                                    trackColor={{ false: Colors.gray_1, true: Colors.primary }}
                                    thumbColor={Colors.white}
                                    ios_backgroundColor={Colors.gray_5}
                                    onValueChange={this.toggleSwitchNotify}
                                    value={isSwichNotify}
                                />
                            </View>
                        </View>
                    )}

                    {isAdmin && isActiveNew32 && (
                        <View style={styles.bnt_action}>
                            <View style={styles.bnt_action__left}>
                                <View style={styles.bnt_action__IconLeft}>
                                    <IconChat size={Size.iconSize} color={Colors.gray_10} />
                                </View>
                                <View style={styles.bnt_action__content}>
                                    <VnrText
                                        style={[styleSheets.text, styles.bnt_action__text]}
                                        i18nKey={'HRM_Chat_Title_AllUserChat'}
                                    />
                                </View>
                                <Switch
                                    trackColor={{ false: Colors.gray_1, true: Colors.primary }}
                                    thumbColor={Colors.white}
                                    ios_backgroundColor={Colors.gray_5}
                                    onValueChange={this.toggleSwitchIsAllUserchat}
                                    value={isSwichIsAllUserChat}
                                />
                            </View>
                        </View>
                    )}

                    {/* rời nhóm */}
                    <TouchableOpacity style={styles.bnt_action} onPress={() => this.userLoginOutGroup()}>
                        <View style={styles.bnt_action__left}>
                            <View style={styles.bnt_action__IconLeft}>
                                <IconLogout size={Size.iconSize - 3} color={Colors.gray_10} />
                            </View>
                            <View style={styles.bnt_action__content}>
                                <VnrText
                                    style={[styleSheets.text, styles.bnt_action__text]}
                                    i18nKey={'HRM_Chat_Action_Out_Group_Title'}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Giải tán nhóm */}
                    {isAdmin && isActiveNew32 && (
                        <TouchableOpacity style={styles.bnt_action} onPress={() => this.adminRemoveGroup()}>
                            <View style={styles.bnt_action__left}>
                                <View style={styles.bnt_action__IconLeft}>
                                    <IconDelete size={Size.iconSize - 3} color={Colors.red} />
                                </View>
                                <View style={styles.bnt_action__content}>
                                    <VnrText
                                        style={[styleSheets.text, styles.bnt_action__text, { color: Colors.red }]}
                                        i18nKey={'HRM_Chat_Action_Remove_Group'}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}

                    <View style={styles.viewListGroup}>
                        <View style={styles.viewListGroup_title}>
                            <VnrText
                                style={[styleSheets.textFontMedium, styles.viewListGroup_title__text]}
                                i18nKey={'HRM_Chat_Title_Member_Upercase'}
                            />
                        </View>
                        {listMember != null && (
                            <MessagingListMemberGroup
                                rowActions={_rowActions}
                                detail={{
                                    dataLocal: false,
                                    screenDetail: ScreenName.ChatListUserInGroup,
                                    screenName: ScreenName.ChatListUserInGroup
                                }}
                                isRefreshList={isRefreshListMember}
                                dataLocal={[...listMember]}
                                valueField="ID"
                            />
                        )}
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }
}

const HEIGHT_BUTTON_UPLOAD = Size.deviceWidth * 0.3 >= 200 ? 200 : Size.deviceWidth * 0.3,
    HEIGHT_ICON = Size.iconSize + 8,
    WIDTH_INPUT_NAMEGROUP = Size.deviceWidth * 0.85,
    WIDTH_BUTTON_NEXT = Size.deviceWidth * 0.35;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    keyboardContent: {
        flex: 1
    },
    viewUpload: {
        marginVertical: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewUpload_bnt: {
        width: HEIGHT_BUTTON_UPLOAD,
        height: HEIGHT_BUTTON_UPLOAD,
        backgroundColor: Colors.gray_3,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewUpload_iconPlus: {
        backgroundColor: Colors.white,
        width: HEIGHT_ICON,
        height: HEIGHT_ICON,
        borderRadius: HEIGHT_ICON / 2,
        position: 'absolute',
        bottom: -4,
        right: -5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewForm: {
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 16
    },
    viewForm_Input: {
        width: WIDTH_INPUT_NAMEGROUP,
        height: 45,
        borderWidth: 1,
        borderColor: Colors.gray_5,
        borderRadius: 8
    },
    viewForm_Input__style: {
        height: '100%',
        paddingHorizontal: 10
    },
    viewForm_btutonNext: {
        width: WIDTH_BUTTON_NEXT,
        height: 45,
        alignItems: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 8,
        justifyContent: 'center'
    },
    viewForm_btutonNext__text: {
        color: Colors.white,
        fontWeight: '500'
    },
    viewForm_buttonDisable: {
        backgroundColor: Colors.gray_3
    },
    viewForm_btutonNext__textDisable: {
        color: Colors.gray_5
    },
    bnt_action: {
        flexDirection: 'row',
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        height: Size.deviceWidth * 0.13,
        maxHeight: 70,
        minHeight: 40,
        alignItems: 'center',
        marginHorizontal: 16
    },
    bnt_action__content: {
        flex: 1
    },
    bnt_action__left: {
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        alignItems: 'center'
    },
    bnt_action__text: {},
    bnt_action__IconLeft: {
        width: Size.iconSize + 12
    },
    viewListGroup: {
        flex: 1
    },
    viewListGroup_title: {
        paddingHorizontal: 16,
        marginBottom: 12,
        marginTop: 16
    },
    viewListGroup_title__text: {
        fontWeight: '500'
    },
    headerTitleCancel: {
        color: Colors.primary,
        fontWeight: '600'
    },
    viewUpload_Avatar: {
        width: HEIGHT_BUTTON_UPLOAD,
        height: HEIGHT_BUTTON_UPLOAD,
        borderRadius: 16
    }
});
