import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Platform,
    KeyboardAvoidingView,
    TextInput,
    Keyboard,
    Modal,
    Image
} from 'react-native';
import { Colors, Size, styleSheets, styleSafeAreaView } from '../../constants/styleConfig';
import { dataVnrStorage } from '../../assets/auth/authentication';
import {
    IconSend,
    IconBack,
    IconMoreVertical,
    IconImage,
    IconRefresh,
    IconCamera,
    IconCancel,
    IconCheck,
    IconBackRadious
} from '../../constants/Icons';
import { RNCamera } from 'react-native-camera';
import ActionSheet from 'react-native-actionsheet';
import { translate } from '../../i18n/translate';
import { SafeAreaView } from 'react-navigation';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import { ScreenName, EnumName } from '../../assets/constant';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MessagingChatList from './messagingChatList/MessagingChatList';
import MessagingSoketIO from '../../utils/MessagingSoketIO';
import HttpService from '../../utils/HttpService';
import ImagePicker from 'react-native-image-picker';
import DrawerServices from '../../utils/DrawerServices';
import Vnr_Function from '../../utils/Vnr_Function';
import { ConfigVersionBuild } from '../../assets/configProject/ConfigVersionBuild';
import { ToasterSevice } from '../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../components/VnrLoading/VnrLoadingPages';
const WIDTH_BNT_SEND = Size.iconSizeHeader + 15;
const MIN_HEIGHT_INPUT_SEND = Size.deviceWidth >= 1024 ? 75 : 55,
    MAX_HEIGHT_INPUT_SEND = MIN_HEIGHT_INPUT_SEND * 3;

