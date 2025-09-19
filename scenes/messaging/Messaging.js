import React, { Component } from 'react';
import {
    FlatList,
    Keyboard,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Animated,
    TouchableWithoutFeedback,
    RefreshControl
} from 'react-native';
import { Colors, Size, styleSheets, styleSafeAreaView } from '../../constants/styleConfig';
import RenderItemChatFriendFilter from './messagingList/RenderItemChatFriendFilter';
import DrawerServices from '../../utils/DrawerServices';
import { dataVnrStorage } from '../../assets/auth/authentication';
import { IconSearch, IconDown, IconDot, IconGroupUser } from '../../constants/Icons';
import VnrTextInput from '../../components/VnrTextInput/VnrTextInput';
import VnrText from '../../components/VnrText/VnrText';
import { translate } from '../../i18n/translate';
import { SafeAreaView } from 'react-navigation';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import MessagingList from './messagingList/MessagingList';
import { ScreenName, EnumName } from '../../assets/constant';
import MessagingSoketIO from '../../utils/MessagingSoketIO';
import HttpService from '../../utils/HttpService';
// import ActionSheet from 'react-native-actionsheet';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import EmptyData from '../../components/EmptyData/EmptyData';
import { ToasterSevice } from '../../components/Toaster/Toaster';
import { AlertSevice } from '../../components/Alert/Alert';
import { EnumIcon } from '../../assets/constant';
import Vnr_Function from '../../utils/Vnr_Function';

const HEGHT_SEARCH = Size.deviceheight >= 1024 ? 55 : 45,
    ActiveColor = Colors.green;

