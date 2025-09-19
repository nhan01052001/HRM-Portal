import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Colors, Size, styleSheets, styleSafeAreaView } from '../../constants/styleConfig';
import { dataVnrStorage } from '../../assets/auth/authentication';
import { IconNotify, IconDelete } from '../../constants/Icons';
import VnrText from '../../components/VnrText/VnrText';
import { SafeAreaView } from 'react-navigation';
import HttpService from '../../utils/HttpService';
import { AlertSevice } from '../../components/Alert/Alert';
import { EnumIcon } from '../../assets/constant';
import DrawerServices from '../../utils/DrawerServices';
import MessagingImageList from './messagingImageList/MessagingImageList';

export default class OptionFriend extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isEnabled: false
        };

        this.chatEndpointApi = dataVnrStorage.apiConfig.chatEndpointApi;
    }

    router = roouterName => {
        const { navigation } = this.props;
        navigation.navigate(roouterName);
    };

    toggleSwitchNotify = () => {
        this.setState({
            isSwichNotify: !this.state.isSwichNotify
        });
    };

    handelDelete = () => {};

    render() {
        const { isSwichNotify } = this.state,
            { dataItem } = this.props.navigation.state.params;
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styles.container}>
                    {/* <View style={styles.bnt_action}>
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
                trackColor={{ false: Colors.gray_5, true: Colors.primary }}
                thumbColor={Colors.white}
                ios_backgroundColor={Colors.gray_5}
                onValueChange={this.toggleSwitchNotify}
                value={isSwichNotify}
              />
            </View>
          </View> */}

                    <TouchableOpacity
                        style={styles.bnt_action}
                        onPress={() => {
                            AlertSevice.alert({
                                iconType: EnumIcon.E_WARNING,
                                textRightButton: 'HRM_System_Resource_Sys_Delete',
                                textLeftButton: 'CANCEL',
                                title: 'HRM_Title_Alert_Delete_Conversation',
                                message: 'HRM_Title_Alert_Delete_Conversation_Message',
                                onCancel: () => {},
                                onConfirm: () => {
                                    debugger;
                                    const { dataItem, getListTopic } = this.props.navigation.state.params;
                                    HttpService.Post(`${this.chatEndpointApi}/restapi/chat/RemoveUserOffTopic`, {
                                        TopicID: dataItem.TopicID,
                                        UserID: dataItem.UserID
                                    });

                                    if (getListTopic && typeof getListTopic === 'function') {
                                        getListTopic();
                                    }

                                    DrawerServices.navigate('Messaging');
                                }
                            });
                        }}
                    >
                        <View style={styles.bnt_action__left}>
                            <View style={styles.bnt_action__IconLeft}>
                                <IconDelete size={Size.iconSize - 2} color={Colors.gray_10} />
                            </View>
                            <VnrText
                                style={[styleSheets.text, styles.bnt_action__text]}
                                i18nKey={'HRM_Chat_Action_Delete_Conversation'}
                            />
                        </View>
                        {/* {item.IconRight} */}
                    </TouchableOpacity>
                </View>
                <View style={styles.viewLibary}>
                    <View style={styles.viewLibary_title}>
                        <VnrText
                            style={[styleSheets.textFontMedium, styles.viewLibary_title__text]}
                            i18nKey={'HRM_Chat_Action_Image'}
                        />
                    </View>
                    <MessagingImageList
                        api={{
                            urlApi: `${this.chatEndpointApi}/restapi/chat/GetImageByTopicID`,
                            type: 'E_POST',
                            dataBody: {
                                TopicID: dataItem.TopicID,
                                PageSize: 20
                            }
                        }}
                        valueField="ID"
                    />
                </View>
            </SafeAreaView>
        );
    }
}

const SIZE_IMAGE_LIBARY = Size.deviceWidth >= 1024 ? (Size.deviceWidth - 9) / 4 : (Size.deviceWidth - 6) / 3;
const styles = StyleSheet.create({
    container: {
        paddingBottom: 24,
        paddingHorizontal: 16,
        backgroundColor: Colors.white
    },
    bnt_action: {
        flexDirection: 'row',
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        height: Size.deviceWidth * 0.13,
        maxHeight: 70,
        minHeight: 40,
        alignItems: 'center'
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
    viewLibary: {
        flex: 1
    },
    viewLibary_title: {
        paddingHorizontal: 16,
        marginBottom: 12
    },
    viewLibary_title__text: {
        fontWeight: '500'
    },
    libary: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    libary_imge: {
        height: SIZE_IMAGE_LIBARY,
        width: SIZE_IMAGE_LIBARY,
        marginBottom: 3
    }
});
