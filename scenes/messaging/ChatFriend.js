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
import ActionSheet from 'react-native-actionsheet';
import { RNCamera } from 'react-native-camera';
import DrawerServices from '../../utils/DrawerServices';
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
    IconBackRadious,
    IconChat
} from '../../constants/Icons';
import { translate } from '../../i18n/translate';
import { SafeAreaView } from 'react-navigation';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import { ScreenName, EnumName } from '../../assets/constant';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MessagingSoketIO from '../../utils/MessagingSoketIO';
import HttpService from '../../utils/HttpService';
import MessagingChatList from './messagingChatList/MessagingChatList';
import ImagePicker from 'react-native-image-picker';
import { ToasterSevice } from '../../components/Toaster/Toaster';
import Vnr_Function from '../../utils/Vnr_Function';
import VnrText from '../../components/VnrText/VnrText';
import { ConfigVersionBuild } from '../../assets/configProject/ConfigVersionBuild';
import { ConfigField } from '../../assets/configProject/ConfigField';

const WIDTH_BNT_SEND = Size.iconSizeHeader + 32;
const MIN_HEIGHT_INPUT_SEND = Size.deviceWidth >= 1024 ? 75 : 55,
    MAX_HEIGHT_INPUT_SEND = MIN_HEIGHT_INPUT_SEND * 3;

