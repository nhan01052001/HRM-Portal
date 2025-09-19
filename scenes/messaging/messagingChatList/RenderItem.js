import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, Size, styleSheets } from '../../../constants/styleConfig';
import moment from 'moment';
import Vnr_Function from '../../../utils/Vnr_Function';
import { translate } from '../../../i18n/translate';
import { IconRadioUnCheck, IconRefresh } from '../../../constants/Icons';
import VnrText from '../../../components/VnrText/VnrText';
import { EnumName } from '../../../assets/constant';
import ViewImg from '../../../components/ViewImg/ViewImg';
import { dataVnrStorage } from '../../../assets/auth/authentication';
export default class RenderItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // componentWillReceiveProps(nextProps) {
    //     // if (nextProps.isPullToRefresh !== this.props.isPullToRefresh) {
    //     //     this.setRightAction(nextProps)
    //     // }
    // }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.dataItem.Status != this.props.dataItem.Status) {
            console.log(nextProps.dataItem.Status, this.props.dataItem.Status, this.props.dataItem.Content);
            return true;
        } else {
            return false;
        }
    }

    rightActionsEmpty = () => {
        return <View style={{ width: 0 }} />;
    };

    renderAvatar = () => {
        const { dataItem } = this.props,
            firstChar = dataItem && dataItem.UserInfoName ? dataItem.UserInfoName.split('')[0] : '',
            randomColor = Vnr_Function.randomColor(firstChar),
            { PrimaryColor, SecondaryColor } = randomColor;

        return (
            <View style={styles.viewAvatar}>
                {dataItem.ImageUser ? (
                    <Image source={dataItem.ImageUser} style={styles.imgAvatar} />
                ) : (
                    <View style={[styles.imgAvatar, { backgroundColor: SecondaryColor }]}>
                        <Text
                            style={[
                                styleSheets.textFontMedium,
                                styles.avatar_TextName,
                                {
                                    color: PrimaryColor
                                }
                            ]}
                        >
                            {firstChar.toUpperCase()}
                        </Text>
                    </View>
                )}

                <View style={styles.buttonStatus} />
            </View>
        );
    };

    renderContentIsFriend = () => {
        const { dataItem, dataRecord, isChatGroup, checkTimeShowIsFriend } = this.props;
        let firstChar = '',
            randomColor = {};
        let checkTimeChat = dataItem.TimeChat != null ? moment(dataItem.TimeChat).format('DD/MM/YYYY HH:mm') : '',
            formatTimeChat = null,
            pathImageAvatar = null;

        if (!checkTimeShowIsFriend[checkTimeChat]) {
            // if (dataItem.Status === EnumName.E_DONE)
            checkTimeShowIsFriend[checkTimeChat] = true;
            formatTimeChat = dataItem.TimeChat != null ? moment(dataItem.TimeChat).format('HH:mm') : 'null';
        }

        if (isChatGroup) {
            let fullName = dataItem && dataItem.UserInfoName ? dataItem.UserInfoName.split(' ') : '',
                lastName = fullName[fullName.length - 1];

            firstChar = lastName ? lastName.split('')[0] : '';

            randomColor = Vnr_Function.randomColor(firstChar);
            pathImageAvatar = dataItem.ImageUser;
        } else {
            let fullName = dataRecord && dataRecord.NameView ? dataRecord.NameView.split(' ') : '',
                lastName = fullName[fullName.length - 1];

            firstChar = lastName ? lastName.split('')[0] : '';

            randomColor = Vnr_Function.randomColor(firstChar);
            pathImageAvatar = dataRecord.Image;
        }

        return (
            <View style={styles.viewChatFriend}>
                <View style={styles.viewAvatar}>
                    {pathImageAvatar ? (
                        <Image source={{ uri: pathImageAvatar }} style={styles.imgAvatar} />
                    ) : (
                        <View style={[styles.imgAvatar, { backgroundColor: randomColor.SecondaryColor }]}>
                            <Text
                                style={[
                                    styleSheets.textFontMedium,
                                    styles.avatar_TextName,
                                    {
                                        color: randomColor.PrimaryColor
                                    }
                                ]}
                            >
                                {firstChar}
                            </Text>
                        </View>
                    )}
                </View>
                <View style={styles.contentChat}>
                    <View style={styles.contentChat_time}>
                        <Text
                            style={[
                                styleSheets.text,
                                styles.contentChat_name__text,
                                {
                                    color: randomColor.PrimaryColor
                                }
                            ]}
                        >
                            {isChatGroup ? dataItem.UserInfoName : ''}
                        </Text>
                        {formatTimeChat != null && (
                            <Text style={[styleSheets.textFontMedium, styles.contentChat_time__text]}>
                                {formatTimeChat}
                            </Text>
                        )}
                    </View>
                    {this.renderContent()}
                </View>
            </View>
        );
    };

    tryReSendMessage = () => {
        const { sendMessaging, dataItem } = this.props;
        if (sendMessaging && typeof sendMessaging == 'function') {
            sendMessaging(
                { type: null, contentChat: dataItem.Content },
                true, // check gửi lại tin nhắn (E_EROOR)
                dataItem.ID
            );
        }
    };

    renderContentIsYou = () => {
        const { dataItem, checkTimeShowIsYou } = this.props;
        let checkTimeChat = dataItem.TimeChat != null ? moment(dataItem.TimeChat).format('DD/MM/YYYY HH:mm') : '',
            formatTimeChat = null;
        // console.log(checkTimeShowIsYou, 'checkTimeShowIsYou')
        if (!checkTimeShowIsYou[checkTimeChat]) {
            (dataItem.Status == undefined || dataItem.Status === EnumName.E_DONE) &&
                (checkTimeShowIsYou[checkTimeChat] = true);
            formatTimeChat = dataItem.TimeChat != null ? moment(dataItem.TimeChat).format('HH:mm') : 'null';
        }

        return (
            <View style={styles.viewChatYou}>
                <View
                    style={[
                        styles.contentChatYou,
                        dataItem.Type && {
                            backgroundColor: Colors.white
                        }
                    ]}
                >
                    <View style={styles.contentChat_time}>
                        <View />
                        {formatTimeChat != null && (
                            <Text style={[styleSheets.textFontMedium, styles.contentChat_time__text]}>
                                {formatTimeChat}
                            </Text>
                        )}
                    </View>
                    {this.renderContent()}
                </View>

                {dataItem.Status == EnumName.E_PROGRESS && (
                    <View style={[styles.viewStatusChat]}>
                        <IconRadioUnCheck size={Size.text} color={Colors.gray_5} />
                    </View>
                )}

                {dataItem.Status == EnumName.E_ERROR && (
                    <TouchableOpacity style={styles.viewTryAgain} onPress={() => this.tryReSendMessage(dataItem.ID)}>
                        <IconRefresh size={Size.text} color={Colors.red} />
                        <VnrText style={[styleSheets.text, styles.viewTryAgainText]} i18nKey={'HRM_Common_TryAgain'} />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    renderContent = () => {
        const { dataItem } = this.props;

        if (dataItem.Type == 'image') {
            return (
                <ViewImg source={dataItem.Content} showChildren>
                    <Image style={styles.viewChatImage} resizeMode={'contain'} source={{ uri: dataItem.Content }} />
                </ViewImg>
            );
        } else {
            return <Text style={[styleSheets.text, styles.contentChat_time__content]}>{dataItem.Content}</Text>;
        }
    };

    renderDateAndSystem = () => {
        const { dataItem } = this.props;

        if (dataItem.Type === EnumName.E_DATE) {
            const date = dataItem.TimeChat,
                dateFormat = `${translate(`E_${moment(date).format('dddd')}`.toUpperCase())}, ${moment(date).format(
                    'DD'
                )} ${translate('Month_Lowercase')} ${moment(date).format('M')}`;
            return (
                <View style={styles.viewDateStart}>
                    <View style={styles.viewDateStart_line} />
                    <View>
                        <Text style={[styleSheets.textFontMedium, styles.viewDateStart_text]}>{dateFormat}</Text>
                    </View>
                    <View style={styles.viewDateStart_line} />
                </View>
            );
        } else if (dataItem.Type === EnumName.E_SYSTEM) {
            return (
                <View style={styles.viewDateStart}>
                    <View style={styles.viewDateStart_line} />
                    <View>
                        <Text style={[styleSheets.textFontMedium, styles.viewDateStart_text]}>{dataItem.Content}</Text>
                    </View>
                    <View style={styles.viewDateStart_line} />
                </View>
            );
        }
    };

    render() {
        const {
            dataItem,
            isSelect,
            renderRowConfig,
            index,
            listItemOpenSwipeOut,
            isOpenAction,
            rowActions
        } = this.props;

        // IsYou == true mới kiểm tra xem ai chat
        if (
            dataItem.IsYou != true &&
            dataVnrStorage &&
            dataVnrStorage.currentUser.headers &&
            dataVnrStorage.currentUser.headers.userid
        )
            dataItem.IsYou = dataItem.UserID === dataVnrStorage.currentUser.headers.userid;

        return (
            <Swipeable
            // ref={ref => {
            //     this.Swipe = ref;
            //     if (listItemOpenSwipeOut.findIndex((value) => { return value["ID"] == index }) < 0) {
            //         listItemOpenSwipeOut.push({ "ID": index, "value": ref });
            //     } else {
            //         listItemOpenSwipeOut[index].value = ref;
            //     }
            // }}
            //overshootRight={false}
            //renderRightActions={(rowActions != null && !isOpenAction) ? this.rightActions : this.rightActionsEmpty}
            //friction={0.6}
            >
                {dataItem.Type === EnumName.E_DATE || dataItem.Type === EnumName.E_SYSTEM
                    ? this.renderDateAndSystem()
                    : dataItem.IsYou
                        ? this.renderContentIsYou()
                        : this.renderContentIsFriend()}
            </Swipeable>
        );
    }
}

const HIGHT_AVATAR = Size.deviceWidth >= 1024 ? 80 : Size.deviceWidth * 0.08,
    MAX_WIDTH_CONTENT_CHAT = Size.deviceWidth * 0.8,
    PADDING_DEFINE = 16;
const styles = StyleSheet.create({
    viewChatFriend: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 16,
        maxWidth: MAX_WIDTH_CONTENT_CHAT,
        marginBottom: Size.deviceWidth >= 1024 ? 20 : 13
        // marginRight: PADDING_DEFINE
    },
    viewChatImage: {
        width: '100%',
        aspectRatio: 1
    },
    contentChat: {
        // flex: 1,
        backgroundColor: Colors.white,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderTopLeftRadius: 16,
        borderTopEndRadius: 16,
        borderBottomEndRadius: 16,
        borderColor: Colors.gray_5,
        borderWidth: 0.5
    },
    viewChatYou: {
        // flexDirection: 'row',
        paddingHorizontal: 25,
        maxWidth: MAX_WIDTH_CONTENT_CHAT,
        marginBottom: 12,
        justifyContent: 'flex-end',
        marginLeft: Size.deviceWidth - MAX_WIDTH_CONTENT_CHAT,
        alignSelf: 'flex-end'
        // alignItems: 'flex-end'
    },
    viewStatusChat: {
        // marginLeft: 7
        position: 'absolute',
        right: 5,
        bottom: 0
    },
    viewTryAgain: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderColor: Colors.gray_5,
        borderWidth: 0.5,
        paddingHorizontal: 8,
        borderRadius: 10,
        paddingVertical: 3,
        marginTop: 5
    },
    viewTryAgainText: {
        color: Colors.gray_9,
        fontSize: Size.text - 2,
        marginLeft: 5
    },
    contentChatYou: {
        backgroundColor: Colors.primary_transparent_8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderTopLeftRadius: 16,
        borderTopEndRadius: 16,
        borderBottomStartRadius: 16,
        borderColor: Colors.primary_5,
        borderWidth: 0.5,
        // width: 'auto'
        alignSelf: 'flex-end'
    },
    viewAvatar: {
        borderRadius: 8,
        marginRight: 8,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    avatar: {
        height: HIGHT_AVATAR,
        width: HIGHT_AVATAR,
        backgroundColor: Colors.gray_3,
        borderRadius: 18 //HIGHT_AVATAR / 3,
    },
    imgAvatar: {
        height: HIGHT_AVATAR,
        width: HIGHT_AVATAR,

        borderRadius: 8, // HIGHT_AVATAR / 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.gray_5
    },

    avatar_TextName: {
        fontWeight: '500',
        fontSize: Size.text
    },
    contentChat_time: {
        //alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2
    },
    contentChat_time__text: {
        color: Colors.gray_7,
        fontSize: Size.text - 5,
        marginLeft: 15
    },
    contentChat_time__content: {
        color: Colors.gray_10,
        fontWeight: 'normal',
        fontSize: Size.text - 2
        // lineHeight: 17,
        // paddingVertical: 3
    },
    contentChat_name__text: {
        fontSize: Size.text - 3,
        color: Colors.primary
    },
    viewDateStart: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: PADDING_DEFINE,
        marginVertical: PADDING_DEFINE
    },
    viewDateStart_line: {
        flex: 1,
        height: 0.5,
        backgroundColor: Colors.gray_5
    },
    viewDateStart_text: {
        textAlign: 'center',
        color: Colors.gray_7,
        fontSize: Size.text - 2,
        marginHorizontal: PADDING_DEFINE
    }
});