export default class Messaging extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            isFilter: false,
            isRefreshList: false,
            isLoadingFilter: false,
            animatedWidthSearch: new Animated.Value(Size.deviceWidth - 32),
            isRefreshAgentFriend: false,
            isRefreshAgentGroup: false,
            dataFilter: [],
            topicSingle: null,
            topicGroup: null,
            isLoadingTopic: true,
            refreshing: false,
            currAgent: {
                NameView: dataVnrStorage.currentUser.info.FullName,
                Status: null
            }
        };

        this.refSearch = null;
        this.widthButtonCancel = 40;
        this.sheetActionsStatus = [];

        //lưu lại list agent từ server
        this.arrAgent = [];
        this.userId = dataVnrStorage.currentUser.headers.userid;
        this.chatEndpointApi = dataVnrStorage.apiConfig.chatEndpointApi;

        //connect socket.io
        MessagingSoketIO.connect(this.userId);

        //function lắng nghe nội dung chat
        MessagingSoketIO.listen(data => {
            debugger;
            //biến update tin remind
            let isPlusRemind = true;

            //nếu user login gửi thì không update
            if (data.userID == this.userId) {
                isPlusRemind = false;
            }

            this.updateLastMess(data, isPlusRemind);
        }, 'SERVER-SEND-MESSAGE');

        //function lắng nghe tất cả socket từ server => update Status
        MessagingSoketIO.listen(arrAgent => {
            this.arrAgent = [...arrAgent];

            let { topicSingle, isRefreshAgentFriend } = this.state;

            if (topicSingle && topicSingle.Data.length) {
                let compareStatus = this.compareStatus(arrAgent, topicSingle.Data);

                this.setState({
                    topicSingle: {
                        ...topicSingle,
                        Data: compareStatus
                    },
                    isRefreshAgentFriend: !isRefreshAgentFriend
                });
            }
        }, 'SERVER-SEND-AGENT');

        //function lắng nghe user thay đổi trạng thái (on/off/busy)
        MessagingSoketIO.listen(data => {
            const { topicSingle, isRefreshAgentFriend } = this.state;

            if (topicSingle && topicSingle.Data.length) {
                let toData = [...topicSingle.Data],
                    findByUserID = toData.find(item => item.UserID == data.UserID);

                if (findByUserID) {
                    findByUserID.Status = data.Status;

                    this.setState({
                        topicSingle: {
                            ...topicSingle,
                            Data: [...toData]
                        },
                        isRefreshAgentFriend: !isRefreshAgentFriend
                    });
                }
            }
        }, 'SERVER-CHANGE-STATUS');
    }

    //compare tất cả socket của 1 user vào 1 mảng
    //param: arrAgent - list sockets từ server Node
    //param: topicSingle - list users từ HRM
    compareStatus(arrAgent, topicSingle) {
        return topicSingle.map(item => {
            //find agent theo UserID
            let findAgent = arrAgent && arrAgent.find(itemAgent => itemAgent.userID == item.UserID);

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

    changeSearchBar = text => {
        this.setState({ searchText: text, isLoadingFilter: true }, () => this.filterFriend());
    };

    filterFriend = async () => {
        const { searchText, dataUserFilter } = this.state;
        const _getUserServer = await this.getUserServer(searchText);
        let compareStatus = this.compareStatus(this.arrAgent, [..._getUserServer]);
        this.setState({ dataUserFilter: compareStatus, isLoadingFilter: false });
    };

    _handleRefresh = () => {
        this.setState({ refreshing: true, page: 1 }, () => {
            setTimeout(() => {
                this.setState({ refreshing: false });
            }, 2000);
        });
    };

    handleUnhandledTouches() {
        Keyboard.dismiss();
        return false;
    }

    focusInputSearch = async () => {
        Animated.timing(this.state.animatedWidthSearch, {
            toValue: Size.deviceWidth - 48 - this.widthButtonCancel,
            duration: 200
        }).start();

        this.setState({ isLoadingFilter: true });
        const listUser = await this.getUserServer();
        if (listUser && Array.isArray(listUser) && listUser.length > 0) {
            let compareStatus = this.compareStatus(this.arrAgent, [...listUser]);
            this.setState({
                dataUserFilter: [...compareStatus],
                isFilter: true,
                isLoadingFilter: false
            });
        }
    };

    handleBlur = () => {
        Animated.timing(this.state.animatedWidthSearch, {
            toValue: Size.deviceWidth - 32,
            duration: 100
        }).start();
        this.setState({ isFilter: false, searchText: '' }, () => {
            this.refSearch && this.refSearch.blur();
        });
    };

    router = roouterName => {
        const { navigation } = this.props;
        navigation.navigate(roouterName, { setStateValidApi: this.setStateValidApi });
    };

    renderContentSearch = () => {
        const { dataUserFilter, isLoadingFilter } = this.state;
        const isNotAllowAddChat =
            dataVnrStorage.currentUser && dataVnrStorage.currentUser.info
                ? dataVnrStorage.currentUser.info.IsChat
                : false;
        const isGroupChat =
            dataVnrStorage.currentUser && dataVnrStorage.currentUser.info
                ? dataVnrStorage.currentUser.info.IsGroupChat
                : false;
        return (
            <TouchableWithoutFeedback onPress={() => this.handleUnhandledTouches()}>
                <View style={{ flex: 1, backgroundColor: Colors.gray_3 }}>
                    {(isNotAllowAddChat === false || isGroupChat === false) && (
                        <View style={styles.viewButtonAddGroup}>
                            <TouchableOpacity
                                style={styles.viewButtonAddGroup_bnt}
                                onPress={() =>
                                    DrawerServices.navigate('CreateGroup', {
                                        updateLastMess: this.updateLastMess,
                                        refreshTopicGroup: this.getListTopicGroup,
                                        dataStatus: this.sheetActionsStatus,
                                        dataAgent: this.arrAgent
                                    })
                                }
                            >
                                <IconGroupUser size={Size.iconSize} color={Colors.gray_10} />
                                <VnrText
                                    i18nKey={'HRM_Chat_Create_Group'}
                                    style={[styleSheets.textFontMedium, styles.viewButtonAddGroup_bnt_text]}
                                />
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={styles.contentFilter}>
                        {isLoadingFilter ? (
                            <VnrLoading size="large" isVisible={this.state.isLoadingFilter} />
                        ) : (
                            <FlatList
                                data={dataUserFilter}
                                ListHeaderComponent={() => (
                                    <View style={styles.styViewTitle}>
                                        <VnrText
                                            i18nKey={'HRM_Common_Search'}
                                            style={[styleSheets.text, styles.styTitleFilter]}
                                        />
                                    </View>
                                )}
                                renderItem={({ item, index }) => (
                                    <RenderItemChatFriendFilter
                                        dataItem={item}
                                        detail={{
                                            dataLocal: false,
                                            screenDetail: ScreenName.ChatFriend,
                                            screenName: ScreenName.MessagingFilter
                                        }}
                                    />
                                )}
                                keyExtractor={item => item['Id']}
                            />
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    getUserServer = userInfoName => {
        const isNotAllowAddChat =
            dataVnrStorage.currentUser && dataVnrStorage.currentUser.info
                ? dataVnrStorage.currentUser.info.IsChat
                : false;
        return HttpService.Post(`${this.chatEndpointApi}/restapi/chat/GettingUserServer`, {
            UserID: this.userId,
            UserInfoName: userInfoName ? userInfoName : null,
            IsPortalApp: true,
            IsNotAllowAddChat: isNotAllowAddChat
        });
    };

    getMessSinge = (dataBody = {}) => {
        const _dataBody = {
            ...{
                UserID: this.userId,
                PageSize: 4,
                Index: 1
            },
            ...dataBody
        };

        return HttpService.Post(`${this.chatEndpointApi}/restapi/chat/GetTopicAndMessSingle`, _dataBody);
    };

    getMessGroup = (dataBody = {}) => {
        const _dataBody = {
            ...{
                UserID: this.userId,
                PageSize: 4,
                Index: 1
            },
            ...dataBody
        };
        return HttpService.Post(`${this.chatEndpointApi}/restapi/chat/GetTopicAndMessGroup`, _dataBody);
    };

    showLessChatFriend = pageSize => {
        const { topicSingle, isRefreshAgentFriend } = this.state;

        // thu gọn DS về ban đầu
        topicSingle.Data = topicSingle.Data.splice(0, pageSize);
        this.setState({
            topicSingle,
            isRefreshAgentFriend: !isRefreshAgentFriend
        });
    };

    showMoreChatFriend = async (page, pageSize) => {
        try {
            // lấy thêm DS sách
            const { topicSingle, isRefreshAgentFriend } = this.state,
                _dataBody = {
                    Index: page,
                    PageSize: pageSize
                };

            const dataGroup = await this.getMessSinge(_dataBody);
            if (dataGroup && dataGroup.Data && Array.isArray(dataGroup.Data) && dataGroup.Data.length > 0) {
                topicSingle.Data = [...topicSingle.Data, ...dataGroup.Data];
                this.setState({
                    topicSingle,
                    isRefreshAgentFriend: !isRefreshAgentFriend
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    showLessChatGroup = pageSize => {
        const { topicGroup, isRefreshAgentGroup } = this.state;

        // thu gọn DS về ban đầu
        topicGroup.Data = topicGroup.Data.splice(0, pageSize);
        this.setState({
            topicGroup,
            isRefreshAgentGroup: !isRefreshAgentGroup
        });
    };

    showMoreChatGroup = async (page, pageSize) => {
        try {
            // lấy thêm DS sách
            const { topicGroup, isRefreshAgentGroup } = this.state,
                _dataBody = {
                    Index: page,
                    PageSize: pageSize
                };

            const dataSingle = await this.getMessGroup(_dataBody);
            if (dataSingle && dataSingle.Data && Array.isArray(dataSingle.Data) && dataSingle.Data.length > 0) {
                topicGroup.Data = [...topicGroup.Data, ...dataSingle.Data];
                this.setState({
                    topicGroup,
                    isRefreshAgentGroup: !isRefreshAgentGroup
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    getListTopicGroup = () => {
        // show loading
        this.setState({ isLoadingTopic: true });
        this.getMessGroup().then(dataGroup => {
            console.log(dataGroup, 'dataGroup');
            this.setState({
                topicGroup: dataGroup,
                isRefreshAgentGroup: !this.state.isRefreshAgentGroup,
                isLoadingTopic: false
            });
        });
    };

    getListTopicSingle = () => {
        const { topicSingle, isRefreshAgentFriend } = this.state;

        // show loading
        this.setState({ isLoadingTopic: true });
        this.getMessSinge().then(dataSingle => {
            //map status vào object
            let mapStatus = dataSingle.Data.map(item => {
                if (item.Status) {
                    let findStatus = this.sheetActionsStatus.find(itemStt => itemStt.value == item.Status);
                    if (findStatus) {
                        item = {
                            ...item,
                            StatusConfig: item.Status,
                            Status: { ...findStatus }
                        };
                    }
                }
                return item;
            });

            let compareStatus = this.compareStatus(this.arrAgent, [...mapStatus]);

            this.setState({
                topicSingle: {
                    ...topicSingle,
                    Data: [...compareStatus]
                },
                isRefreshAgentFriend: !isRefreshAgentFriend,
                isLoadingTopic: false
            });
        });
    };

    getListTopic = () => {
        // show loading
        // this.setState({ isLoadingTopic: true });
        const { isRefreshAgentFriend, isRefreshAgentGroup } = this.state;
        HttpService.MultiRequest([this.getMessSinge(), this.getMessGroup()]).then(dataTopic => {
            const [dataSingle, dataGroup] = dataTopic;

            if (
                (dataSingle && dataSingle.Data && Array.isArray(dataSingle.Data) && dataSingle.Data.length > 0) ||
                (dataGroup && dataGroup.Data && Array.isArray(dataGroup.Data) && dataGroup.Data.length > 0)
            ) {
                //map status vào object
                let mapStatus = dataSingle.Data.map(item => {
                    if (item.Status) {
                        let findStatus = this.sheetActionsStatus.find(itemStt => itemStt.value == item.Status);
                        if (findStatus) {
                            item = {
                                ...item,
                                StatusConfig: item.Status,
                                Status: { ...findStatus }
                            };
                        }
                    }
                    return item;
                });

                let compareStatus = this.compareStatus(this.arrAgent, [...mapStatus]);

                this.setState({
                    topicSingle: {
                        ...dataSingle,
                        Data: compareStatus
                    },
                    topicGroup: dataGroup,
                    isLoadingTopic: false,
                    refreshing: false,
                    isRefreshAgentGroup: !isRefreshAgentGroup,
                    isRefreshAgentFriend: !isRefreshAgentFriend
                });
            } else {
                this.getUserServer().then(listUser => {
                    if (listUser && Array.isArray(listUser) && listUser.length > 0) {
                        let mapStatus = this.compareStatus(this.arrAgent, listUser);

                        this.setState(
                            {
                                dataUserFilter: [...mapStatus],
                                isFilter: true,
                                isLoadingTopic: false,
                                refreshing: false
                            },
                            () => {
                                Animated.timing(this.state.animatedWidthSearch, {
                                    toValue: Size.deviceWidth - 48 - this.widthButtonCancel,
                                    duration: 200
                                }).start();
                            }
                        );
                    }
                });
            }
        });
    };

    openActionStatus = () => {
        this.ActionSheet.show();
    };

    //thay đổi trạng thái
    changeStatus = index => {
        const objStatus = this.sheetActionsStatus[index],
            { currAgent } = this.state;
        if (objStatus.value != 'E_CLOSE') {
            this.setState(
                {
                    currAgent: {
                        ...currAgent,
                        Status: { ...objStatus }
                    }
                },
                () => {
                    //emit status
                    let dataBody = {
                        Status: { ...objStatus },
                        UserID: this.userId,
                        chatEndpointApi: this.chatEndpointApi
                    };
                    MessagingSoketIO.send(dataBody, 'CLIENT-CHANGE-STATUS');
                }
            );
        }
    };

    //callback để update tin gửi mới nhất từ ChatFriend, ChatGroup
    updateLastMess = (data, isPlusRemind, isOnlyUpdateRemind) => {
        debugger;
        let { topicSingle, topicGroup, isRefreshAgentFriend, isRefreshAgentGroup } = this.state,
            findTopic = topicSingle.Data.find(item => item.TopicID == data.topicID);

        if (!findTopic) {
            findTopic = topicGroup.Data.find(item => item.TopicID == data.topicID);
        }

        // user Rời nhóm hoặc Admin xóa nhóm
        if (!findTopic || (data && data.isUserGetOutGroup) || (data && data.isAdminRemoveGroup)) {
            this.setState({ refreshing: true }, () => this.getListTopic());
            return;
        }

        console.log(findTopic, 'findTopic');
        //check điều kiện không cập nhật lại nội dung chat
        //chỉ update số tin Remind

        if (!isOnlyUpdateRemind && findTopic) {
            let objMess = {
                ...data,
                // Content: data.message,
                ID: Vnr_Function.MakeId(12),
                IsYou: data.userID == this.userId,
                asdb: true
            };

            findTopic.ListMessage.Data.unshift(objMess);
        }

        //khi nhận tin từ user khác => cập nhật số tin remind
        if (isPlusRemind == true && findTopic && findTopic.RemindQty != null && findTopic.IsNotify) {
            ++findTopic.RemindQty;

            //update lên server
            HttpService.Post(`${this.chatEndpointApi}/restapi/chat/AddRemind`, {
                UserID: data.userID,
                TopicID: data.topicID
            });
        }
        //cập nhật tin remind về 0 khi ở screen chat
        else if (findTopic) {
            findTopic.RemindQty = 0;
        }

        this.setState({
            topicSingle: topicSingle,
            topicGroup: topicGroup,
            isRefreshAgentFriend: !isRefreshAgentFriend,
            isRefreshAgentGroup: !isRefreshAgentGroup
        });
    };

    initCurrAgent = () => {
        HttpService.MultiRequest([
            HttpService.Post(`${this.chatEndpointApi}/restapi/chat/GetUserByID`, { UserID: this.userId }),
            HttpService.Get(`${this.chatEndpointApi}/restapi/chat/GetEnumStatus`)
        ]).then(res => {
            const [userInfo, arrStatus] = res;

            arrStatus.map(stt => {
                const { PrimaryColor } = stt.theme;
                console.log(stt, 'arrStatus');
                stt.titleNoColor = <VnrText style={[styleSheets.text]} i18nKey={stt.title} />;
                // stt.title = (
                //   <VnrText
                //     style={[
                //       styleSheets.text,
                //       stylesSearch.viewStatus_text,
                //       { color: PrimaryColor }
                //     ]}
                //     i18nKey={stt.title}
                //   />
                // )
                //translate();
                return stt;
            });

            this.sheetActionsStatus = [
                ...arrStatus,
                {
                    titleNoColor: (
                        <VnrText style={[styleSheets.text, { color: Colors.danger }]} i18nKey={'HRM_Common_Close'} />
                    ),
                    //translate("HRM_Common_Close"),
                    value: 'E_CLOSE',
                    theme: {
                        PrimaryColor: Colors.purple,
                        SecondaryColor: Colors.purple_1
                    }
                }
            ];

            const { currAgent } = this.state;

            //set mặc định Status Online
            let findStatusOnline = this.sheetActionsStatus.find(itemStt => itemStt.value == 'E_ON'),
                nextState = {
                    ...currAgent,
                    Status: findStatusOnline
                };

            //set lại status theo cấu hình user nếu có
            if (userInfo && userInfo.Status && userInfo.Status !== '') {
                let findStatus = arrStatus.find(item => item.value == userInfo.Status);
                if (findStatus) {
                    nextState = {
                        ...nextState,
                        Status: findStatus
                    };
                }
                //update status
                else {
                    HttpService.Post(`${this.chatEndpointApi}/restapi/chat/ChangeStatus`, {
                        UserID: this.userId,
                        Status: 'E_ON'
                    });
                }
            }

            this.setState({ currAgent: nextState });
        });
    };

    refreshList = () => {
        this.setState({ refreshing: true });
        this.getListTopic();
    };

    componentDidMount() {
        this.initCurrAgent();
        this.getListTopic();
    }

    removeUserInTopic = item => {
        AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            textRightButton: 'HRM_System_Resource_Sys_Delete',
            textLeftButton: 'CANCEL',
            title: 'HRM_Title_Alert_Delete_Conversation',
            message: 'HRM_Title_Alert_Delete_Conversation_Message',
            onCancel: () => {},
            onConfirm: () => {
                HttpService.Post(`${this.chatEndpointApi}restapi/chat/RemoveUserOffTopic`, {
                    TopicID: item.TopicID,
                    UserID: this.userId
                }).then(() => {
                    this.setState({ isLoadingTopic: true });
                    this.getListTopic();
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                });
            }
        });
    };

    render() {
        const {
                searchText,
                isFilter,
                topicSingle,
                currAgent,
                topicGroup,
                isLoadingTopic,
                isRefreshAgentFriend,
                isRefreshAgentGroup,
                refreshing
            } = this.state,
            _rowActions = [
                {
                    title: translate('HRM_Common_Delete'),
                    type: EnumName.E_DELETE,
                    onPress: item => this.removeUserInTopic(item)
                }
            ];
        let viewContent = <View />,
            statusPrimaryColor = Colors.green_4,
            statusSecondaryColor = Colors.green;

        if (currAgent != null && currAgent.Status) {
            statusPrimaryColor = currAgent.Status.theme.PrimaryColor;
            statusSecondaryColor = currAgent.Status.theme.SecondaryColor;
        }

        if (isLoadingTopic) {
            viewContent = <VnrLoading size={'large'} />;
        } else if (topicSingle !== null || topicGroup !== null) {
            viewContent = (
                <ScrollView
                    contentContainerStyle={{
                        paddingBottom: Size.deviceheight * 0.09
                    }}
                    refreshControl={
                        <RefreshControl
                            onRefresh={() => this.refreshList()}
                            refreshing={refreshing}
                            size="large"
                            tintColor={Colors.primary}
                        />
                    }
                >
                    {topicSingle != null && (
                        <MessagingList
                            rowActions={_rowActions}
                            detail={{
                                dataLocal: false,
                                screenDetail: ScreenName.ChatFriend,
                                screenName: ScreenName.ChatFriend
                            }}
                            dataAgent={this.arrAgent}
                            dataStatus={this.sheetActionsStatus}
                            isRefreshList={isRefreshAgentFriend}
                            dataLocal={topicSingle}
                            valueField="TopicID"
                            updateLastMess={this.updateLastMess}
                            getListTopic={this.getListTopicSingle}
                            showMore={this.showMoreChatFriend}
                            showLess={this.showLessChatFriend}
                        />
                    )}

                    {topicGroup !== null && (
                        <MessagingList
                            rowActions={_rowActions}
                            detail={{
                                dataLocal: false,
                                screenDetail: ScreenName.ChatGroup,
                                screenName: ScreenName.ChatGroup
                            }}
                            dataAgent={this.arrAgent}
                            dataStatus={this.sheetActionsStatus}
                            isRefreshList={isRefreshAgentGroup}
                            dataLocal={topicGroup}
                            valueField="TopicID"
                            updateLastMess={this.updateLastMess}
                            getListTopic={this.getListTopicGroup}
                            showMore={this.showMoreChatGroup}
                            showLess={this.showLessChatGroup}
                        />
                    )}
                </ScrollView>
            );
        } else {
            viewContent = <EmptyData messageEmptyData={'HRM_Sal_HoldSalary_NotData'} />;
        }

        return (
            <SafeAreaView {...styleSafeAreaView} style={[stylesSearch.container]}>
                <View style={stylesSearch.headerForFilter}>
                    <View style={[stylesSearch.view_searchForFilter, {}]}>
                        <TouchableWithoutFeedback onPress={() => this.focusInputSearch()}>
                            <Animated.View
                                style={[stylesSearch.search_inputForFilter, { width: this.state.animatedWidthSearch }]}
                            >
                                <View style={stylesSearch.iconSearch}>
                                    <IconSearch size={Size.iconSize} color={Colors.gray_9} />
                                </View>
                                {isFilter ? (
                                    <VnrTextInput
                                        ref={refSearch => (this.refSearch = refSearch)}
                                        //onFocus={() => this.focusInputSearch()}
                                        autoFocus={true}
                                        onClearText={() => this.changeSearchBar('')}
                                        onChangeText={text => this.changeSearchBar(text)}
                                        value={searchText}
                                        returnKeyType="search"
                                        onSubmitEditing={() => {}}
                                        style={[styleSheets.text, stylesSearch.search_VnrTextInput]}
                                    />
                                ) : (
                                    <VnrText
                                        style={[styleSheets.text, { color: Colors.gray_7 }]}
                                        i18nKey={'HRM_Common_Search'}
                                    />
                                )}
                            </Animated.View>
                        </TouchableWithoutFeedback>
                        <TouchableOpacity
                            onLayout={event => {
                                this.widthButtonCancel = event.nativeEvent.layout.width;
                            }}
                            onPress={() => this.handleBlur()}
                            style={stylesSearch.search__bntCancel}
                        >
                            <VnrText i18nKey={'CANCEL'} style={[styleSheets.text, { color: Colors.gray_10 }]} />
                        </TouchableOpacity>
                    </View>

                    {!isFilter && (
                        <View style={stylesSearch.viewInfo}>
                            <View style={stylesSearch.viewInfo_fullName}>
                                <Text
                                    numberOfLines={1}
                                    style={[styleSheets.textFontMedium, stylesSearch.viewInfo_Name]}
                                >
                                    {currAgent.NameView}
                                </Text>
                            </View>

                            {currAgent.Status ? (
                                <TouchableOpacity
                                    style={stylesSearch.viewStatus(statusPrimaryColor, statusSecondaryColor)}
                                    onPress={() => this.openActionStatus()}
                                >
                                    <IconDot size={Size.iconSize + 2} color={statusPrimaryColor} />
                                    {/* <t }> */}
                                    <VnrText
                                        style={[
                                            styleSheets.text,
                                            stylesSearch.viewStatus_text,
                                            { color: statusPrimaryColor }
                                        ]}
                                        i18nKey={currAgent.Status.title}
                                    />
                                    {/* {currAgent.Status.title} */}
                                    {/* </View> */}
                                    <IconDown size={Size.iconSize - 6} color={statusPrimaryColor} />
                                </TouchableOpacity>
                            ) : (
                                <View />
                            )}
                        </View>
                    )}
                </View>

                {isFilter ? this.renderContentSearch() : viewContent}

                <ActionSheet
                    ref={o => (this.ActionSheet = o)}
                    options={this.sheetActionsStatus.map(item => {
                        return item.titleNoColor;
                    })}
                    cancelButtonIndex={this.sheetActionsStatus.length - 1}
                    destructiveButtonIndex={this.sheetActionsStatus.length - 1}
                    onPress={index => this.changeStatus(index)}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    viewButtonAddGroup: {
        height: Size.deviceWidth >= 1024 ? 54 : 44,
        width: '100%',
        alignItems: 'center',
        marginTop: 12
    },
    viewButtonAddGroup_bnt: {
        flexDirection: 'row',
        height: '100%',
        width: Size.deviceWidth * 0.4,
        borderRadius: 8,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: Colors.gray_5
    },
    viewButtonAddGroup_bnt_text: {
        fontWeight: '500',
        marginLeft: 5
    },
    contentFilter: {
        flex: 1,
        marginTop: 12
    },
    styViewTitle: {
        flex: 1,
        marginBottom: 10,
        marginLeft: 16
    },
    styTitleFilter: {
        color: Colors.gray_7,
        textTransform: 'uppercase'
    }
});

const stylesSearch = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.gray_3
    },
    headerForFilter: {
        width: 'auto',
        paddingHorizontal: 16,
        justifyContent: 'center',
        paddingVertical: 12,
        backgroundColor: Colors.white,
        borderBottomRightRadius: Size.deviceWidth >= 1024 ? 38 : 28,
        borderBottomLeftRadius: Size.deviceWidth >= 1024 ? 38 : 28
    },
    search_inputForFilter: {
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        borderRadius: 20,
        alignItems: 'center',
        paddingRight: 10
    },
    view_search: {
        flexDirection: 'row',
        width: Size.deviceWidth - 34,
        height: HEGHT_SEARCH,
        maxWidth: Size.deviceWidth - 34
    },
    view_searchForFilter: {
        flexDirection: 'row',
        width: Size.deviceWidth - 34,
        height: HEGHT_SEARCH
    },
    search_input: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        paddingVertical: 5,
        borderRadius: 20,
        alignItems: 'center',
        paddingRight: 10
    },
    iconSearch: {
        marginLeft: 10,
        marginRight: 10
    },
    search_VnrTextInput: {
        height: '100%'
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    search__bntCancel: {
        minWidth: 40,
        height: '100%',
        marginLeft: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 11
    },
    viewInfo_fullName: {
        flex: 1
    },
    viewStatus: (primaryColor, secondaryColor) => {
        return {
            flexDirection: 'row',
            height: 30,
            backgroundColor: secondaryColor ? secondaryColor : Colors.green_1, //
            borderColor: primaryColor ? primaryColor : Colors.green_4,
            borderWidth: 1,
            paddingRight: 4,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12
        };
    },
    viewStatus_text: {
        fontWeight: '600',
        color: Colors.green,
        marginRight: 3,
        fontSize: Size.text - 3
    },
    viewInfo_Name: {
        fontWeight: '500',
        color: Colors.gray_10
    }
});
