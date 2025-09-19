/* eslint-disable no-unused-vars */
import React from 'react';
import { View, TouchableOpacity, Easing, Animated, Platform } from 'react-native';
import { IconEditSquare, IconPublish, IconUndo, IconBack, IconCreate, IconRefresh } from '../../constants/Icons';
import { Colors, Size, styleSheets } from '../../constants/styleConfig';
import { translate } from '../../i18n/translate';
import { createStackNavigator } from 'react-navigation-stack';
import { TransitionPresets } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import ListButtonMenuRight from '../../components/ListButtonMenuRight/ListButtonMenuRight';
import FunctionCommon from './FunctionCommon';

import HomeScene from '../../scenes/home/Home';

import { AlertSevice } from '../../components/Alert/Alert';
import { ToasterSevice } from '../../components/Toaster/Toaster';
import HttpService from '../../utils/HttpService';
import { VnrLoadingSevices } from '../../components/VnrLoading/VnrLoadingPages';
import DrawerServices from '../../utils/DrawerServices';

//#region [common/Messaging]
import MessageChatBot from '../../scenes/messaging/messageChatBot/MessageChatBot';
import Messaging from '../../scenes/messaging/Messaging';
import AddFriendToGroup from '../../scenes/messaging/AddFriendToGroup';
import ChatFriend from '../../scenes/messaging/ChatFriend';
import ChatGroup from '../../scenes/messaging/ChatGroup';
import CreateGroup from '../../scenes/messaging/CreateGroup';
import ImageLibary from '../../scenes/messaging/ImageLibary';
import OptionFriend from '../../scenes/messaging/OptionFriend';
import OptionGroup from '../../scenes/messaging/OptionGroup';
//#endregion

const MessagingStack = createStackNavigator(
    {
        MessageChatBot: {
            screen: MessageChatBot,
            navigationOptions: ({ navigation }) =>
                FunctionCommon.navigationOptionsConfigHeaderNull(navigation, 'HRM_Chat_Title_Message')
        }
        // Messaging: {
        //     screen: Messaging,
        //     navigationOptions: ({ navigation }) => (FunctionCommon.navigationOptionsConfigScreenTabbar(navigation, 'HRM_Chat_Title_Message')),
        // },
        // AddFriendToGroup: {
        //     screen: AddFriendToGroup,
        //     navigationOptions: ({ navigation }) => (FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Chat_Title_Add_People')),
        // },
        // ChatFriend: {
        //     screen: ChatFriend,
        //     navigationOptions: ({ navigation }) => (FunctionCommon.navigationOptionsConfigHeaderNull(navigation, 'ChatFriend')),
        // },
        // ChatGroup: {
        //     screen: ChatGroup,
        //     navigationOptions: ({ navigation }) => (FunctionCommon.navigationOptionsConfigHeaderNull(navigation, 'ChatGroup')),
        // },
        // CreateGroup: {
        //     screen: CreateGroup,
        //     navigationOptions: ({ navigation }) => (FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Chat_Create_Group')),
        // },
        // ImageLibary: {
        //     screen: ImageLibary,
        //     navigationOptions: ({ navigation }) => (FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Chat_Action_Image')),
        // },
        // OptionFriend: {
        //     screen: OptionFriend,
        //     navigationOptions: ({ navigation }) => (FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Chat_Title_Optional')),
        // },
        // OptionGroup: {
        //     screen: OptionGroup,
        //     navigationOptions: ({ navigation }) => (FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Chat_Title_Optional')),
        // },
    },
    {
        navigationOptions: ({ navigation }) => ({ tabBarVisible: false, gesturesEnabled: false }),
        transitionConfig: () => ({
            transitionSpec: {
                duration: 0
            }
        }),
        headerLayoutPreset: 'center',
        defaultNavigationOptions: {
            gesturesEnabled: false,
            animationEnabled: Platform.OS == 'ios' ? true : false
        }
    }
);

export default MessagingStack;
