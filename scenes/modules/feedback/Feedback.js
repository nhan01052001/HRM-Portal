import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Platform,
    // eslint-disable-next-line react-native/split-platform-components
    PermissionsAndroid,
    ScrollView,
    FlatList
} from 'react-native';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import { styleSheets, Colors, Size, stylesVnrPickerV3 } from '../../../constants/styleConfig';
import { IconCancel, IconImage, IconSend, IconVideo, IconPlayVideo, IconScreenshot } from '../../../constants/Icons';
import VnrTextInput from '../../../componentsV3/VnrTextInput/VnrTextInput';
import ViewImg from '../../../components/ViewImg/ViewImg';
import { VnrBalloonService } from '../../../components/VnrBalloon/VnrBalloon';
import DrawerServices from '../../../utils/DrawerServices';
import feedback from '../../../redux/feedback';
import ActionSheet from 'react-native-actionsheet';
import { translate } from '../../../i18n/translate';
import moment from 'moment';
import { EnumName } from '../../../assets/constant';
import { VnrLoadingSevices } from '../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../utils/HttpService';
import { dataVnrStorage } from '../../../assets/auth/authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToasterSevice } from '../../../components/Toaster/Toaster';
import DeviceInfo from 'react-native-device-info';
import { FeedbackApi } from './Api';

