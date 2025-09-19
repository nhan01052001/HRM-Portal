import React, { Component } from 'react';
import {
    FlatList,
    ScrollView,
    Text,
    Image,
    View,
    TouchableOpacity,
    StyleSheet,
    Animated,
    TextInput,
    Keyboard
} from 'react-native';
import { Colors, Size, styleSheets, styleSafeAreaView, stylesListPickerControl } from '../../constants/styleConfig';
import DrawerServices from '../../utils/DrawerServices';
import { dataVnrStorage } from '../../assets/auth/authentication';
import { IconSearch, IconCancel } from '../../constants/Icons';
import VnrText from '../../components/VnrText/VnrText';
import { translate } from '../../i18n/translate';
import Vnr_Function from '../../utils/Vnr_Function';
import { SafeAreaView } from 'react-navigation';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import RenderItemChatFriendFilter from './messagingList/RenderItemChatFriendFilter';
import { ScreenName } from '../../assets/constant';
import HttpService from '../../utils/HttpService';
import EmptyData from '../../components/EmptyData/EmptyData';
import { VnrLoadingSevices } from '../../components/VnrLoading/VnrLoadingPages';

const HEGHT_SEARCH = Size.deviceheight >= 1024 ? 55 : 45;

export default class AddFriendToGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            animatedWidthSearch: new Animated.Value(Size.deviceWidth - 32),
            listUserSelect: [],
            isRefreshList: false,
            isLoading: true,
            listFriendFilter: null,
            listUserSelectId: {}
        };

        this.refSearch = null;
        this.widthButtonCancel = 40;
        this.chatEndpointApi = dataVnrStorage.apiConfig.chatEndpointApi;
        const { updateLastMess } = props.navigation.state.params;

        props.navigation.setParams({
            headerRight: (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={this.createGroup} style={{ flex: 1 }}>
                        <View style={stylesListPickerControl.headerButtonStyle}>
                            <VnrText
                                i18nKey={'HRM_Chat_Create_Group_Skip'}
                                style={[styleSheets.lable, styles.headerTitleCancel]}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            )
        });
    }

    _handleRefresh = () => {
        this.setState({ refreshing: true, page: 1 }, () => {
            setTimeout(() => {
                this.setState({ refreshing: false });
            }, 2000);
        });
    };

    focusInputSearch = () => {
        Animated.timing(this.state.animatedWidthSearch, {
            toValue: Size.deviceWidth - 48 - this.widthButtonCancel,
            duration: 200
        }).start();

        this.setState({ isFilter: true }, () => {});
    };

    handleBlur = () => {
        Animated.timing(this.state.animatedWidthSearch, {
            toValue: Size.deviceWidth - 32,
            duration: 100
        }).start();
        this.setState({ isFilter: false }, () => {
            this.refSearch && this.refSearch.blur();
        });
    };

    router = roouterName => {
        const { navigation } = this.props;
        navigation.navigate(roouterName, { setStateValidApi: this.setStateValidApi });
    };

    selectFriend = (itemSelected, indexFromFilter) => {
        let { listUserSelect, listUserSelectId, listFriendFilter } = this.state;

        // thêm user đã chọn
        listUserSelect = [itemSelected].concat(listUserSelect);

        // Xoá người đã chọn  (dataFilter)

        //Tạo 1 object để check user đã chọn không hiển thị nữa
        listUserSelectId[itemSelected.UserID] = true;

        if (listUserSelect.length > 0) {
            this.props.navigation.setParams({
                headerRight: (
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={this.createGroup} style={{ flex: 1 }}>
                            <View style={stylesListPickerControl.headerButtonStyle}>
                                <VnrText
                                    i18nKey={'HRM_Common_Approve_Success'}
                                    style={[styleSheets.lable, styles.headerTitleCancel]}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            });
        }

        this.setState({
            listUserSelect,
            listUserSelectId,
            listFriendFilter
        });
    };

    createGroup = () => {
        const { AddFriendToGroup, reloadListMember } = this.props.navigation.state.params;

        //add user to group
        if (AddFriendToGroup) {
            const { listUserSelect } = this.state,
                dataBody = {
                    TopicID: AddFriendToGroup.TopicID,
                    ListUserID: listUserSelect.map(item => item.UserID)
                };

            HttpService.Post(`${this.chatEndpointApi}/restapi/chat/AddUserInTopic`, dataBody).then(res => {
                HttpService.Post(`${this.chatEndpointApi}/restapi/chat/GetUserByTopic`, {
                    TopicID: AddFriendToGroup.TopicID,
                    UserLoginID: null
                }).then(res => {
                    debugger;

                    const dataItem = {
                            ...AddFriendToGroup,
                            ListUser: [...res]
                        },
                        { dataStatus, dataAgent } = this.props.navigation.state.params;
                    //DrawerServices.navigate('OptionGroup', { dataStatus, dataAgent, dataItem: { ...dataItem } });
                    DrawerServices.goBack();

                    if (reloadListMember && typeof reloadListMember === 'function') {
                        reloadListMember({ ...dataItem }, listUserSelect);
                    }
                });
            });
        }
        //create group
        else {
            const { listUserSelect } = this.state,
                _params = this.props.navigation.state.params,
                { GroupName, SourceAvatar } = _params;

            if (!GroupName) return;

            const dataBody = {
                UserLoginID: dataVnrStorage.currentUser.headers.userid,
                GroupName: GroupName,
                base64String: SourceAvatar != null ? SourceAvatar.data : null,
                contentType: SourceAvatar != null ? SourceAvatar.type : null,
                ListUserID: listUserSelect.map(item => item.UserID)
            };

            VnrLoadingSevices.show();

            HttpService.Post(`${this.chatEndpointApi}/restapi/chat/CreateTopicChatGroup`, dataBody).then(res => {
                debugger;
                VnrLoadingSevices.hide();
                if (res && res.success && res.data2) {
                    const {
                        updateLastMess,
                        refreshTopicGroup,
                        dataAgent,
                        dataStatus
                    } = this.props.navigation.state.params;

                    DrawerServices.navigate('ChatGroup', {
                        updateLastMess,
                        dataAgent,
                        dataStatus,
                        dataItem: {
                            ...res.data2,
                            NameView: GroupName,
                            IsNotify: true
                        },
                        getListTopic: refreshTopicGroup,
                        isCreateGroup: true
                    });

                    //refresh topic group
                    if (refreshTopicGroup && typeof refreshTopicGroup === 'function') {
                        refreshTopicGroup();
                    }
                }
            });
        }
    };

    removeItem = (item, index) => {
        let { listUserSelect, listFriendFilter, listUserSelectId } = this.state;
        listUserSelect.splice(index, 1);
        listUserSelectId[item.UserID] = false;

        if (listUserSelect.length == 0) {
            this.props.navigation.setParams({
                headerRight: (
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={this.createGroup} style={{ flex: 1 }}>
                            <View style={stylesListPickerControl.headerButtonStyle}>
                                <VnrText
                                    i18nKey={'HRM_Chat_Create_Group_Skip'}
                                    style={[styleSheets.lable, styles.headerTitleCancel]}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            });
        }

        this.setState({
            listUserSelect,
            listUserSelectId,
            listFriendFilter
        });
    };

    handleUnhandledTouches() {
        Keyboard.dismiss();
        return false;
    }

    changeSearchBar = text => {
        this.setState({ searchText: text }, () => this.filterFriend());
    };

    filterFriend = () => {
        const { searchText, listFriendFull, isRefreshList } = this.state,
            { AddFriendToGroup } = this.props.navigation.state.params;
        this.getUserServer(searchText).then(listUser => {
            debugger;
            if (listUser && Array.isArray(listUser) && listUser.length > 0) {
                let dataUser = [];
                if (AddFriendToGroup) {
                    // User
                    listUser.forEach(item => {
                        let indexItem = AddFriendToGroup.ListUser.findIndex(e => e.UserID == item.UserID);
                        if (indexItem < 0) {
                            dataUser.push(item);
                        }
                    });
                } else {
                    dataUser = listUser;
                }

                this.setState({
                    listFriendFilter: dataUser,
                    isLoading: false
                });
            } else {
                this.setState({
                    listFriendFilter: null,
                    isLoading: false
                });
            }

            this.setState({
                listFriendFilter: _dataFilter,
                isRefreshList: !isRefreshList
            });
        });
    };

    getUserServer = userInfoName => {
        return HttpService.Post(`${this.chatEndpointApi}restapi/chat/GettingUserServer`, {
            UserID: dataVnrStorage.currentUser.headers.userid,
            UserInfoName: userInfoName ? userInfoName : null,
            IsPortalApp: true
        });
    };

    componentDidMount() {
        const { AddFriendToGroup } = this.props.navigation.state.params;
        this.getUserServer().then(listUser => {
            if (listUser && Array.isArray(listUser) && listUser.length > 0) {
                let dataUser = [];
                listUser.forEach(item => {
                    let indexItem = AddFriendToGroup.ListUser.findIndex(e => e.UserID == item.UserID);
                    if (indexItem < 0) {
                        dataUser.push(item);
                    }
                });

                this.setState({
                    listFriendFilter: dataUser,
                    isLoading: false
                });
            } else {
                this.setState({
                    listFriendFilter: null,
                    isLoading: false
                });
            }
        });
    }

    renderAvatar = item => {
        const firstChar = item && item.UserInfoName ? item.UserInfoName.split('')[0] : '',
            randomColor = Vnr_Function.randomColor(firstChar),
            { PrimaryColor, SecondaryColor } = randomColor;
        return (
            <View style={stylesSearch.viewItemUser_avatar}>
                {item.Image != null ? (
                    <Image source={item.Image} style={stylesSearch.viewItemUser_avatar__image} />
                ) : (
                    <View style={[stylesSearch.viewItemUser_avatar__image, { backgroundColor: SecondaryColor }]}>
                        <Text
                            style={[
                                styleSheets.textFontMedium,
                                stylesSearch.viewItemUser_avatar__text,
                                {
                                    color: PrimaryColor
                                }
                            ]}
                        >
                            {firstChar.toUpperCase()}
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    render() {
        const { searchText, listUserSelect, isRefreshList, listFriendFilter, listUserSelectId, isLoading } = this.state;

        let viewListFilter = <View />;

        if (isLoading) {
            viewListFilter = <VnrLoading size={'large'} isVisible={isLoading} />;
        } else if (listFriendFilter !== null) {
            viewListFilter = (
                <FlatList
                    keyboardShouldPersistTaps={'handled'}
                    data={listFriendFilter}
                    renderItem={({ item, index }) => {
                        if (!listUserSelectId[item.UserID]) {
                            return (
                                <RenderItemChatFriendFilter
                                    rowTouch={() => this.selectFriend({ ...item }, index)}
                                    dataItem={item}
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: ScreenName.ChatFriend,
                                        screenName: ScreenName.MessagingFilter
                                    }}
                                />
                            );
                        } else {
                            return null;
                        }
                    }}
                    keyExtractor={item => item.UserID}
                />
            );
        } else {
            viewListFilter = <EmptyData messageEmptyData={'HRM_Sal_HoldSalary_NotData'} />;
        }

        return (
            <SafeAreaView {...styleSafeAreaView} style={[stylesSearch.container]}>
                <View style={stylesSearch.viewFilter}>
                    <View style={stylesSearch.viewFilter_content}>
                        <View style={stylesSearch.viewFilter_icon}>
                            <IconSearch size={Size.iconSize} color={Colors.gray_9} />
                        </View>
                        <View style={stylesSearch.viewFilter_right}>
                            <ScrollView
                                contentContainerStyle={stylesSearch.viewFilter_scroll}
                                onStartShouldSetResponder={() => this.handleUnhandledTouches()}
                                keyboardShouldPersistTaps={'handled'}
                            >
                                <View style={stylesSearch.viewFilter_swap}>
                                    {listUserSelect.map((item, index) => (
                                        <View style={stylesSearch.viewItemUser}>
                                            {this.renderAvatar(item)}
                                            <Text style={[styleSheets.text, stylesSearch.viewItemUser_text]}>
                                                {item.UserInfoName}
                                            </Text>
                                            <TouchableOpacity
                                                style={stylesSearch.viewItemUser_bnt__close}
                                                onPress={() => this.removeItem(item, index)}
                                            >
                                                <IconCancel size={Size.iconSize - 8} color={Colors.gray_10} />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>

                            <TextInput
                                ref={refSearch => (this.refSearch = refSearch)}
                                onClearText={() => this.changeSearchBar('')}
                                placeholder={translate('HRM_Common_Search')}
                                onChangeText={text => this.changeSearchBar(text)}
                                value={searchText}
                                returnKeyType="search"
                                onSubmitEditing={() => {}}
                                style={[styleSheets.text, stylesSearch.viewFilter_Input]}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.contentList}>{viewListFilter}</View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    headerTitleCancel: {
        color: Colors.primary,
        fontWeight: '600'
    },
    contentList: {
        flex: 1,
        marginTop: 16
    }
});

const HEIGHT_INPUT_SEARCH = 40;
const stylesSearch = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.gray_3
    },
    viewFilter: {
        minHeight: HEGHT_SEARCH,
        maxHeight: HEGHT_SEARCH * 4 + 24,
        paddingHorizontal: 16,
        justifyContent: 'center',
        backgroundColor: Colors.white,
        borderBottomRightRadius: Size.deviceWidth >= 1024 ? 38 : 28,
        borderBottomLeftRadius: Size.deviceWidth >= 1024 ? 38 : 28
    },

    viewFilter_content: {
        width: '100%',
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        borderRadius: 20,
        alignItems: 'flex-start',
        paddingRight: 10,
        marginVertical: 12,
        maxHeight: HEGHT_SEARCH * 4,
        paddingVertical: 8
    },
    viewFilter_right: {
        height: '100%',
        width: 'auto',
        flex: 1
    },
    viewFilter_icon: {
        marginLeft: 10,
        marginRight: 10,
        height: HEIGHT_INPUT_SEARCH,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewFilter_scroll: {
        backgroundColor: Colors.white
    },
    viewFilter_swap: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    viewFilter_Input: {
        height: HEIGHT_INPUT_SEARCH,
        paddingHorizontal: 7
    },
    viewItemUser: {
        paddingHorizontal: 8,
        paddingVertical: 5,
        backgroundColor: Colors.gray_3,
        borderColor: Colors.gray_4,
        borderWidth: 0.5,
        borderRadius: 15,
        marginRight: 8,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewItemUser_text: {
        fontSize: Size.text - 2,
        color: Colors.gray_10
    },
    viewItemUser_bnt__close: {
        width: 25,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    viewItemUser_avatar: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 21 / 2,
        marginRight: 5
    },
    viewItemUser_avatar__image: {
        width: 21,
        height: 21,
        borderRadius: 21 / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewItemUser_avatar__text: {
        fontSize: Size.text - 7
    }
});