export default class ChatGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentChat: '',
            springBntSend: new Animated.Value(0),
            springBntImage: new Animated.Value(1),
            widthBntImage: new Animated.Value(WIDTH_BNT_SEND),
            widthBntSend: new Animated.Value(0),
            listChat: null,
            isRefreshListChat: false,
            dataItem: null,
            status: null,
            isvisibleModalCamara: false,
            typeCamera: false,
            imageCamera: null,
            // Tính năng này có từ build 30 trở lên
            isActiveNew32: parseInt(ConfigVersionBuild.value) > parseInt('081022'),
            isLoading: false
        };

        this.agent = props.navigation.state.params.dataItem;
        this.userid = dataVnrStorage.currentUser.headers.userid;
        this.chatEndpointApi = dataVnrStorage.apiConfig.chatEndpointApi;
        this.sheetActionsImages = [
            {
                title: translate('Att_TAMScanLog_Camera'),
                onPress: this.showModalCamera
            },
            {
                title: translate('HRM_ChooseFromLibrary'),
                onPress: this.showPickerImageLibary
            },
            {
                title: translate('HRM_Common_Close'),
                onPress: null
            }
        ];
        //function lắng nghe nội dung chat
        MessagingSoketIO.listen(data => {
            if (data && data.topicID == this.agent.TopicID) {
                const { listChat, isRefreshListChat } = this.state,
                    chatID = Vnr_Function.MakeId(12),
                    { getListTopic } = this.props.navigation.state.params;

                // lay hinh anh nguoi nhan
                let dataUserSend = null;
                if (this.agent && this.agent.ListUser && this.agent.ListUser.length > 0) {
                    dataUserSend = this.agent.ListUser.find(e => e.UserID == data.userID);
                }
                let nextState = {
                    listChat: [
                        {
                            ID: chatID,
                            IsYou: data.userID === this.userid ? true : false,
                            Content: data.message,
                            UserInfoName: data.UserInfoName,
                            TimeChat: data.TimeChat,
                            Type: data.Type,
                            ImageUser: dataUserSend ? dataUserSend.Image : null
                        },
                        ...listChat
                    ],
                    isRefreshListChat: !isRefreshListChat,
                    isLoading: data.Type == EnumName.E_SYSTEM
                };

                this.setState(nextState, () => {
                    if (data.Type == EnumName.E_SYSTEM)
                        if (data.isAdminRemoveGroup) {
                            // Xóa Group chat, goBack lại DS Chat
                            if (getListTopic && typeof getListTopic === 'function') {
                                getListTopic();
                            }

                            DrawerServices.navigate(ScreenName.Messaging);
                        } else {
                            this.getTopicByID();
                        }
                });
            }
        }, 'SERVER-SEND-MESSAGE');

        //function lắng nghe lỗi gửi tin
        MessagingSoketIO.listen(data => {
            console.log(data, 'error mess');
        }, 'SERVER-RETURN-ERROR');

        //function lắng nghe user thay đổi trạng thái (on/off/busy)
        MessagingSoketIO.listen(data => {
            this.setState({ status: data.Status });
        }, 'SERVER-CHANGE-STATUS');

        // this.framesKeyboardDuration = 0;
        this.keyboardWillShowListener = Keyboard.addListener(
            Platform.OS == 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            frames => {
                // this.refScrollChat && this.refScrollChat.scrollToEnd();
                // console.log(frames.duration, 'duration')
                Animated.parallel([
                    Animated.spring(this.state.springBntSend, {
                        toValue: 1,
                        friction: 5
                    }),
                    Animated.spring(this.state.springBntImage, {
                        toValue: 0,
                        friction: 7
                    }),
                    Animated.timing(this.state.widthBntImage, {
                        toValue: 0,
                        duration: frames.duration
                    }),
                    Animated.timing(this.state.widthBntSend, {
                        toValue: WIDTH_BNT_SEND,
                        duration: frames.duration
                    })
                ]).start();
            }
        );

        this.keyboardWillHideListener = Keyboard.addListener(
            Platform.OS == 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            frames => {
                Animated.parallel([
                    Animated.spring(this.state.springBntSend, {
                        toValue: 0,
                        friction: 7
                    }),
                    Animated.spring(this.state.springBntImage, {
                        toValue: 1,
                        friction: 5
                    }),
                    Animated.timing(this.state.widthBntImage, {
                        toValue: WIDTH_BNT_SEND,
                        duration: frames.duration
                    }),
                    Animated.timing(this.state.widthBntSend, {
                        toValue: 0,
                        duration: frames.duration
                    })
                ]).start();
            }
        );
    }

    componentWillUnmount() {
        this.keyboardWillShowListener && this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener && this.keyboardWillHideListener.remove();
    }

    changeContent = text => {
        this.setState({ contentChat: text });
    };

    router = roouterName => {
        const { navigation } = this.props;
        navigation.navigate(roouterName, { setStateValidApi: this.setStateValidApi });
    };

    renderHeader = () => {
        const { isLoading, dataItem } = this.state;
        return (
            <View style={styles.header}>
                <SafeAreaView style={styles.viewSafe}>
                    <View style={styles.headerView}>
                        <TouchableOpacity style={styles.headerView_bnt__back} onPress={() => this.router('Messaging')}>
                            <IconBack size={Size.iconSizeHeader} color={Colors.gray_10} />
                        </TouchableOpacity>
                        <View style={styles.headerView_content}>
                            <Text
                                numberOfLines={1}
                                style={[styleSheets.textFontMedium, styles.headerView_content__text]}
                            >
                                {dataItem && dataItem.NameView != null ? dataItem.NameView : ''}
                            </Text>

                            <Text style={[styleSheets.text, styles.viewStatus_textCount]}>
                                {dataItem && dataItem.ListUser.length} {translate('HRM_Chat_Title_Member_Lowercase')}
                            </Text>
                        </View>

                        {isLoading ? (
                            <View style={styles.headerView_bnt__more}>
                                <VnrLoading size={'small'} />
                            </View>
                        ) : (
                            <TouchableOpacity
                                onPress={() => {
                                    const { getListTopic, dataAgent, dataStatus } = this.props.navigation.state.params;
                                    DrawerServices.navigate('OptionGroup', {
                                        dataItem,
                                        getListTopic,
                                        dataAgent,
                                        dataStatus,
                                        updateNameApp: this.updateNameApp,
                                        updateIsAllUserChatTopic: this.updateIsAllUserChatTopic,
                                        updateEnableNotify: this.updateEnableNotify,
                                        getOutUserGoupChat: this.getOutUserGoupChat,
                                        addUserToGroup: this.addUserToGroup,
                                        removeGroupChat: this.removeGroupChat,
                                        adminGrantPermission: this.adminGrantPermission
                                    });
                                }}
                                style={styles.headerView_bnt__more}
                            >
                                <IconMoreVertical size={Size.iconSizeHeader} color={Colors.gray_10} />
                            </TouchableOpacity>
                        )}
                    </View>
                </SafeAreaView>
            </View>
        );
    };

    handleUnhandledTouches() {
        Keyboard.dismiss();
        return false;
    }

    //#region [Xử lý chụp ảnh hoặc chọn ảnh từ libary]
    openActionSelectImages = () => {
        this.resActionSheetImages.show();
    };

    actionSheetOnCLick = index => {
        this.sheetActionsImages[index].onPress != null && this.sheetActionsImages[index].onPress();
    };

    confirmFileReview = (value, imageRes) => {
        if (value === true) {
            this.setState({ imageCamera: null, isvisibleModalCamara: false }, () => {
                this.sendMessaging(imageRes);
            });
        } else {
            this.setState({ imageCamera: null });
        }
    };

    reviewCameraImage = imageRes => {
        return (
            <View style={styleSheets.container}>
                <Image
                    source={{ uri: `data:${imageRes.type};base64,${imageRes.data}` }}
                    resizeMode={'cover'}
                    style={stylesCamera.viewAllreviewImage}
                />

                <View style={stylesCamera.viewAllreviewCamera}>
                    <View style={stylesCamera.oval} />
                    <View style={stylesCamera.lisbntStyle}>
                        <TouchableOpacity
                            onPress={() => this.confirmFileReview(false, { ...imageRes })}
                            style={stylesCamera.capture}
                        >
                            <IconBackRadious size={Size.iconSize + 10} color={Colors.black} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.confirmFileReview(true, { ...imageRes })}
                            style={[stylesCamera.captureCamera, { backgroundColor: Colors.primary }]}
                        >
                            <IconCheck size={Size.iconSize + 15} color={Colors.white} />
                        </TouchableOpacity>
                        <View style={stylesCamera.capture}>
                            <IconRefresh size={Size.iconSize + 10} color={Colors.white} />
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    takePicture = async function(camera) {
        // quality tham so chat luong hinh anh ( 0 -> 1)
        const options = { quality: 0.5, base64: true };
        const data = await camera.takePictureAsync(options);

        const file = {
            data: data.base64,
            type: 'image/jpeg',
            fileSize: data.height * data.width * 4,
            temp: true
        };

        this.setState({ imageCamera: file });
    };

    hideModalCamera = () => {
        this.setState({ isvisibleModalCamara: false });
    };

    showModalCamera = () => {
        this.setState({
            isvisibleModalCamara: true
        });
    };

    showPickerImageLibary = () => {
        ImagePicker.launchImageLibrary({}, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                if (response.fileSize && response.fileSize * 0.000001 >= 4) {
                    ToasterSevice.showWarning('HRM_File_Size_Less_4');
                    return;
                }
                this.sendMessaging(response);
            }
        });
    };

    showPickerImage = () => {
        if (Platform.OS == 'ios') {
            this.openActionSelectImages();
        } else {
            const options = {
                title: translate('AttachImage'),
                cancelButtonTitle: translate('HRM_Common_Close'),
                takePhotoButtonTitle: translate('Att_TAMScanLog_Camera'),
                chooseFromLibraryButtonTitle: translate('HRM_ChooseFromLibrary'),
                cameraType: 'back',
                mediaType: 'photo',
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
                    if (response.fileSize && response.fileSize * 0.000001 >= 3) {
                        ToasterSevice.showWarning('HRM_File_Size_Less_4');
                        return;
                    }

                    this.sendMessaging(response);
                }
            });
        }
    };
    //#endregion

    sendMessaging = (dataChat, isReSendMessage, idReSend) => {
        // const { contentChat } = this.state;
        // Kiểm tra replate HTML
        if (dataChat.contentChat) {
            let regex = /(<([^>]+)>)/gi;
            dataChat.contentChat = dataChat.contentChat.replace(regex, '');
        }

        debugger;
        let { listChat, isRefreshListChat } = this.state,
            contentChat = '',
            chatID = isReSendMessage ? idReSend : Vnr_Function.MakeId(12),
            { type, isUserGetOutGroup, isAdminRemoveGroup } = dataChat;

        if (type !== null && type !== undefined && type !== EnumName.E_SYSTEM) {
            // gửi image
            contentChat = `data:${type};base64,${dataChat.data}`;
            type = 'image';
        } else {
            // gửi text
            contentChat = dataChat.contentChat;
        }
        if (!contentChat || contentChat === '') return;

        //listChat.length > 15 && listChat.shift();
        if (isReSendMessage) {
            // gửi lại tin nhắn lỗi
            let indexItem = listChat.findIndex(e => e.ID == chatID);

            if (indexItem > -1 && listChat[indexItem]) {
                listChat[indexItem]['Status'] = EnumName.E_PROGRESS;
            }
        } else {
            listChat = [
                {
                    ID: chatID,
                    IsYou: true,
                    Content: contentChat,
                    TimeChat: new Date(),
                    Type: type,
                    Status: EnumName.E_PROGRESS
                }
            ].concat(listChat);
        }

        // listChat = [{
        //   ID: chatID,
        //   IsYou: true,
        //   Content: contentChat,
        //   TimeChat: new Date(),
        //   Type: type,
        //   Status: EnumName.E_PROGRESS,// E_PROGRESS, DONE , ERROR

        // }].concat(listChat);

        this.setState(
            {
                listChat: listChat, // dang gui
                contentChat: '',
                isRefreshListChat: !isRefreshListChat
            },
            () => {
                debugger;
                //sender
                let { ListUser, TopicID } = this.agent,
                    dataBody = {
                        topicID: TopicID,
                        userID: this.userid,
                        userReceiveIDs: ListUser.map(n => n.UserID).filter(u => u != this.userid),
                        UserInfoName: dataVnrStorage.currentUser.info.FullName,
                        message: contentChat,
                        Content: contentChat,
                        typeMess: type,
                        Type: type,
                        isUserGetOutGroup: isUserGetOutGroup, //User out group
                        isAdminRemoveGroup: isAdminRemoveGroup, // Xóa user khỏi group
                        chatEndpointApi: this.chatEndpointApi,
                        TimeChat: new Date()
                    };

                //save chat

                HttpService.Post(this.chatEndpointApi + '/restapi/chat/saveMessage', dataBody)
                    .then(res => {
                        //success
                        if (res.success && res.success == 'E_SUCCESS') {
                            // Nếu gửi hình ảnh thì replate Content trong dataBody thành URI.
                            if (res.typeMess == 'image') {
                                dataBody = {
                                    ...dataBody,
                                    ...{
                                        message: res.value,
                                        Content: res.value
                                    }
                                };
                            }

                            console.log(dataBody, 'saveMessage');
                            //emit to client
                            MessagingSoketIO.send(dataBody, 'CLIENT-SEND-MESSAGE');

                            // cập nhật trang thái Done
                            this.updateChatStatus(chatID, EnumName.E_DONE);

                            // Xóa Group chat, goBack lại DS Chat
                            isAdminRemoveGroup && DrawerServices.navigate(ScreenName.Messaging);

                            // debugger;
                            //callback để update tin nhắn nhân được mới nhất cho list
                            const { updateLastMess } = this.props.navigation.state.params;
                            if (updateLastMess && typeof updateLastMess === 'function') {
                                updateLastMess(dataBody, false);
                            }
                        }
                        //fail
                        else {
                            this.updateChatStatus(chatID, EnumName.E_ERROR);
                        }
                    })
                    .catch(error => {
                        this.updateChatStatus(chatID, EnumName.E_ERROR);
                    });
            }
        );
    };

    updateChatStatus = (id, status) => {
        const { listChat, isRefreshListChat } = this.state;
        let indexItem = listChat.findIndex(e => e.ID == id);

        if (indexItem > -1 && listChat[indexItem]) {
            listChat[indexItem]['Status'] = status;
        }
        this.setState({
            listChat,
            isRefreshListChat: !isRefreshListChat
        });
    };

    showMoreChat = (page, pageSize) => {
        const { dataItem, isRefreshListChat, listChat } = this.state;
        HttpService.Post(`${this.chatEndpointApi}/restapi/chat/GetMessageByTopic`, {
            index: page,
            PageSize: pageSize,
            UserID: dataVnrStorage.currentUser.headers.userid,
            TopicID: dataItem.TopicID
        }).then(res => {
            this.setState({
                listChat: [...listChat, ...res.Data],
                isRefreshListChat: !isRefreshListChat
            });
        });
    };

    renderInput = () => {
        const { contentChat, dataItem, isActiveNew32 } = this.state;

        if (dataItem) {
            if (dataItem.IsAllUserChat == false && dataItem.isAdmin == false && isActiveNew32) {
                return <View />;
            } else {
                return (
                    <View style={styles.viewSend}>
                        <TextInput
                            ref={refSearch => (this.refSearch = refSearch)}
                            onClearText={() => this.changeContent('')}
                            placeholder={'Aa'}
                            onChangeText={text => this.changeContent(text)}
                            value={contentChat}
                            onSubmitEditing={() => {}}
                            style={[styleSheets.text, styles.viewSend_content]}
                            multiline
                            numberOfLines={6}
                        />

                        <Animated.View
                            style={[
                                styles.viewSend_bnt,
                                {
                                    width: this.state.widthBntSend,
                                    transform: [
                                        {
                                            scale: this.state.springBntSend
                                        }
                                    ]
                                }
                            ]}
                        >
                            <TouchableOpacity
                                style={styles.viewSend_bnt__chillrent}
                                onPress={() =>
                                    this.sendMessaging({
                                        type: null,
                                        contentChat: contentChat
                                    })
                                }
                            >
                                <IconSend size={Size.iconSizeHeader} color={Colors.primary} />
                            </TouchableOpacity>
                        </Animated.View>

                        <Animated.View
                            style={[
                                styles.viewSend_bnt,
                                {
                                    width: this.state.widthBntImage,
                                    transform: [
                                        {
                                            scale: this.state.springBntImage
                                        }
                                    ]
                                }
                            ]}
                        >
                            <TouchableOpacity style={styles.viewSend_bnt__chillrent} onPress={this.showPickerImage}>
                                <IconImage size={Size.iconSizeHeader} color={Colors.gray_8} />
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                );
            }
        }
    };

    renderContent = () => {
        const { isRefreshListChat, listChat, dataItem } = this.state;
        return listChat !== null ? (
            <View
                style={[
                    styles.chatContent,
                    {
                        // marginBottom: 300
                    }
                ]}
            >
                <MessagingChatList
                    key={'E_LISTCHAT'}
                    ref={ref => (this.refScrollChat = ref)}
                    //rowActions={_rowActions}
                    detail={{
                        dataLocal: false,
                        screenDetail: ScreenName.ChatFriend,
                        screenName: ScreenName.ChatFriend
                    }}
                    isRefreshListChat={isRefreshListChat}
                    showMoreChat={this.showMoreChat}
                    dataLocal={listChat}
                    dataRecord={dataItem}
                    valueField="ID"
                    isChatGroup={true}
                    sendMessaging={this.sendMessaging}
                />
            </View>
        ) : (
            <VnrLoading size={'large'} />
        );
    };

    updateNameApp = nameApp => {
        const { dataItem } = this.state;
        dataItem.NameView = nameApp;
        this.setState({ dataItem });
    };

    componentDidMount() {
        let _params = this.props.navigation.state.params,
            { dataItem, isCreateGroup } = _params,
            { TopicID } = dataItem;

        const { isActiveNew32 } = this.state;
        // console.log(dataItem, 'dataItem')
        if (dataItem) {
            dataItem = {
                ...dataItem,
                topicID: dataItem.TopicID
                // IsAllUserChat: false
            };

            // check userLogin có phải admin của nhóm hay không
            let isAdmin = false;
            if (isActiveNew32) {
                let indexAdmin = dataItem.ListUser.findIndex(item => item.Permission === 'Admin');

                let getItem = indexAdmin > -1 ? dataItem.ListUser[indexAdmin] : null;

                if (getItem !== null && getItem.UserID === this.userid) {
                    isAdmin = true;
                } else {
                    isAdmin = false;
                }
            } else {
                isAdmin = true;
            }

            dataItem = { ...dataItem, isAdmin: isAdmin };
            this.agent = dataItem;

            console.log(dataItem, 'dataItem');
            this.setState(
                {
                    listChat: dataItem.ListMessage && dataItem.ListMessage.Data ? [...dataItem.ListMessage.Data] : [],
                    status: dataItem.Status ? dataItem.Status : null,
                    dataItem: dataItem
                },
                () => {
                    //clear remind nếu có

                    if (dataItem.RemindQty && dataItem.RemindQty > 0) {
                        HttpService.Post(`${this.chatEndpointApi}/restapi/chat/ClearRemind`, {
                            UserID: this.userid,
                            TopicID
                        });

                        //callback để update tin remind = 0
                        const { updateLastMess } = this.props.navigation.state.params;
                        if (updateLastMess && typeof updateLastMess === 'function') {
                            updateLastMess(dataItem, false, true);
                        }
                    }

                    if (isCreateGroup) {
                        this.setState({ isLoading: true }, () => {
                            this.getTopicByID();
                        });
                    }
                }
            );
        }
    }

    updateIsAllUserChatTopic = isSwichIsAllUserChat => {
        const databody = {
            TopicID: this.agent.TopicID,
            IsAllUserChat: isSwichIsAllUserChat
        };
        HttpService.Post(`${this.chatEndpointApi}/restapi/Chat/UpdateIsAllUserChatTopic`, databody).then(res => {
            // console.log(res,'UpdateIsAllUserChatTopic')
            let message = '';
            if (isSwichIsAllUserChat) {
                message = 'Trưởng nhóm đã bật tính năng tất cả được trò chuyện!';
            } else {
                message = 'Trưởng nhóm đã tắt tính năng tất cả được trò chuyện!';
            }

            this.sendMessaging({
                type: EnumName.E_SYSTEM,
                contentChat: message
            });

            this.setState({ isLoading: true }, () => {
                this.getTopicByID();
            });
        });
    };

    updateEnableNotify = isSwichNotify => {
        const databody = {
                TopicID: this.agent.TopicID,
                IsNotify: isSwichNotify,
                UserLoginID: this.userid
            },
            { getListTopic } = this.props.navigation.state.params;

        HttpService.Post(`${this.chatEndpointApi}/restapi/Chat/UpdateIsNotifyTopicDetail`, databody).then(res => {
            let message = '';
            if (isSwichNotify) {
                let traslate = translate('HRM_Chat_Title_EnableNotify_Success');
                message = traslate.replace('[E_GROUP_NAME]', this.agent.NameView);
                ToasterSevice.showSuccess(message);
            } else {
                let traslate = translate('HRM_Chat_Title_UnEnableNotify_Success');
                message = traslate.replace('[E_GROUP_NAME]', this.agent.NameView);
                ToasterSevice.showWarning(message);
            }

            if (getListTopic && typeof getListTopic === 'function') {
                getListTopic();
            }

            this.setState({ isLoading: true }, () => {
                this.getTopicByID();
            });
        });
    };

    adminGrantPermission = (UserID, UserName) => {
        const databody = {
            TopicID: this.agent.TopicID,
            UserLoginID: this.userid,
            UserID: UserID
        };
        debugger;
        HttpService.Post(`${this.chatEndpointApi}/restapi/Chat/SetPermisstionUserInGroup`, databody).then(res => {
            let message = '';
            if (UserName) {
                message = `${UserName} đã được ủy nhiệm lên làm trưởng nhóm`;
            }

            this.sendMessaging({
                type: EnumName.E_SYSTEM,
                isUserGetOutGroup: true,
                contentChat: message
            });

            this.setState({ isLoading: true }, () => {
                this.getTopicByID();
            });
        });
    };

    getOutUserGoupChat = (UserID, UserName) => {
        const databody = {
            TopicID: this.agent.TopicID,
            UserID: UserID
        };
        debugger;
        HttpService.Post(`${this.chatEndpointApi}/restapi/Chat/RemoveUserOffTopic`, databody).then(res => {
            let message = '';

            if (UserID == this.userid && UserName) {
                // tự rời khỏi nhóm
                message = `${UserName} đã rời khỏi nhóm`;
            } else if (UserName) {
                //admin mời ra khỏi nhóm
                message = `${UserName} đã được xóa khỏi cuộc trò chuyện`;
            }

            this.sendMessaging({
                type: EnumName.E_SYSTEM,
                isUserGetOutGroup: true,
                contentChat: message
            });

            this.setState({ isLoading: true }, () => {
                this.getTopicByID();
            });
        });
    };

    removeGroupChat = () => {
        const databody = {
            TopicID: this.agent.TopicID,
            UserID: this.userid
        };
        debugger;
        HttpService.Post(`${this.chatEndpointApi}/restapi/Chat/SetIsDeleteTopic`, databody).then(res => {
            let message = 'Admin đã giải tán nhóm';

            this.sendMessaging({
                type: EnumName.E_SYSTEM,
                isAdminRemoveGroup: true,
                contentChat: message
            });

            this.setState({ isLoading: true });
        });
    };

    addUserToGroup = listUserSelect => {
        let message = '';
        const { getListTopic } = this.props.navigation.state.params;

        if (listUserSelect) {
            let stringNameUsers = listUserSelect ? listUserSelect.map(item => item.UserInfoName).join(', ') : '';
            // let traslate = translate('HRM_Chat_Title_EnableNotify_Success');
            message = `${stringNameUsers} đã được thêm vào cuộc trò chuyện`;
        }

        // Thêm userID của các user mới tạo vào this.agent
        this.agent = {
            ...this.agent,
            ListUser: [...this.agent.ListUser, ...listUserSelect]
        };

        this.sendMessaging({
            type: EnumName.E_SYSTEM,
            isUserGetOutGroup: true,
            contentChat: message
        });

        //reload DS
        if (getListTopic && typeof getListTopic === 'function') {
            getListTopic();
        }

        this.setState({ isLoading: true }, () => {
            this.getTopicByID();
        });
    };

    getTopicByID = () => {
        debugger;
        const databody = {
            TopicID: this.agent.TopicID,
            UserID: this.userid,
            UserLoginID: this.userid
        };
        const { isActiveNew32 } = this.state;
        const { getListTopic } = this.props.navigation.state.params;

        HttpService.MultiRequest([
            HttpService.Post(`${this.chatEndpointApi}/restapi/Chat/GetTopicByID`, databody),
            HttpService.Post(`${this.chatEndpointApi}/restapi/Chat/GetUserByTopicGroup`, databody)
        ]).then(resAll => {
            const res = resAll[0],
                listUserGroup = resAll[1];

            if (res && Object.keys(res).length > 0) {
                const mapItem = {
                    ...this.agent,
                    ...res,
                    ListUser: listUserGroup
                    // IsAllUserChat: false
                    //IsAccept: false
                };

                let indexInGroup = mapItem.ListUser.findIndex(item => item.UserID === this.userid);
                // user có còn trong nhóm hay không, không còn thì GoBack về DS và reload lại DS
                if (indexInGroup < 0) {
                    // reload lại DS Chat Group
                    getListTopic && typeof getListTopic == 'function' && getListTopic();
                    DrawerServices.goBack();
                    return;
                }

                // check userLogin có phải admin của nhóm hay không
                let isAdmin = false;
                if (isActiveNew32) {
                    let indexAdmin = mapItem.ListUser.findIndex(item => item.Permission === 'Admin');

                    let getItem = indexAdmin > -1 ? mapItem.ListUser[indexAdmin] : null;

                    if (getItem !== null && getItem.UserID === this.userid) {
                        isAdmin = true;
                    } else {
                        isAdmin = false;
                    }
                } else {
                    isAdmin = true;
                }

                this.agent = { ...mapItem, isAdmin: isAdmin };
                dataItem = { ...mapItem, isAdmin: isAdmin };

                this.setState(
                    {
                        listChat:
                            dataItem.ListMessage && dataItem.ListMessage.Data ? [...dataItem.ListMessage.Data] : [],
                        status: dataItem.Status ? dataItem.Status : null,
                        dataItem: dataItem,
                        isLoading: false
                    },
                    () => {
                        HttpService.Post(`${this.chatEndpointApi}/restapi/chat/ClearRemind`, {
                            UserID: this.userid,
                            TopicID: this.agent.TopicID
                        });

                        //callback để update tin remind = 0
                        const { updateLastMess } = this.props.navigation.state.params;
                        if (updateLastMess && typeof updateLastMess === 'function') {
                            updateLastMess(dataItem, false, true);
                        }
                    }
                );
            } else {
                DrawerServices.navigate(ScreenName.Messaging);
                // ToasterSevice.showError('Error connect!!!', 4000);
            }
        });
    };

    render() {
        const { imageCamera, typeCamera, isvisibleModalCamara } = this.state;
        return (
            <SafeAreaView {...styleSafeAreaView} style={[styles.container]}>
                {this.renderHeader()}
                {Platform.OS == 'android' ? (
                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.keyboardContent}
                        extraScrollHeight={20} // khoan cach
                        keyboardShouldPersistTaps={'handled'}
                    >
                        {this.renderContent()}
                        {this.renderInput()}
                    </KeyboardAwareScrollView>
                ) : (
                    <KeyboardAvoidingView
                        behavior={Platform.OS == 'ios' ? 'padding' : 'padding'}
                        style={styles.keyboardContent}
                        onStartShouldSetResponder={() => this.handleUnhandledTouches()}
                    >
                        {this.renderContent()}
                        {this.renderInput()}
                    </KeyboardAvoidingView>
                )}

                {/* option chọn camera hoặc libary */}
                <ActionSheet
                    ref={o => (this.resActionSheetImages = o)}
                    options={this.sheetActionsImages.map(item => {
                        return item.title;
                    })}
                    cancelButtonIndex={this.sheetActionsImages.length - 1}
                    destructiveButtonIndex={this.sheetActionsImages.length - 1}
                    onPress={index => this.actionSheetOnCLick(index)}
                />

                {/* Modal camara */}
                <Modal
                    animationIn="fadeIn"
                    animationOut="fadeOut"
                    key={'@MODAL_CAMERA'}
                    visible={isvisibleModalCamara}
                    transparent={false}
                    onRequestClose={this.hideModalCamera}
                >
                    {imageCamera != null && imageCamera.temp == true ? (
                        this.reviewCameraImage(imageCamera)
                    ) : (
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: Colors.white
                            }}
                        >
                            <RNCamera
                                captureAudio={false}
                                style={stylesCamera.preview}
                                type={typeCamera ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
                                // flashMode={typeCamera}
                                androidCameraPermissionOptions={{
                                    title: 'Permission to use camera',
                                    message:
                                        'We would like to use your camera for taking pictures in the GPS timekeeping screen',
                                    buttonPositive: 'Ok',
                                    buttonNegative: 'Cancel'
                                }}
                                androidRecordAudioPermissionOptions={{
                                    title: 'Permission to use audio recording',
                                    message: 'We need your permission to use your audio',
                                    buttonPositive: 'Ok',
                                    buttonNegative: 'Cancel'
                                }}
                            >
                                {({ camera, status }) => {
                                    if (status !== 'READY') {
                                        return <VnrLoading size="small" color={Colors.primary} />;
                                    } else {
                                        return (
                                            <View style={stylesCamera.viewAll}>
                                                <View style={stylesCamera.oval} />
                                                <View style={stylesCamera.lisbntStyle}>
                                                    <TouchableOpacity
                                                        onPress={() => this.hideModalCamera(camera)}
                                                        style={stylesCamera.capture}
                                                    >
                                                        <IconCancel size={Size.iconSize + 13} color={Colors.black} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => this.takePicture(camera)}
                                                        style={stylesCamera.captureCamera}
                                                    >
                                                        <IconCamera size={Size.iconSize + 20} color={Colors.primary} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            this.setState({
                                                                typeCamera: !this.state.typeCamera
                                                            })
                                                        }
                                                        style={stylesCamera.capture}
                                                    >
                                                        <IconRefresh size={Size.iconSize + 10} color={Colors.black} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        );
                                    }
                                }}
                            </RNCamera>
                        </View>
                    )}
                </Modal>
            </SafeAreaView>
        );
    }
}

