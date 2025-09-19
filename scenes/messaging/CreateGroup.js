import React, { Component } from 'react';
import { Image, View, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { Colors, Size, styleSheets, styleSafeAreaView, stylesListPickerControl } from '../../constants/styleConfig';
import DrawerServices from '../../utils/DrawerServices';
import { IconPlus, IconImage, IconCancel } from '../../constants/Icons';
import VnrTextInput from '../../components/VnrTextInput/VnrTextInput';
import VnrText from '../../components/VnrText/VnrText';
import { translate } from '../../i18n/translate';
import { SafeAreaView } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ToasterSevice } from '../../components/Toaster/Toaster';

export default class CreateGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            GroupName: '',
            sourceAvatar: null
        };

        props.navigation.setParams({
            headerLeft: (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => DrawerServices.goBack()} style={{ flex: 1 }}>
                        <View style={stylesListPickerControl.headerButtonStyle}>
                            <IconCancel size={Size.iconSizeHeader} color={Colors.gray_10} />
                        </View>
                    </TouchableOpacity>
                </View>
            )
        });
    }

    onChangeTextName = textValue => {
        this.setState({ GroupName: textValue });
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
                    response.dataReview = `data:image/png;base64,${response.data}`;
                }
                this.setState({ sourceAvatar: response });
            }
        });
    };

    nextStep = () => {
        const { GroupName, sourceAvatar } = this.state,
            { navigation } = this.props;
        const { updateLastMess, refreshTopicGroup, dataStatus, dataAgent } = navigation.state.params;

        navigation.navigate('AddFriendToGroup', {
            dataStatus,
            dataAgent,
            GroupName: GroupName,
            SourceAvatar: sourceAvatar,
            updateLastMess,
            refreshTopicGroup
        });
    };

    render() {
        const { GroupName, sourceAvatar } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView} style={[styles.container]}>
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.keyboardContent}
                    extraScrollHeight={40} // khoang cach
                    keyboardShouldPersistTaps={'handled'}
                    bounces={false}
                >
                    <View style={styles.viewUpload}>
                        <TouchableOpacity style={styles.viewUpload_bnt} onPress={() => this.showPickerImage()}>
                            {sourceAvatar != null && sourceAvatar.dataReview != null ? (
                                <Image source={{ uri: sourceAvatar.dataReview }} style={styles.viewUpload_Avatar} />
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
                                value={GroupName}
                                returnKeyType="done"
                                onSubmitEditing={() => {}}
                                style={[styleSheets.text, styles.viewForm_Input__style]}
                            />
                        </View>
                    </View>

                    <View style={styles.viewForm}>
                        {GroupName.length > 0 ? (
                            <TouchableOpacity style={styles.viewForm_btutonNext} onPress={this.nextStep}>
                                <VnrText
                                    style={[styleSheets.textFontMedium, styles.viewForm_btutonNext__text]}
                                    i18nKey={'HRM_Common_Continue'}
                                />
                            </TouchableOpacity>
                        ) : (
                            <View style={[styles.viewForm_btutonNext, styles.viewForm_buttonDisable]}>
                                <VnrText
                                    style={[
                                        styleSheets.textFontMedium,
                                        styles.viewForm_btutonNext__text,
                                        styles.viewForm_btutonNext__textDisable
                                    ]}
                                    i18nKey={'HRM_Common_Continue'}
                                />
                            </View>
                        )}
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }
}

const HEIGHT_BUTTON_UPLOAD = Size.deviceWidth * 0.3 >= 200 ? 200 : Size.deviceWidth * 0.3,
    HEIGHT_ICON = Size.iconSize + 8,
    WIDTH_INPUT_NAMEGROUP = Size.deviceWidth * 0.85;
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
        minHeight: HEIGHT_BUTTON_UPLOAD + 70,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewUpload_Avatar: {
        width: HEIGHT_BUTTON_UPLOAD,
        height: HEIGHT_BUTTON_UPLOAD,
        borderRadius: 16
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
        // height: 100,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 32
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
    }
});
