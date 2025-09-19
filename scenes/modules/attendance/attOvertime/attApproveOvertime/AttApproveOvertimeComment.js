import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Platform,
    ScrollView,
    Keyboard,
    KeyboardAvoidingView,
    TextInput,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, Colors, Size, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { EnumName } from '../../../../../assets/constant';
import { connect } from 'react-redux';
import VnrText from '../../../../../components/VnrText/VnrText';
import { IconBack, IconSend } from '../../../../../constants/Icons';
import HttpService from '../../../../../utils/HttpService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import DrawerServices from '../../../../../utils/DrawerServices';

class AttApproveOvertimeComment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listComment: null,
            contentChat: '',
            isLoading: true
        };
        this.refSearch = null;
    }

    reload = () => {
        const _params = this.props.navigation.state.params,
            { record } = _params;

        HttpService.Post('[URI_HR]/Att_GetData/GetCommentByRecordID', { selectID: record.ID }).then(res => {
            if (res && res.length > 0) {
                this.setState({
                    listComment: res.reverse(),
                    isLoading: false
                });
            } else {
                this.setState({
                    listComment: EnumName.E_EMPTYDATA,
                    isLoading: false
                });
            }
        });
    };

    sendComment = content => {
        const _params = this.props.navigation.state.params,
            { record, reload } = _params;

        if (content == '') {
            return;
        }

        const dataBody = {
            recordID: record.ID,
            commentContent: content,
            isSendMail: 'E_OVERTIME'
        };

        this.setState({
            isLoading: true,
            contentChat: ''
        });

        this.handleUnhandledTouches();

        HttpService.Post('[URI_HR]/Att_GetData/SaveCommentInfo', dataBody).then(res => {
            if (res && res == EnumName.E_Success) {
                reload && reload();
                this.reload();
            } else if (res && typeof res == 'string') {
                ToasterSevice.showWarning(res, 4000);
                this.setState({
                    isLoading: false
                });
            }
        });
    };

    componentDidMount() {
        this.reload();
    }

    handleUnhandledTouches() {
        Keyboard.dismiss();
        return false;
    }

    renderHeader = () => {
        return (
            <View style={styles.header}>
                <SafeAreaView style={styles.viewSafe}>
                    <View style={styles.headerView}>
                        <TouchableOpacity style={styles.headerView_bnt__back} onPress={() => DrawerServices.goBack()}>
                            <IconBack size={Size.iconSizeHeader} color={Colors.gray_10} />
                        </TouchableOpacity>
                        <View style={styles.headerView_content}>
                            <VnrText
                                style={[styleSheets.headerTitleStyle]}
                                i18nKey={'HRM_System_Comment__E_OVERTIME'}
                            />
                        </View>
                        <TouchableOpacity style={styles.headerView_bnt__more} />
                    </View>
                </SafeAreaView>
            </View>
        );
    };

    renderContent = () => {
        const { isLoading, listComment } = this.state;
        const { apiConfig } = dataVnrStorage,
            _uriMain = apiConfig ? apiConfig.uriMain : null;

        if (isLoading) {
            return <VnrLoading size={'large'} />;
        } else if (listComment == EnumName.E_EMPTYDATA) {
            return <EmptyData messageEmptyData={'HRM_Sys_Comment_EmptyComment'} />;
        } else if (listComment != null && listComment.length > 0) {
            return (
                <View style={styles.chatContent}>
                    <ScrollView>
                        {listComment.map((item, index) => {
                            let uriAvatar = item.ImageUrl
                                ? { uri: `${_uriMain}/Images/${item.ImageUrl}` }
                                : require('../../../../../assets/images/default-user-profile.png');
                            return (
                                <View key={index} style={[index > 0 ? styles.styViewNote2 : styles.styViewNote]}>
                                    <View style={styles.styItemDataNote}>
                                        <View style={styles.styViewData}>
                                            <Image style={styles.styImageAvatar} source={uriAvatar} />
                                        </View>

                                        <View style={styles.styViewData}>
                                            <Text style={[styleSheets.text, styles.styName]}>
                                                {item.UserCommentName ? item.UserCommentName : ''}
                                            </Text>
                                        </View>

                                        <View style={styles.styViewData}>
                                            <Text style={[styleSheets.text, styles.styTextDate]}>
                                                {item.CommentkDate ? item.CommentkDate : ''}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.styItemDataNote}>
                                        <View style={styles.viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, styles.styTextNote]}
                                                value={item.CommentContent ? item.CommentContent : ''}
                                            />
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
            );
        } else {
            return <View />;
        }
    };

    changeContent = text => {
        this.setState({ contentChat: text });
    };

    renderInput = () => {
        const { contentChat } = this.state;
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

                <View style={styles.viewSend_bnt}>
                    <TouchableOpacity
                        style={styles.viewSend_bnt__chillrent}
                        onPress={() => this.sendComment(contentChat)}
                    >
                        <IconSend size={Size.iconSizeHeader} color={Colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    render() {
        const _params = this.props.navigation.state.params,
            { isViewDetail } = _params;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {this.renderHeader()}
                {Platform.OS == 'android' ? (
                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.keyboardContent}
                        extraScrollHeight={20} // khoang cach
                        keyboardShouldPersistTaps={'handled'}
                    >
                        {this.renderContent()}
                        {!isViewDetail ? this.renderInput() : <View />}
                    </KeyboardAwareScrollView>
                ) : (
                    <KeyboardAvoidingView
                        behavior={Platform.OS == 'ios' ? 'padding' : 'padding'}
                        style={styles.keyboardContent}
                        onStartShouldSetResponder={() => this.handleUnhandledTouches()}
                    >
                        {this.renderContent()}
                        {!isViewDetail ? this.renderInput() : <View />}
                    </KeyboardAvoidingView>
                )}
            </SafeAreaView>
        );
    }
}

const mapStateToProps = () => {
    return {};
};

export default connect(
    mapStateToProps,
    null
)(AttApproveOvertimeComment);
const HEIGHT_HEADER = Platform.OS == 'ios' ? Size.headerHeight : Size.headerHeight - 25;
const styles = StyleSheet.create({
    keyboardContent: {
        flex: 1
    },
    chatContent: {
        flex: 1,
        paddingHorizontal: Size.defineSpace,
        marginTop: Platform.OS == 'ios' ? Size.headerHeight : Size.headerHeight - 25
    },
    viewSend: {
        height: Size.deviceWidth >= 1024 ? 75 : 65,
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderTopColor: Colors.gray_5,
        borderTopWidth: 0.7,
        paddingLeft: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewSend_content: {
        flex: 1,
        paddingVertical: 10
    },
    viewSend_bnt: {
        width: Size.iconSizeHeader + 32,
        height: 45
    },
    viewSend_bnt__chillrent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    styViewNote: {
        marginVertical: Size.defineHalfSpace,
        width: '100%'
    },
    styViewNote2: {
        width: '100%',
        marginVertical: Size.defineHalfSpace,
        paddingLeft: Size.defineHalfSpace,

        borderLeftWidth: 2,
        borderLeftColor: Colors.gray_5,
        borderRadius: 5,
        borderStyle: 'dotted'
    },
    styItemDataNote: {
        width: '100%',
        flexDirection: 'row',
        marginTop: Size.defineHalfSpace - 2
    },
    viewLable: {
        flexShrink: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        minWidth: 160
    },
    styName: {
        fontWeight: Platform.OS == 'ios' ? '500' : '600',
        fontSize: Size.text + 1
    },
    styTextDate: {
        color: Colors.gray_7
    },
    styImageAvatar: {
        width: Size.iconSize,
        height: Size.iconSize,
        borderRadius: Size.iconSize / 2,
        backgroundColor: Colors.gray_3
    },
    styViewData: {
        marginRight: Size.defineHalfSpace,
        alignItems: 'center'
    },
    styTextNote: {},
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
    headerView_content: {
        flex: 1,
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
    }
});