const initSateDefault = {
    filePath: {},
    imageURI: '',
    savedImagePath: 'uri',
    isPlayVideo: false,
    video: null,
    uploading: false,
    tranferred: 0,
    Email: {
        value: '',
        lable: 'Email',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    Description: {
        value: '',
        lable: 'Description',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    lsImgAndVideo: []
};

class Feedback extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initSateDefault,
            Profile: {
                ID: null,
                ProfileName: '',
                disable: true
            },
            isConfigMultiTimeInOut: true,
            isRefreshState: false
        };
        this.sheetActions = [
            {
                title: translate('HRM_PortalApp_Feedback_SelectPhoto'),
                onPress: () => this.chooseFile('photo')
            },
            {
                title: translate('HRM_PortalApp_Feedback_SelectVideo'),
                onPress: () => this.chooseFile('video')
            },
            {
                title: translate('HRM_Common_Close'),
                onPress: null
            }
        ];

        this.layoutHeightItem = null;
        this.layoutHeightItem = null;

        props.navigation.setParams({
            headerLeft: (
                <TouchableOpacity
                    onPress={() => {
                        this.handleExit();
                    }}
                >
                    <View style={styleSheets.bnt_HeaderRight}>
                        <IconCancel color={Colors.primary} size={Size.iconSizeHeader} />
                    </View>
                </TouchableOpacity>
            ),

            headerRight: (
                <TouchableOpacity
                    onPress={() => {
                        this.handleSendMail();
                    }}
                >
                    <View style={styleSheets.bnt_HeaderRight}>
                        <IconSend color={Colors.primary} size={Size.iconSizeHeader} />
                    </View>
                </TouchableOpacity>
            )
        });
    }

    handleExit = () => {
        this.props.setDataImgVideo(null);
        this.props.setDataEmail(null);
        this.props.setDataDescription(null);
        DrawerServices.navigate('Home');
    };

    handleRefresh = () => {
        this.props.setDataImgVideo(null);
        this.props.setDataEmail(null);
        this.props.setDataDescription(null);
        this.setState({
            ...initSateDefault
        });
    };

    initStateDefault = () => {
        const { Email, Description } = this.state;
        let nextState = {};
        if (Array.isArray(this.props?.dataImgVideo)) {
            nextState = {
                ...nextState,
                lsImgAndVideo: [...this.props?.dataImgVideo]
            };
        }

        if (this.props.dataEmail) {
            nextState = {
                ...nextState,
                Email: {
                    ...Email,
                    value: this.props.dataEmail,
                    refresh: !Email.refresh
                }
            };
        }

        if (this.props.dataDescription) {
            nextState = {
                ...nextState,
                Description: {
                    ...Description,
                    value: this.props.dataDescription,
                    refresh: !Description.refresh
                }
            };
        }

        this.setState({
            ...nextState
        });
    };

    componentDidMount() {
        VnrBalloonService.hide();
        this.initStateDefault();
        // RNShake.addEventListener('ShakeEvent', () => {
        //     // Your code...
        // });
    }

    componentWillUnmount() {
        // RNShake.removeEventListener('ShakeEvent');
    }

    chooseFile = async (type) => {
        if (!PermissionsAndroid.PERMISSIONS?.READ_MEDIA_IMAGES) {
            PermissionsAndroid.PERMISSIONS = {
                ...PermissionsAndroid.PERMISSIONS,
                READ_MEDIA_IMAGES: 'android.permission.READ_MEDIA_IMAGES'
            };
        }

        if (!PermissionsAndroid.PERMISSIONS?.READ_MEDIA_VIDEO) {
            PermissionsAndroid.PERMISSIONS = {
                ...PermissionsAndroid.PERMISSIONS,
                READ_MEDIA_VIDEO: 'android.permission.READ_MEDIA_VIDEO'
            };
        }

        let options = {
            mediaType: type,
            quality: 0.5,
            multiple: true
        };

        ImagePicker.openPicker({
            ...options
        }).then(async (images) => {
            if (!Array.isArray(images)) return;

            let lsImgAndVideo = [];
            if (Array.isArray(this.props?.dataImgVideo) && this.props?.dataImgVideo.length > 0) {
                lsImgAndVideo = this.props?.dataImgVideo;
            }

            images.map((item) => {
                let file = item,
                    size = file?.size;
                file.name = file?.modificationDate;
                file.uri = file?.path;
                // file.size = file?.fileSize;
                if (Platform.OS == 'ios') {
                    let nameFile = file && file.uri ? file.uri.split('/').pop().split('#')[0].split('?')[0] : '';
                    file.name = nameFile;
                }

                if (file.uri) {
                    lsImgAndVideo.push({
                        id: lsImgAndVideo.length,
                        uri: file.uri,
                        type: type === 'video' ? 'video' : 'img',
                        size
                    });
                }
            });

            if (lsImgAndVideo.length > 0) {
                this.setState({
                    lsImgAndVideo: lsImgAndVideo
                });

                this.props.setDataImgVideo(lsImgAndVideo);
            }
        });
    };

    uploadToFireBase = async (file, CusName = 'Bug') => {
        try {
            // const { video, uploading, tranferred } = this.state;
            if (typeof file === 'string') {
                const fileName = file.substring(file.lastIndexOf('/') + 1);
                const uploadUri = Platform.OS === 'ios' ? file.replace('file://', '') : file;
                let urlDownload = null;
                let isVideo = false;

                const path = `/video-feedback/${CusName}/${moment(new Date()).format('DD-MM-YYYY')}/${fileName}`;
                const temp = storage().ref(path);
                const task = temp.putFile(uploadUri);

                task.on('state_changed', async (snapshot) => {
                    urlDownload = snapshot.ref.path;
                    isVideo = snapshot.metadata.contentType === 'video/mp4' ? true : false;
                    // this.setState({
                    //     tranferred: Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
                    // })
                });

                try {
                    await task;
                } catch (error) {
                    return;
                }

                if (urlDownload) {
                    urlDownload = await storage().ref(urlDownload).getDownloadURL();
                }

                return {
                    status: EnumName.E_SUCCESS,
                    urlDownload,
                    isVideo
                };
            }
        } catch (error) {
            ToasterSevice.showError('HRM_PortalApp_Feedback_ErrorUploadFile');
            return;
        }
    };

    actionSheetOnCLick = (index) => {
        if (this.sheetActions[index].onPress) {
            this.sheetActions[index].onPress();
        }
    };

    handleSendMail = async () => {
        try {
            VnrLoadingSevices.show();
            const { Description, lsImgAndVideo } = this.state;
            const dataListQr = await AsyncStorage.getItem('@DATA_SCANED_QR_LIST'),
                dataListQrJson = dataListQr != null ? JSON.parse(dataListQr) : [],
                qrSelected = dataListQrJson.find((item) => item.isSelect == true);
            const { apiConfig } = dataVnrStorage,
                _uriPor = apiConfig ? apiConfig.uriPor : null;
            const params = this.props?.navigation?.state?.params?.params;
            const namePhone = DeviceInfo.getModel();
            const errorDescription = params?.ErrorDisplay ? JSON.parse(params?.ErrorDisplay) : '';

            let arrSuccessVideo = [];
            let arrSuccessImage = [];

            if (!Description.value || Description.value?.length === 0) {
                VnrLoadingSevices.hide();
                ToasterSevice.showWarning('HRM_PortalApp_Feedback_PleaseEnterDescription');
                return;
            } else if (Description.value?.length > 500) {
                VnrLoadingSevices.hide();
                ToasterSevice.showWarning('HRM_PortalApp_Feedback_DescriptionOverSize500');
                return;
            }

            if (lsImgAndVideo.length > 0) {
                let totalSize = 0;
                lsImgAndVideo.map((item) => {
                    if (item?.size !== undefined && item?.size !== null) totalSize += Number(item?.size);
                });

                if (totalSize / 1024 / 1024 > 15) {
                    ToasterSevice.showWarning('HRM_PortalApp_Feedback_FileOverSize15');
                    return;
                }
            }

            let arrPromise = [];

            // upload file to firebase => take urlDownload file from firebase
            if (lsImgAndVideo.length > 0) {
                lsImgAndVideo.map(async (item) => {
                    if (item?.uri) {
                        arrPromise.push(this.uploadToFireBase(item?.uri, qrSelected?.CusName));
                    }
                });
            }

            await HttpService.MultiRequest(arrPromise)
                .then((res) => {
                    if (res && Array.isArray(res)) {
                        res.map((data) => {
                            if (data && data?.status === EnumName.E_SUCCESS) {
                                if (data?.urlDownload) {
                                    if (data.isVideo) {
                                        arrSuccessVideo.push(data?.urlDownload);
                                    } else {
                                        arrSuccessImage.push(data?.urlDownload);
                                    }
                                }
                            }
                        });
                    }
                })
                .catch(() => {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                });

            const DataFeedback = {
                CusCode: qrSelected?.CusCode ? qrSelected?.CusCode : qrSelected?.CusName ? qrSelected?.CusName : '',
                CusName: qrSelected?.CusName ? qrSelected?.CusName : '',
                VersionCode: qrSelected?.VersionCode,
                UriPor: _uriPor,
                DateError: moment(new Date()).format('DD-MM-YYYY HH:mm:ss'),
                PlatForm: Platform.OS,
                PlatFormVersion: Platform.Version.toString(),
                UserName: dataVnrStorage.currentUser?.headers?.userlogin,
                Email: 'nhan.nguyenthanh@vnresource.org', //Email.value,
                ScreenName: params?.ScreenName ? params?.ScreenName : '',
                DescriptionError: params?.ErrorDisplay ? params?.ErrorDisplay : '',
                StatusError: params?.StatusError ? `${params?.StatusError}` : '',
                NameAPI: errorDescription?.config?.url ? errorDescription?.config?.url : '',
                DescriptionErrorAPI: errorDescription?.message ? errorDescription?.message : '',
                LinkVideo: arrSuccessVideo.join(', '),
                LinkImage: arrSuccessImage.join(', '),
                UserID: dataVnrStorage.currentUser?.headers?.userid,
                ProfileID: dataVnrStorage.currentUser?.info?.ProfileID,
                NamePhone: namePhone ? namePhone : '',
                Note: Description.value ? Description.value : ''
            };

            FeedbackApi(DataFeedback)
                .then((res) => {
                    VnrLoadingSevices.hide();
                    if (res === EnumName.E_Success || res === 'Sucess') {
                        ToasterSevice.showSuccess('HRM_PortalApp_Feedback_EmailSentSuccessfully');
                        this.handleRefresh();
                    }
                })
                .catch(() => {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                });
        } catch (error) {
            ToasterSevice.showError('HRM_PortalApp_Feedback_ErrorSendingMail');
            return;
        }
    };

    render() {
        const { Description, lsImgAndVideo } = this.state;

        const options = this.sheetActions.map((item) => {
            return item.title;
        });

        return (
            <SafeAreaView style={styles.wrapAll}>
                <ScrollView>
                    <View style={styles.container}>
                        <View
                            style={styles.forUser}
                            onLayout={(event) => {
                                const layout = event.nativeEvent.layout;
                                this.layoutHeightItem = layout.height;
                            }}
                        >
                            {/* <VnrTextInput
                                isCheckEmpty={false}
                                fieldValid={true}
                                placeHolder={'example@example.com'}
                                disable={Email.disable}
                                lable={'Email'}
                                style={[
                                    styleSheets.text,
                                    {
                                        height: 30,
                                        fontSize: Size.text,
                                        fontWeight: '500',
                                        paddingVertical: 0,
                                    }
                                ]}
                                // multiline={true}
                                value={Email.value}
                                // onFocus={() => {
                                //     Platform.OS == 'ios' && onScrollToInputIOS(indexDay + 1, this.layoutHeightItem)
                                // }}
                                onChangeText={(text) => {
                                    this.props.setDataEmail(text);
                                    this.setState({
                                        Email: {
                                            ...Email,
                                            value: text,
                                            refresh: !Email.refresh,
                                        },
                                    });
                                }}
                                refresh={Email.refresh}
                            /> */}

                            <VnrTextInput
                                isCheckEmpty={false}
                                fieldValid={true}
                                placeHolder={translate('HRM_PortalApp_Feedback_MyProblem')}
                                disable={Description.disable}
                                lable={Description.lable}
                                style={[styleSheets.text, stylesVnrPickerV3.viewInputMultiline]}
                                multiline={true}
                                value={Description.value}
                                // onFocus={() => {
                                //     Platform.OS == 'ios' && onScrollToInputIOS(indexDay + 1, this.layoutHeightItem)
                                // }}
                                onChangeText={(text) => {
                                    this.props.setDataDescription(text);
                                    this.setState({
                                        Description: {
                                            ...Description,
                                            value: text,
                                            refresh: !Description.refresh
                                        }
                                    });
                                }}
                                refresh={Description.refresh}
                            />

                            <View style={styles.flex1}>
                                <FlatList
                                    data={lsImgAndVideo}
                                    numColumns={5}
                                    columnWrapperStyle={styles.wrapStyleFlastList}
                                    renderItem={({ item }) => {
                                        return (
                                            <View style={styles.viewImgOrVideo}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        if (item?.id !== null && item?.id !== undefined) {
                                                            const arr = lsImgAndVideo.filter((value) => {
                                                                return value?.id !== item.id;
                                                            });
                                                            this.setState(
                                                                {
                                                                    lsImgAndVideo: arr
                                                                },
                                                                () => {
                                                                    this.props.setDataImgVideo(arr);
                                                                }
                                                            );
                                                        }
                                                    }}
                                                    activeOpacity={1}
                                                    style={styles.btnDeleteImgOrVideo}
                                                >
                                                    <IconCancel color={Colors.white} size={16} />
                                                </TouchableOpacity>
                                                <View style={styles.index2}>
                                                    <ViewImg
                                                        key={item}
                                                        source={item.uri}
                                                        showChildren={true}
                                                        type={item.type}
                                                    >
                                                        <Image
                                                            source={{ uri: item.uri }}
                                                            style={styles.watchImgOrVide}
                                                        />
                                                    </ViewImg>
                                                </View>
                                                {item.type === 'video' && (
                                                    <View style={styles.btnPlayVideo}>
                                                        <IconPlayVideo
                                                            color={Colors.primary}
                                                            size={Size.iconSizeHeader}
                                                        />
                                                    </View>
                                                )}
                                            </View>
                                        );
                                    }}
                                    keyExtractor={(item) => item.id}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View>
                    <TouchableOpacity
                        style={styles.btnFunction}
                        onPress={() => {
                            VnrBalloonService.show('VideoScreen');
                            DrawerServices.navigate('Home');
                        }}
                    >
                        <View style={styles.margin12}>
                            <IconVideo color={Colors.primary} size={Size.iconSizeHeader} />
                        </View>
                        <Text style={[styleSheets.lable]}>{translate('HRM_PortalApp_Feedback_ScreenRecording')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btnFunction}
                        onPress={() => {
                            VnrBalloonService.show('TakeScreenshot');
                            DrawerServices.navigate('Home');
                        }}
                    >
                        <View style={styles.margin12}>
                            <IconScreenshot color={Colors.primary} size={Size.iconSizeHeader} />
                        </View>
                        <Text style={[styleSheets.lable]}>{translate('HRM_PortalApp_Feedback_TakeScreenshots')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btnFunction}
                        onPress={() => {
                            this.resActionSheet ? this.resActionSheet.show() : null;
                            // this.chooseFile();
                        }}
                    >
                        <View style={styles.margin12}>
                            <IconImage color={Colors.primary} size={Size.iconSizeHeader} />
                        </View>
                        <Text style={[styleSheets.lable]}>
                            {translate('HRM_PortalApp_Feedback_ChooseFromTheCollection')}
                        </Text>
                    </TouchableOpacity>
                </View>
                <ActionSheet
                    ref={(o) => (this.resActionSheet = o)}
                    //title={'Which one do you like ?'}
                    options={options}
                    cancelButtonIndex={this.sheetActions.length - 1}
                    destructiveButtonIndex={this.sheetActions.length - 1}
                    onPress={(index) => this.actionSheetOnCLick(index)}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    margin12: {
        marginRight: 12
    },
    index2: {
        zIndex: 2,
        elevation: 2
    },
    flex1: {
        flex: 1
    },
    wrapAll: {
        flex: 1,
        backgroundColor: Colors.white
    },
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        alignItems: 'center'
    },

    btnFunction: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopColor: Colors.gray_7,
        borderTopWidth: 0.5,
        paddingHorizontal: 12,
        paddingVertical: 12
    },
    forUser: {
        flex: 1,
        width: '100%'
    },

    wrapStyleFlastList: {
        flex: 1,
        justifyContent: 'flex-start',
        marginVertical: 12
    },

    viewImgOrVideo: {
        marginHorizontal: 6,
        borderRadius: 12,
        backgroundColor: Colors.black
    },

    btnDeleteImgOrVideo: {
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: 22,
        height: 22,
        zIndex: 3,
        elevation: 3,
        right: -8,
        top: -8,
        borderRadius: 22
    },

    watchImgOrVide: {
        width: Size.deviceWidth / 6,
        height: Size.deviceWidth / 6,
        resizeMode: 'contain',
        borderWidth: 0
    },

    btnPlayVideo: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        elevation: 1
    }
});

const mapStateToProps = (state) => {
    return {
        dataImgVideo: state.feedback.dataImgVideo,
        dataEmail: state.feedback.dataEmail,
        dataDescription: state.feedback.dataDescription
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setDataImgVideo: (data) => {
            dispatch(feedback.actions.setDataImgVideo(data));
        },
        setDataEmail: (data) => {
            dispatch(feedback.actions.setDataEmail(data));
        },
        setDataDescription: (data) => {
            dispatch(feedback.actions.setDataDescription(data));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