export default class ChatFriend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentChat: '',
            springBntSend: new Animated.Value(0),
            springBntImage: new Animated.Value(1),
            widthBntImage: new Animated.Value(WIDTH_BNT_SEND),
            widthBntSend: new Animated.Value(0),
            dataItem: null,
            status: null,
            listChat: null,
            isRefreshListChat: false,
            isvisibleModalCamara: false,
            typeCamera: false,
            imageCamera: null,
            // Tính năng này có từ build 30 trở lên
            isActiveNew32: parseInt(ConfigVersionBuild.value) > parseInt('081030'),
            isUserRequestAcceptChat: null,
            isLoading: false
        };

        this.agent = props.navigation.state.params.dataItem;
        this.userid = dataVnrStorage.currentUser.headers.userid;
        this.chatEndpointApi = dataVnrStorage.apiConfig.chatEndpointApi;
        this.userid = dataVnrStorage.currentUser.headers.userid;
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
            debugger;
            if (data && data.topicID == this.agent.TopicID) {
                const { listChat, isRefreshListChat } = this.state,
                    chatID = Vnr_Function.MakeId(12);
                let nextState = {
                    listChat: [
                        {
                            ID: chatID, //new Date().getTime(),
                            IsYou: data.userID === this.userid ? true : false,
                            Content: data.message,
                            TimeChat: data.TimeChat,
                            Type: data.Type
                        },
                        ...listChat
                    ],
                    isRefreshListChat: !isRefreshListChat,
                    isLoading: data.Type == EnumName.E_SYSTEM
                };

                this.setState(nextState, () => {
                    if (data.Type == EnumName.E_SYSTEM) this.getTopicByID();
                });
            }
        }, 'SERVER-SEND-MESSAGE');

        // MessagingSoketIO.listen(data => {
        //   debugger;
        //   if (data && data.topicID == this.agent.TopicID) {
        //     console.log(data, 'SERVER-SEND-REQUEST-ACCEPT')
        //     this.getTopicByID();
        //   }
        // }, 'SERVER-SEND-REQUEST-ACCEPT');

        //function lắng nghe lỗi gửi tin
        MessagingSoketIO.listen(data => {
            debugger;
            console.log(data, 'error mess');
        }, 'SERVER-RETURN-ERROR');

        //function lắng nghe user thay đổi trạng thái (on/off/busy)
        MessagingSoketIO.listen(data => {
            debugger;
            if (data && data.UserID == this.agent.UserID) {
                this.setState({ status: data.Status });
            }
        }, 'SERVER-CHANGE-STATUS');

        this.keyboardWillShowListener = Keyboard.addListener(
            Platform.OS == 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            frames => {
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
        const { status, dataItem, isLoading } = this.state,
            _configField =
                ConfigField && ConfigField.value['MessagingChatFriend']
                    ? ConfigField.value['MessagingChatFriend']['Hidden']
                    : [];

        let isShowCodeEmp = _configField.findIndex(key => key == 'CodeEmp') > -1 ? false : true;

        return (
            <View style={styles.header}>
                <SafeAreaView style={styles.viewSafe}>
                    <View style={styles.headerView}>
                        <TouchableOpacity style={styles.headerView_bnt__back} onPress={() => DrawerServices.goBack()}>
                            <IconBack size={Size.iconSizeHeader} color={Colors.gray_10} />
                        </TouchableOpacity>
                        <View style={styles.headerView_content}>
                            {dataItem && dataItem.NameView != null && (
                                <Text
                                    numberOfLines={1}
                                    style={[styleSheets.textFontMedium, styles.headerView_content__text]}
                                >
                                    {`${dataItem.NameView}${
                                        isShowCodeEmp && dataItem.CodeEmp ? ' - ' + dataItem.CodeEmp : ''
                                    }`}
                                </Text>
                            )}

                            <VnrText
                                style={[
                                    styleSheets.text,
                                    styles.viewStatus_text,
                                    {
                                        color:
                                            status !== null && status.theme ? status.theme.PrimaryColor : Colors.green
                                    }
                                ]}
                                i18nKey={status ? status.title : ''}
                            />

                            {/* <Text
                style={[
                  styleSheets.text,
                  styles.viewStatus_text,
                  {
                    color:
                      status !== null && status.theme
                        ? status.theme.PrimaryColor
                        : Colors.green,
                  },
                ]}>
                {status ? status.title : ''}
              </Text> */}
                        </View>

                        {isLoading ? (
                            <View style={styles.headerView_bnt__more}>
                                <VnrLoading size={'small'} />
                            </View>
                        ) : (
                            <TouchableOpacity
                                onPress={() =>
                                    DrawerServices.navigate('OptionFriend', {
                                        dataItem,
                                        getListTopic: this.props.navigation.state.params.getListTopic
                                    })
                                }
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

    sendMessaging = (dataChat, isReSendMessage, idReSend) => {
        debugger;
        // Kiểm tra replate HTML
        if (dataChat.contentChat) {
            let regex = /(<([^>]+)>)/gi;
            dataChat.contentChat = dataChat.contentChat.replace(regex, '');
        }

        let { listChat, isRefreshListChat } = this.state,
            chatID = isReSendMessage ? idReSend : Vnr_Function.MakeId(12),
            contentChat = '',
            { type } = dataChat;

        if (type !== null && type !== undefined && type != EnumName.E_SYSTEM) {
            contentChat = `data:${type};base64,${dataChat.data}`;
            type = 'image';
        } else {
            contentChat = dataChat.contentChat;
        }

        if (!contentChat || contentChat === '') return;

        if (isReSendMessage) {
            //gửi lại tin nhắn lỗi
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

        this.setState(
            {
                listChat,
                contentChat: '',
                isRefreshListChat: !isRefreshListChat
            },
            () => {
                //sender
                let { UserID, TopicID } = this.agent,
                    dataBody = {
                        topicID: TopicID,
                        userID: this.userid,
                        userReceiveIDs: [UserID],
                        message: contentChat,
                        Content: contentChat,
                        typeMess: type,
                        Type: type,
                        chatEndpointApi: this.chatEndpointApi,
                        TimeChat: new Date()
                    };

                //send
                HttpService.Post(this.chatEndpointApi + '/restapi/chat/saveMessage', dataBody)
                    .then(res => {
                        debugger;
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

                            // Emit to client
                            MessagingSoketIO.send(dataBody, 'CLIENT-SEND-MESSAGE');

                            // cập nhật trang thái Done
                            this.updateChatStatus(chatID, EnumName.E_DONE);

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
                        debugger;
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
        try {
            const options = { quality: 0.5, base64: true };
            const data = await camera.takePictureAsync(options);

            const file = {
                data: data.base64,
                type: 'image/jpeg',
                fileSize: data.height * data.width * 4,
                temp: true
            };
            console.log(file);

            this.setState({ imageCamera: file });
        } catch (error) {
            console.log(error);
        }
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
            //this.openActionSelectImages()
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
                    console.log(response.fileSize * 0.000001, response.fileSize);
                    if (response.fileSize && response.fileSize * 0.000001 >= 4) {
                        ToasterSevice.showWarning('HRM_File_Size_Less_4');
                        return;
                    }

                    this.sendMessaging(response);
                }
            });
        }
    };
    //#endregion

    renderInput = () => {
        const { contentChat, dataItem, isActiveNew32 } = this.state;
        if (dataItem) {
            if ((dataItem.IsAccept == null || dataItem.IsAccept == false) && isActiveNew32) {
                return this.renderButtonAccept();
            } else {
                return (
                    <View style={styles.viewSend}>
                        <TextInput
                            ref={refSearch => (this.refSearch = refSearch)}
                            onClearText={() => this.changeContent('')}
                            placeholder={'Aa'}
                            onChangeText={text => this.changeContent(text)}
                            value={contentChat}
                            // returnKeyType={''}
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

    renderButtonAccept = () => {
        const { dataItem, isUserRequestAcceptChat } = this.state;
        if (isUserRequestAcceptChat == null) {
            return <View />;
        } else if (dataItem.IsAccept == null) {
            // User chat chưa được accept
            return (
                <View style={styles.styViewBtnAccept}>
                    <VnrText
                        style={[styleSheets.text, styles.styTextInfoAccept]}
                        i18nKey={'HRM_AppChat_TitleRequestAccept'}
                    />
                    <TouchableOpacity
                        style={[styles.styBtnAccept, styles.styBtnRequestAccept]}
                        onPress={() => this.onRequestAccept(dataItem.TopicID)}
                    >
                        <IconSend color={Colors.white} size={Size.iconSize} />
                        <VnrText
                            style={[styleSheets.lable, styles.styTextBtnAccept]}
                            i18nKey={'HRM_AppChat_ButtonRequestAccept'}
                        />
                    </TouchableOpacity>
                </View>
            );
        } else if (dataItem.IsAccept == false) {
            // đã gửi yêu cầu
            if (isUserRequestAcceptChat == true) {
                // User login là user gửi yêu cầu
                return (
                    <View style={styles.styViewBtnAccept}>
                        <VnrText
                            style={[styleSheets.text, styles.styTextInfoAccept]}
                            i18nKey={'HRM_AppChat_TitleWatingAccept'}
                        />
                        <View style={[styles.styBtnAccept, styles.styBtnWattingAccept]}>
                            <IconChat color={Colors.gray_8} size={Size.iconSize} />
                            <VnrText
                                style={[styleSheets.lable, styles.styTextWattingAccept]}
                                i18nKey={'HRM_AppChat_ButtonWatingAccept'}
                            />
                        </View>
                    </View>
                );
            } else if (isUserRequestAcceptChat == false) {
                // User login là user [được] gửi yêu cầu
                return (
                    <TouchableOpacity
                        style={styles.styViewBtnAccept}
                        onPress={() => this.onSentAccept(dataItem.TopicID)}
                    >
                        <VnrText
                            style={[styleSheets.text, styles.styTextInfoAccept]}
                            i18nKey={'HRM_AppChat_TitleAccept'}
                        />
                        <View style={[styles.styBtnAccept, styles.styBtnSentAccept]}>
                            <IconChat color={Colors.white} size={Size.iconSize} />
                            <VnrText
                                style={[styleSheets.lable, styles.styTextBtnAccept]}
                                i18nKey={'HRM_AppChat_ButtonAccept'}
                            />
                        </View>
                    </TouchableOpacity>
                );
            }
        }
    };

    renderContent = () => {
        const { isRefreshListChat, listChat, dataItem, isActiveNew32 } = this.state;
        if (listChat !== null) {
            return (
                <View style={[styles.chatContent]}>
                    <MessagingChatList
                        ref={ref => (this.refScrollChat = ref)}
                        detail={{
                            dataLocal: false,
                            screenDetail: ScreenName.ChatFriend,
                            screenName: ScreenName.ChatFriend
                        }}
                        isRefreshListChat={isRefreshListChat}
                        dataLocal={listChat}
                        dataRecord={dataItem}
                        sendMessaging={this.sendMessaging}
                        showMoreChat={this.showMoreChat}
                        valueField="ID"
                    />
                </View>
            );
        } else {
            return <VnrLoading size={'large'} />;
        }
    };

    getTopicByID = () => {
        const databody = {
                TopicID: this.agent.TopicID,
                UserID: this.userid
            },
            { isActiveNew32 } = this.state;

        let _params = this.props.navigation.state.params,
            { dataItem } = _params;

        HttpService.Post(`${this.chatEndpointApi}/restapi/Chat/GetTopicByID`, databody).then(res => {
            if (res && Object.keys(res).length > 0) {
                const mapItem = {
                    ...this.agent,
                    ...res
                    //IsAccept: false
                };

                this.agent = { ...mapItem };
                dataItem = { ...mapItem };

                this.setState(
                    {
                        listChat:
                            dataItem.ListMessage && dataItem.ListMessage.Data ? [...dataItem.ListMessage.Data] : [],
                        status: dataItem.Status ? dataItem.Status : null,
                        dataItem: dataItem,
                        isLoading: false
                    },
                    () => {
                        // Nếu chưa được accept thì kiểm tra user nào yêu cầu
                        if ((dataItem.IsAccept == null || dataItem.IsAccept == false) && isActiveNew32) {
                            this.checkUserRequestAccept(dataItem.TopicID);
                        }

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
                ToasterSevice.showError('Error connect!!!', 4000);
            }
        });
    };

    onRequestAccept = TopicID => {
        const databody = { TopicID: TopicID, IsAccept: false },
            { getListTopic } = this.props.navigation.state.params;
        HttpService.Post(`${this.chatEndpointApi}/restapi/Chat/UpdateTopicByID`, databody).then(res => {
            this.sendMessaging({
                type: EnumName.E_SYSTEM,
                contentChat: `${dataVnrStorage.currentUser.info.FullName} đã gửi lời mời trò chuyện!`
            });

            this.setState({ isLoading: true }, () => {
                this.getTopicByID();
            });

            // relaod DS
            getListTopic();
        });
    };

    onSentAccept = TopicID => {
        const databody = { TopicID: TopicID, IsAccept: true },
            { getListTopic } = this.props.navigation.state.params;
        HttpService.Post(`${this.chatEndpointApi}/restapi/Chat/UpdateTopicByID`, databody).then(res => {
            this.sendMessaging({
                type: EnumName.E_SYSTEM,
                contentChat: 'Bạn có thể bắt đầu trò chuyện'
            });

            this.setState({ isLoading: true }, () => {
                this.getTopicByID();
            });

            // relaod DS
            getListTopic();
        });
    };

    createTopic = () => {
        return HttpService.Post(`${this.chatEndpointApi}/restapi/chat/CreateTopicChatSingle`, {
            UserLoginID: this.userid,
            UserChatID: this.agent.UserID
        });
    };

    checkUserRequestAccept = TopicID => {
        HttpService.Post(`${this.chatEndpointApi}/restapi/Chat/CheckIsUserSendRequest`, {
            UserLoginID: this.userid,
            TopicID: TopicID
        }).then(res => {
            // console.log(res, ';CheckIsUserSendRequest')
            this.setState({
                isUserRequestAcceptChat: res
            });
        });
    };

    componentDidMount() {
        const { isActiveNew32 } = this.state;
        let _params = this.props.navigation.state.params,
            { dataItem } = _params,
            { TopicID } = dataItem;
        if (dataItem) {
            dataItem = {
                ...dataItem,
                topicID: dataItem.TopicID
            };

            //tạo topicID nếu chưa có
            if (!TopicID || TopicID === '') {
                this.createTopic().then(res => {
                    if (res && res.success == true) {
                        const mapItem = {
                            ...this.agent,
                            ...res.data
                            //IsAccept: false
                        };

                        // console.log(mapItem, 'mapItem')

                        this.agent = { ...mapItem };
                        dataItem = { ...mapItem };

                        this.setState(
                            {
                                listChat:
                                    dataItem.ListMessage && dataItem.ListMessage.Data
                                        ? [...dataItem.ListMessage.Data]
                                        : [],
                                status: dataItem.Status ? dataItem.Status : null,
                                dataItem: dataItem,
                                isLoading: false
                            },
                            () => {
                                debugger;
                                // Nếu chưa được accept thì kiểm tra user nào yêu cầu
                                if ((dataItem.IsAccept == null || dataItem.IsAccept == false) && isActiveNew32) {
                                    this.checkUserRequestAccept(dataItem.TopicID);
                                }

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
                            }
                            // tesst nhows xoa
                            // () => { this.getTopicByID() }
                        );
                    } else {
                        ToasterSevice.showError('Error connect!!!', 4000);
                    }
                });
            } else {
                this.setState(
                    {
                        listChat:
                            dataItem.ListMessage && dataItem.ListMessage.Data ? [...dataItem.ListMessage.Data] : [],
                        status: dataItem.Status ? dataItem.Status : null,
                        dataItem: dataItem
                    },
                    () => {
                        // this.getTopicByID();
                        // console.log(dataItem, 'dataItem')
                        // Nếu chưa được accept thì kiểm tra user nào yêu cầu
                        if ((dataItem.IsAccept == null || dataItem.IsAccept == false) && isActiveNew32) {
                            this.checkUserRequestAccept(dataItem.TopicID);
                        }

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
                    }
                );
            }
        }
    }

    render() {
        const { imageCamera, typeCamera, isvisibleModalCamara } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView} style={[styles.container]}>
                {this.renderHeader()}
                {Platform.OS == 'android' ? (
                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.keyboardContent}
                        extraScrollHeight={20} // khoang cach
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
    },
    container: {
        backgroundColor: Colors.white,
        flex: 1
    },
    headerView_content__text: {
        color: Colors.gray_10,
        fontWeight: '500'
    },
    viewStatus_text: {
        fontWeight: '500',
        color: Colors.green,
        marginRight: 3,
        fontSize: Size.text - 4
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
    },
    headerView_bnt__more: {
        height: '100%',
        width: Size.iconSizeHeader + 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    chatContent: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? Size.headerHeight : Size.headerHeight - 25,
        backgroundColor: Colors.gray_3
    },
    viewSend: {
        // maxHeight: MAX_HEIGHT_INPUT_SEND,
        height: MIN_HEIGHT_INPUT_SEND,
        minHeight: MIN_HEIGHT_INPUT_SEND,
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderTopColor: Colors.gray_5,
        borderTopWidth: 0.5,
        paddingLeft: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewSend_content: {
        flex: 1,
        // height: '100%',
        paddingVertical: 10
    },
    viewSend_bnt: {
        width: WIDTH_BNT_SEND

        // backgroundColor: 'red',
        // paddingHorizontal: 16,
        // paddingLeft: 16
    },
    viewSend_bnt__chillrent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    styViewBtnAccept: {
        padding: Size.defineSpace * 2,
        backgroundColor: Colors.gray_3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styTextInfoAccept: {
        textAlign: 'center',
        color: Colors.gray_8,
        marginBottom: Size.defineSpace
    },
    styBtnWattingAccept: {
        backgroundColor: Colors.gray_5
    },
    styBtnRequestAccept: {
        backgroundColor: Colors.primary
    },
    styBtnSentAccept: {
        backgroundColor: Colors.warning
    },
    styBtnAccept: {
        flexDirection: 'row',
        justifyContent: 'center',

        borderRadius: 8,

        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace
    },
    styTextWattingAccept: {
        marginLeft: Size.defineHalfSpace,
        color: Colors.gray_8
    },
    styTextBtnAccept: {
        marginLeft: Size.defineHalfSpace,
        color: Colors.white
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
