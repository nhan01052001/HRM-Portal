/* eslint-disable react-native/no-unused-styles */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, Animated, Easing, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import moment from 'moment';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    Colors,
    Size,
    CustomStyleSheet
} from '../../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import DrawerServices from '../../../../../../utils/DrawerServices';
import VnrTextInput from '../../../../../../components/VnrTextInput/VnrTextInput';
import { IconDelete } from '../../../../../../constants/Icons';
import HttpService from '../../../../../../utils/HttpService';
import VnrLoading from '../../../../../../components/VnrLoading/VnrLoading';
import { ToasterSevice } from '../../../../../../components/Toaster/Toaster';
import { dataVnrStorage } from '../../../../../../assets/auth/authentication';
import { VnrLoadingSevices } from '../../../../../../components/VnrLoading/VnrLoadingPages';
import EmptyData from '../../../../../../components/EmptyData/EmptyData';
import { translate } from '../../../../../../i18n/translate';
import { EnumIcon } from '../../../../../../assets/constant';
import { AlertSevice } from '../../../../../../components/Alert/Alert';

export default class HreTaskInfoTabComment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataItem: null,
            TasTaskNote: {
                value: null,
                refresh: false,
                disable: false
            },
            listComment: null,
            fieldValid: {},
            yInput: new Animated.Value(10),
            marginScroll: new Animated.Value(60)
        };

        //for get keyboard height
        if (Platform.OS === 'ios') {
            this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', (frames) => {
                if (!frames.endCoordinates) return;
                Animated.parallel([
                    Animated.timing(this.state.yInput, {
                        toValue: frames.endCoordinates.height - 35,
                        duration: frames.duration,
                        easing: Easing.linear
                    }).start(),
                    Animated.timing(this.state.marginScroll, {
                        toValue: frames.endCoordinates.height + 35,
                        duration: frames.duration,
                        easing: Easing.linear
                    }).start()
                ]).start();
            });

            this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', (frames) => {
                Animated.parallel([
                    Animated.timing(this.state.yInput, {
                        toValue: 10,
                        duration: frames.duration,
                        easing: Easing.linear
                    }).start(),
                    Animated.timing(this.state.marginScroll, {
                        toValue: 60,
                        duration: frames.duration,
                        easing: Easing.linear
                    }).start()
                ]).start();
            });
        }
    }

    reload = (E_KEEP_FILTER, actionIsDelete) => {
        const { reloadScreenList } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');

        //nếu action = Delete => back về danh sách
        if (actionIsDelete) {
            DrawerServices.navigate('');
        } else {
            this.getDataItem(true);
        }
    };

    getListComment = async () => {
        const { params } = this.props.navigation.state;

        if (params) {
            const { newRecord } = params;
            const responseList = await HttpService.Post('[URI_HR]/Tas_GetData/GetTasTaskNoteList', {
                TaskID: newRecord.ID ? newRecord.ID : null
            });
            if (responseList && Array.isArray(responseList) && responseList.length > 0) {
                this.setState({ listComment: responseList.reverse() });
            } else {
                this.setState({ listComment: 'EmptyData' });
            }
        }
    };

    componentDidMount() {
        this.getListComment();
    }

    componentWillUnmount() {
        this.keyboardWillShowListener && this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener && this.keyboardWillHideListener.remove();
    }

    //update value cho record
    onUpdateNewRecord = (obj) => {
        const { params } = this.props.navigation.state;

        if (params) {
            const { updateNewRecord } = params;
            if (updateNewRecord && typeof updateNewRecord === 'function') {
                updateNewRecord(obj);
            }
        }
    };

    saveComment = () => {
        const { TasTaskNote } = this.state,
            { params } = this.props.navigation.state;

        if (params && TasTaskNote.value) {
            const { newRecord } = params,
                dataBody = {
                    TaskID: newRecord.ID ? newRecord.ID : null,
                    CreatorID: dataVnrStorage.currentUser.info.ProfileID,
                    Content: TasTaskNote.value
                };

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/api/Tas_TaskNote', dataBody).then((res) => {
                VnrLoadingSevices.hide();
                if (res && Object.keys(res).length > 0 && res.ActionStatus === 'Success') {
                    this.setState(
                        {
                            TasTaskNote: {
                                ...TasTaskNote,
                                value: ''
                            },
                            listComment: null
                        },
                        () => {
                            this.getListComment();
                        }
                    );
                } else {
                    ToasterSevice.showError('Hrm_Fail', 4000);
                }
            });
        }
    };

    //#region [Delete Comment]
    businessDeleteRecords = (items) => {
        if (items.length === 0) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map((item) => item.ID),
                lengthItemDelete = selectedID.length;

            AlertSevice.alert({
                iconType: EnumIcon.E_DELETE,
                message: `${translate('AreYouSureYouWantToDeleteV2')} ${lengthItemDelete} ${translate(
                    'SelectedDataLines'
                )}`,
                onCancel: () => {},
                onConfirm: () => {
                    this.checkingDataWorkingForTaskDelete(selectedID);
                }
            });
        }
    };

    checkingDataWorkingForTaskDelete = (selectedID) => {
        if (Array.isArray(selectedID) && selectedID.length > 0) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_POR]/New_Ins_Tas_Task/RemoveSelected_Tas_TaskNote', {
                selectedIds: selectedID,
                userLogin: dataVnrStorage.currentUser.headers.userlogin
            }).then((res) => {
                VnrLoadingSevices.hide();
                try {
                    if (res && res === 'Success') {
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        this.getListComment();
                    } else {
                        ToasterSevice.showError('Hrm_Fail', 4000);
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
    };
    //#endregion

    renderItemComment = (dataItem, index) => {
        const styles = stylesComment;
        return (
            <View style={styles.viewButton} key={index}>
                <View style={styles.rightBody}>
                    <View style={styles.Line}>
                        <View style={styles.valueView}>
                            <Text numberOfLines={1} style={[styleSheets.text]}>
                                {dataItem.CreatorName}
                            </Text>
                            <TouchableOpacity onPress={() => this.businessDeleteRecords([{ ...dataItem }])}>
                                <IconDelete size={Size.iconSize} color={Colors.danger} />
                            </TouchableOpacity>
                            {/* <Text numberOfLines={1}
                                style={[styleSheets.text, styles.txtDateSmall]}>
                                {dataItem.DateCreate && moment(dataItem.DateCreate).format('DD/MM/YYYY')}
                            </Text> */}
                        </View>
                        <View style={styles.valueView}>
                            {/* <Text numberOfLines={1}
                                style={[styleSheets.text]}>
                                {dataItem.CreatorName}
                            </Text> */}
                            <Text numberOfLines={1} style={[styleSheets.text, styles.txtDateSmall]}>
                                {dataItem.DateCreate && moment(dataItem.DateCreate).format('DD/MM/YYYY')}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.LineViewComment}>
                        <View style={styles.valueView}>
                            <Text style={[styleSheets.text, styles.txtComment]}>{dataItem.Content}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    render() {
        const { TasTaskNote, listComment } = this.state;

        let contentViewComment = <VnrLoading size={'large'} />;
        if (listComment && Array.isArray(listComment)) {
            contentViewComment = (
                <View style={CustomStyleSheet.flex(9)}>
                    <Animated.ScrollView style={{ flex: 1, marginBottom: this.state.marginScroll }}>
                        <View style={styleScreenDetail.containerItemDetail}>
                            {listComment.map((item, index) => {
                                return (
                                    <View key={''} style={styleScreenDetail.itemContent}>
                                        {this.renderItemComment(item, index)}
                                    </View>
                                );
                            })}
                        </View>
                    </Animated.ScrollView>
                </View>
            );
        } else if (listComment === 'EmptyData') {
            contentViewComment = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    {contentViewComment}
                    <Animated.View
                        style={[
                            styles.viewComment,
                            {
                                bottom: this.state.yInput
                            }
                        ]}
                    >
                        <VnrTextInput
                            placeholder={translate('HouseHoldAddNotes')}
                            value={TasTaskNote.value}
                            onChangeText={(text) =>
                                this.setState(
                                    {
                                        TasTaskNote: {
                                            ...TasTaskNote,
                                            value: text
                                        }
                                    },
                                    () => {
                                        this.onUpdateNewRecord({ TasTaskNote: text });
                                    }
                                )
                            }
                            onSubmitEditing={() => this.saveComment()}
                            //multiline={true}
                            //numberOfLines={5}
                            returnKeyType={'send'}
                        />
                    </Animated.View>
                    {/* {
                        <KeyboardAwareScrollView
                            contentContainerStyle={styles.styleKeyboard}
                            keyboardShouldPersistTaps={'handled'}
                        >

                            <View style={contentViewControl}>
                                <View style={viewLable}>

                                    <VnrText style={[styleSheets.text, textLableInfo]}
                                        i18nKey={"HRM_Tas_Task_NoteHistory"} />
                                    {
                                        fieldValid.TasTaskNote && <VnrText style={styleValid} i18nKey={"HRM_Valid_Char"} />
                                    }
                                </View>


                            </View>
                        </KeyboardAwareScrollView>

                    } */}

                    {/* bottom button save */}
                    {/* <View style={styles.groupButton}>

                        <TouchableOpacity
                            onPress={() => this.onUpdate()}
                            style={styles.groupButton__button_save}>

                            <IconPublish size={Size.iconSize} color={Colors.white} />
                            <VnrText
                                style={[styleSheets.lable, styles.groupButton__text]}
                                i18nKey={'HRM_Common_Save'}
                            />
                        </TouchableOpacity>
                    </View> */}
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    viewComment: {
        position: 'absolute',
        bottom: 60,
        paddingHorizontal: 10,
        width: Size.deviceWidth,
        backgroundColor: Colors.white,
        paddingVertical: 10
    }
});

const stylesComment = StyleSheet.create({
    viewButton: {
        flex: 1,
        backgroundColor: Colors.whiteOpacity70,
        borderRadius: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5
    },

    leftBody: {
        // flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightColor: Colors.borderColor,
        borderRightWidth: 0.5,
        paddingHorizontal: 5
    },
    rightBody: {
        flex: 8,
        paddingHorizontal: 10
    },
    iconAvatarView: {
        flex: 1,
        marginBottom: 5
    },
    avatarUser: {
        width: Size.deviceWidth * 0.15,
        height: Size.deviceWidth * 0.15,
        borderRadius: (Size.deviceWidth * 0.15) / 2,
        resizeMode: 'cover',
        backgroundColor: Colors.borderColor
    },
    Line: {
        flex: 1,
        // flexDirection: "row",
        maxWidth: '100%',
        justifyContent: 'center'
    },
    LineViewComment: {
        flex: 1,
        flexDirection: 'row',
        maxWidth: '100%',
        justifyContent: 'center',
        paddingVertical: 7,
        paddingHorizontal: 10,
        backgroundColor: Colors.primaryOpacity10,
        borderRadius: 5,
        marginTop: 5
    },
    valueView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    IconView: {
        height: '100%',
        justifyContent: 'center'
    },
    txtDateSmall: {
        fontSize: Size.text - 3,
        color: Colors.grey
    },
    txtComment: {
        fontSize: Size.text
    }
});