const HEIGHT_HEADER = Platform.OS == 'ios' ? Size.headerHeight : Size.headerHeight - 25;
const styles = StyleSheet.create({
    header: {
        height: Size.deviceheight >= 1024 ? HEIGHT_HEADER + 20 : HEIGHT_HEADER,
        width: Size.deviceWidth,
        position: 'absolute',
        top: 0,
        left: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.gray_5,
        backgroundColor: Colors.whileOpacity80,
        zIndex: 2
    },
    viewSafe: {
        flex: 1,
        justifyContent: Platform.OS == 'ios' ? 'flex-end' : 'center'
    },
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    keyboardContent: {
        flex: 1
    },
    headerView_content: {
        flex: 1
        // paddingVertical: 4,
        // backgroundColor: 'red'
    },
    container: {
        backgroundColor: Colors.white,
        flex: 1
    },
    headerView_content__text: {
        color: Colors.gray_10,
        fontWeight: '500'
    },
    viewStatus_textCount: {
        fontWeight: '500',
        color: Colors.gray_7,
        marginRight: 3,
        fontSize: Size.text - 4,
        paddingVertical: 0
    },
    viewStatus: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    headerView_bnt__back: {
        height: '100%',
        width: Size.iconSizeHeader + 15,
        justifyContent: 'center',
        alignItems: 'center'
        // paddingLeft: 5,
    },
    headerView_bnt__more: {
        height: '100%',
        width: Size.iconSizeHeader + 15,
        justifyContent: 'center',
        alignItems: 'center'
        // alignItems: 'flex-end',
        // paddingRight: 5,
    },
    chatContent: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? Size.headerHeight : Size.headerHeight - 25,
        backgroundColor: Colors.gray_3
    },
    viewSend: {
        height: MIN_HEIGHT_INPUT_SEND,
        minHeight: MIN_HEIGHT_INPUT_SEND,
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderTopColor: Colors.gray_5,
        borderTopWidth: 0.5,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewSend_content: {
        flex: 1,
        //minHeight: MIN_HEIGHT_INPUT_SEND,
        //height: 'auto',
        // backgroundColor: 'blue'
        // backgroundColor: 'red',
        // paddingHorizontal: 10,
        paddingVertical: 10
    },
    viewSend_bnt: {
        width: Size.iconSizeHeader + 15,
        alignItems: 'flex-end',
        justifyContent: 'center'
        // backgroundColor: 'red'
        // paddingRight: 10
    },
    viewSend_bnt__chillrent: {
        flex: 1,
        justifyContent: 'center'
    }
});
const stylesCamera = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    capture: {
        backgroundColor: Colors.white,
        borderRadius: 5,
        padding: 5,
        paddingHorizontal: 20,
        alignSelf: 'center',
        marginVertical: 20,
        height: 80,
        width: 80,
        borderColor: Colors.primary
    },
    captureCamera: {
        height: Size.deviceheight * 0.11,
        width: Size.deviceheight * 0.11,
        borderRadius: Size.deviceheight * 0.11 < 98.56 ? Size.deviceheight * 0.11 * 0.5 : 49.28,
        zIndex: 1,
        borderColor: Colors.primary,
        borderWidth: 5.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    changeTypeCam: {
        backgroundColor: Colors.white,
        borderRadius: 5,
        padding: 5,
        paddingHorizontal: 20,
        alignSelf: 'center',
        marginVertical: 20,
        position: 'absolute',
        top: 20,
        right: 20
    },
    styleColoseModal: {
        backgroundColor: Colors.white,
        borderRadius: 5,
        padding: 5,
        paddingHorizontal: 20,
        alignSelf: 'center',
        marginVertical: 20,
        position: 'absolute',
        top: 20,
        left: 20
    },
    oval: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Size.deviceWidth,
        flexDirection: 'row',
        backgroundColor: Colors.white,
        height: Size.deviceheight * 0.3,
        transform: [
            {
                scaleX: 1.6
            }
        ],
        borderTopStartRadius: Size.deviceWidth / 2,
        borderTopEndRadius: Size.deviceWidth / 2
    },
    viewAll: {
        width: Size.deviceWidth,
        alignItems: 'flex-start',
        height: Size.deviceheight * 0.3
    },
    viewAllreviewCamera: {
        position: 'absolute',
        bottom: 0,
        width: Size.deviceWidth,
        alignItems: 'flex-start',
        height: Size.deviceheight * 0.3
    },
    viewAllreviewImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        bottom: Size.deviceheight * 0.3 - 40
    },
    lisbntStyle: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 30
    }
});
