import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Image,
    // eslint-disable-next-line react-native/split-platform-components
    PermissionsAndroid
} from 'react-native';
import { Colors, Size, styleSheets, stylesVnrPicker, stylesScreenDetailV3 } from '../../constants/styleConfig';
import VnrText from '../VnrText/VnrText';
import { VnrLoadingSevices } from '../../components/VnrLoading/VnrLoadingPages';
import { ToasterSevice } from '../Toaster/Toaster';
import Vnr_Function from '../../utils/Vnr_Function';
import { IconAttach, IconDelete, IconDownload } from '../../constants/Icons';
import ManageFileSevice from '../../utils/ManageFileSevice';
import moment from 'moment';
import HttpService from '../../utils/HttpService';
import RNFS from 'react-native-fs';
import { dataVnrStorage } from '../../assets/auth/authentication';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import { translate } from '../../i18n/translate';
import ModalChangeNameFile from './ModalChangeNameFile';
import DrawerServices from '../../utils/DrawerServices';

const defaultState = {
    isVisibleLoading: false,
    listItemUpload: [],
    isShowModal: false
};

export default class VnrAttachFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...defaultState
            // ...{ stateProps: props },
        };

        this.maxSize = 20;

        this.sheetActions = [
            {
                title: translate('HRM_ChooseFromLibrary'),
                onPress: () => this.showPickerImageLibary()
            },
            {
                title: translate('HRM_PortalApp_ChooseFile_FromApp'),
                onPress: () => this.attachFile()
            },
            {
                title: translate('HRM_Common_Close'),
                onPress: null
            }
        ];
        this.resActionSheet = null;

        this.refModalChangeName = null;
    }

    uploadFile = (file, idItem) => {
        const { uri } = this.props;
        let { listItemUpload } = this.state;
        let indexItemFileUploading = listItemUpload.findIndex((value) => {
            return value.id == idItem;
        });
        let itemFileUploading = listItemUpload[indexItemFileUploading];
        if (!file || (itemFileUploading && itemFileUploading.status == 'E_FAILED')) {
            return true;
        }
        if (
            file.name.length > 170 ||
            // eslint-disable-next-line no-useless-escape
            Vnr_Function.toNonAccentVietnamese(file.name.replace(/[ `~!@#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '')) ===
            false
        ) {
            const title = file.name.split('/').pop().split('#')[0].split('?')[0];
            let ext = ManageFileSevice.getExtfromUri(title);
            if (!ext) {
                ext = file.type.split('/')[1];
            }

            file.name = `${moment().format('YYYYMMDDHHmmssms')}.${ext}`;
        } else {
            // eslint-disable-next-line no-useless-escape
            file.name = file.name.replace(/[ `~!@#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
        }
        let formData = new FormData(),
            configs = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            };
        formData.append('FileAttach', file);
        formData.append(
            'FileModel',
            JSON.stringify({
                mimeType: file.type,
                size: file.size,
                userLogin: dataVnrStorage.currentUser.headers.userlogin,
                fileName: file.name
            })
        );

        HttpService.Post(uri, formData, configs)
            .then((res) => {
                VnrLoadingSevices.hide();
                if (res) {
                    if (res.ActionStatus && !Vnr_Function.CheckIsNullOrEmpty(res.file)) {
                        let resFile = res.file;
                        if (!Vnr_Function.CheckIsNullOrEmpty(itemFileUploading)) {
                            itemFileUploading.id = idItem;
                            itemFileUploading.fileName = resFile.fileName;
                            itemFileUploading.size = resFile.size;
                            itemFileUploading.ext = resFile.ext;
                            itemFileUploading.path = resFile.path;
                            itemFileUploading.status = 'E_SUCCESS';
                        }
                        this.setState({ listItemUpload }, () => {
                            this.onConfirm();
                        });
                    } else if (!res.ActionStatus && typeof res.message == 'string') {
                        ToasterSevice.showWarning(res.message, 4000, 'TOP', false);
                        itemFileUploading.statusMessage = res.message;
                        itemFileUploading.status = 'E_FAILED';
                        this.setState({ listItemUpload });
                    } else if (!Vnr_Function.CheckIsNullOrEmpty(res.message)) {
                        if (!Vnr_Function.CheckIsNullOrEmpty(itemFileUploading)) {
                            itemFileUploading.status = 'E_FAILED';
                            this.setState({ listItemUpload });
                        }
                        ToasterSevice.showError(res.message, 4000, 'TOP', false);
                    } else if (res && typeof res == 'string' && res == 'FAIL') {
                        if (!Vnr_Function.CheckIsNullOrEmpty(itemFileUploading)) {
                            itemFileUploading.status = 'E_FAILED';
                            this.setState({ listItemUpload });
                        }
                    } else if (!Vnr_Function.CheckIsNullOrEmpty(itemFileUploading)) {
                        itemFileUploading.status = 'E_FAILED';
                        this.setState({ listItemUpload });
                    }
                }
            })
            .catch(() => {
                if (!Vnr_Function.CheckIsNullOrEmpty(itemFileUploading)) {
                    itemFileUploading.status = 'E_FAILED';
                    this.setState({ listItemUpload });
                }
                VnrLoadingSevices.hide();
            });
    };

    // readFileBase64 = (files) => {
    //     if (files.length > 0) {
    //         files.map(file => {
    //             let _size = file.size / 1024; // mb
    //             if (_size > this.maxSize) {
    //                 // const warning = translate('HRM_File_MaxSize_Allow') + this.maxSize + 'mb';
    //                 // ToasterSevice.showWarning(warning, 4000, 'TOP');
    //             } else {
    //                 this.uploadFile(file, file.id);
    //             }
    //         });
    //     }
    // };

    inintItemUpoadAndUploadFile = (files) => {
        const { listItemUpload } = this.state;
        if (files.length > 0) {
            files.map((item) => {
                let newId = Vnr_Function.MakeId(20),
                    itemFile = {
                        fileName: item.name,
                        size: item.size / 1024, // kb
                        ext: item.type,
                        status: 'E_PENDING',
                        id: newId
                    };

                if (item.size / 1024 / 1024 > this.maxSize) {
                    // mb
                    let warning = translate('HRM_File_MaxSize_Allow') + this.maxSize + 'mb';
                    ToasterSevice.showError(warning, 5000);
                    itemFile = {
                        ...itemFile,
                        status: 'E_FAILED',
                        statusMessage: warning
                    };
                }

                if (!ManageFileSevice.isValidFileType(itemFile.fileName)) {
                    let extAllow = ' .xls,.xlsx,.xlsm,.doc,.docx,.dot,.pdf,.csv,.png,.img,.rar,.zip,.jpg';
                    let warning = translate('HRM_Common_VnrUpload_OnlyUploadFile') + extAllow;
                    ToasterSevice.showError(warning, 5000);
                    itemFile = {
                        ...itemFile,
                        status: 'E_FAILED',
                        statusMessage: warning
                    };
                }

                listItemUpload.push(itemFile);
                item.id = newId;
                item.size = item.size / 1024; // kb đem đi so sánh và lưu ( đơn vị server đang dùng là kb )
            });
            this.setState({ listItemUpload }, () => {
                files.map((file) => {
                    this.uploadFile(file, file.id);
                });
                // this.readFileBase64(lstFileValid, 0);
            });
        }
    };

    renderStatus = (status, statusMessage) => {
        switch (status) {
            case 'E_PENDING':
                return (
                    <VnrText
                        numberOfLines={1}
                        style={[styleSheets.text, { color: Colors.warning }]}
                        i18nKey={'E_PENDING'}
                    />
                );
            case 'E_SUCCESS':
                return (
                    <VnrText
                        numberOfLines={1}
                        style={[styleSheets.text, { color: Colors.success }]}
                        i18nKey={'E_DONE'}
                    />
                );
            case 'E_FAILED':
                return (
                    <VnrText
                        numberOfLines={2}
                        style={[styleSheets.text, { color: Colors.danger }]}
                        i18nKey={statusMessage ? statusMessage : 'Fail'}
                    />
                );
        }
    };

    renderIconTypeFile = (ext) => {
        //".xls,.xlsx,.xlsm,.doc,.docx,.dot,.pdf,.csv,.png,.img,.rar,.zip,.jpg";
        if (ext == '.xls' || ext == '.xlsx' || ext == '.xlsm')
            return (
                <Image
                    source={require('../../assets/images/icon/IconXLS.png')}
                    style={stylesScreenDetailV3.styIamgeType}
                />
            );
        else if (ext == '.doc' || ext == '.docx' || ext == '.dot')
            return (
                <Image
                    source={require('../../assets/images/icon/IconDoc.png')}
                    style={stylesScreenDetailV3.styIamgeType}
                />
            );
        else if (ext == '.pdf')
            return (
                <Image
                    source={require('../../assets/images/icon/IconPDF.png')}
                    style={stylesScreenDetailV3.styIamgeType}
                />
            );
        else if (ext == '.png' || ext == '.img')
            return (
                <Image
                    source={require('../../assets/images/icon/IconPNG.png')}
                    style={stylesScreenDetailV3.styIamgeType}
                />
            );
        else if (ext == '.jpg')
            return (
                <Image
                    source={require('../../assets/images/icon/IconJPG.png')}
                    style={stylesScreenDetailV3.styIamgeType}
                />
            );
        else if (ext == '.rar')
            return (
                <Image
                    source={require('../../assets/images/icon/IconRar.png')}
                    style={stylesScreenDetailV3.styIamgeType}
                />
            );
        else if (ext == '.zip')
            return (
                <Image
                    source={require('../../assets/images/icon/IconZip.png')}
                    style={stylesScreenDetailV3.styIamgeType}
                />
            );
        else if (ext == '.csv')
            return (
                <Image
                    source={require('../../assets/images/icon/IconCsv.png')}
                    style={stylesScreenDetailV3.styIamgeType}
                />
            );
        else
            return (
                <Image
                    source={require('../../assets/images/icon/IconFile.png')}
                    style={stylesScreenDetailV3.styIamgeType}
                />
            );
    };

    showPickerImageLibary = () => {
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
            mediaType: 'any',
            quality: 0.5,
            multiple: true
        };

        ImagePicker.openPicker({
            ...options
        }).then(async (images) => {
            if (!Array.isArray(images)) return;

            let lsImgAndVideo = [];

            images.map((item) => {
                let file = item;
                file.name = file?.modificationDate;
                file.uri = file?.path;
                file.type = file?.mime;
                // file.size = file?.fileSize;
                let nameFile =
                    file && file.uri
                        ? file.uri
                            .split('/')
                            .pop()
                            .split('#')[0]
                            .split('?')[0]
                        : '';
                file.name = nameFile;

                if (file.uri) {
                    lsImgAndVideo.push(file);
                }
            });

            this.inintItemUpoadAndUploadFile([...lsImgAndVideo]);
        });
    };

    attachFile = () => {
        const { multiFile, uri } = this.props;
        if (Vnr_Function.CheckIsNullOrEmpty(uri)) {
            alert('Please add uri for component');
            return false;
        }
        if (!Vnr_Function.CheckIsNullOrEmpty(multiFile) && typeof multiFile == 'boolean' && multiFile) {
            VnrLoadingSevices.show();
            ManageFileSevice.uploadMultiFile()
                .then((files) => {
                    if (Platform.OS == 'ios') {
                        files.map((item) => {
                            let split = item.uri.split('/');
                            let name = split.pop();
                            let inbox = split.pop();
                            item.uri = `${RNFS.TemporaryDirectoryPath}${inbox}/${name}`;
                        });
                    }

                    this.inintItemUpoadAndUploadFile(files);
                    VnrLoadingSevices.hide();
                })
                .catch(() => {
                    VnrLoadingSevices.hide();
                });
        } else {
            VnrLoadingSevices.show();
            ManageFileSevice.uploadFile()
                .then((file) => {
                    if (Platform.OS == 'ios') {
                        let split = file.uri.split('/');
                        let name = split.pop();
                        let inbox = split.pop();
                        file.uri = `${RNFS.TemporaryDirectoryPath}${inbox}/${name}`;
                    }
                    this.inintItemUpoadAndUploadFile([file]);
                    VnrLoadingSevices.hide();
                })
                .catch(() => {
                    VnrLoadingSevices.hide();
                });
        }
    };

    downloadFile = (path) => {
        ManageFileSevice.ReviewFile(path);
    };

    removeFile = (idFile) => {
        const { listItemUpload } = this.state;
        const List = Vnr_Function.removeObjectInArray(listItemUpload, { id: idFile }, 'id');
        this.setState({ listItemUpload: List }, () => {
            this.props.onFinish(this.state.listItemUpload);
        });
    };

    onConfirm = () => {
        const { listItemUpload } = this.state;
        let dataConfirm = listItemUpload.filter((item) => {
            return item.status == 'E_SUCCESS';
        });
        this.props.onFinish(dataConfirm);
    };

    onRefreshControl = (nextProps) => {
        this.initData(nextProps);
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.refresh !== this.props.refresh) {
            this.onRefreshControl(nextProps);
        }
    }

    initData = (props) => {
        const { value, isCamera } = props;

        if (isCamera) {
            this.sheetActions = [
                {
                    title: translate('HRM_ChooseFromLibrary'),
                    onPress: () => this.showPickerImageLibary()
                },
                {
                    title: translate('HRM_PortalApp_Camera'),
                    onPress: () => this.onCamera()
                },
                {
                    title: translate('HRM_PortalApp_ChooseFile_FromApp'),
                    onPress: () => this.attachFile()
                },
                {
                    title: translate('HRM_Common_Close'),
                    onPress: null
                }
            ];
        }

        if (!Vnr_Function.CheckIsNullOrEmpty(value)) {
            let _value = value.filter((item) => {
                if (!Vnr_Function.CheckIsNullOrEmpty(item.fileName) && !Vnr_Function.CheckIsNullOrEmpty(item.path)) {
                    if (Vnr_Function.CheckIsNullOrEmpty(item.ext)) {
                        item.ext = `.${ManageFileSevice.getExtfromUri(item.path)}`;
                    }
                    let newId = `${moment(new Date()).format()}_${item.fileName}_${item.size}`;
                    item.id = newId;
                    item.status = 'E_SUCCESS';
                    return true;
                } else {
                    return false;
                }
            });
            this.setState({ listItemUpload: _value });
        } else {
            this.setState({ listItemUpload: [] });
        }
    };

    actionSheetOnCLick = (index) => {
        if (this.sheetActions[index].onPress) {
            this.sheetActions[index].onPress();
        }
    };

    componentDidMount() {
        this.initData(this.props);
    }

    requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
                    title: translate('HRM_PortalApp_CameraPermissionAccess'),
                    message: translate('HRM_PortalApp_AppNeedsCameraPermission')
                });
                // If CAMERA Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                return false;
            }
        } else return true;
    };

    requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs write permission'
                    }
                );
                // If WRITE_EXTERNAL_STORAGE Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: err });
            }
            return false;
        } else return true;
    };

    onCamera = async () => {
        try {
            let options = {
                mediaType: 'photo',
                quality: 1,
                videoQuality: 'low',
                durationLimit: 30, //Video max duration in seconds
                saveToPhotos: true
            };
            let isCameraPermitted = await this.requestCameraPermission();
            let isStoragePermitted = await this.requestExternalWritePermission();
            if (isCameraPermitted && isStoragePermitted) {
                ImagePicker.launchCamera(options, (response) => {
                    if (response.didCancel) {
                        return;
                    } else if (response.errorCode == 'camera_unavailable') {
                        return;
                    } else if (response.errorCode == 'permission') {
                        return;
                    } else if (response.errorCode == 'others') {
                        return;
                    }

                    // this.refModalChangeName.onShow();

                    let file = response;

                    if (dataVnrStorage.currentUser.headers.userlogin && moment(new Date()).format('DDMMYYYY_HHmmss')) {
                        file.fileName = `${dataVnrStorage.currentUser.headers.userlogin}_${this.props?.subNameFile ? this.props?.subNameFile + '_' : ''
                        }${moment(new Date()).format('DDMMYYYY_HHmmss')}`;
                        file.name = `${dataVnrStorage.currentUser.headers.userlogin}_${this.props?.subNameFile ? this.props?.subNameFile + '_' : ''
                        }${moment(new Date()).format('DDMMYYYY_HHmmss')}`;
                    }

                    // file.name = file.fileName;
                    file.size = file.fileSize;
                    // if (Platform.OS == 'ios') {
                    //     let nameFile = (file && file.uri) ? file.uri.split('/').pop().split('#')[0].split('?')[0] : '';
                    //     file.name = nameFile;
                    // }

                    this.inintItemUpoadAndUploadFile([file]);
                });
            }
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    render() {
        const { bntPicker, selectPicker, stylePlaceholder } = stylesVnrPicker.VnrPicker;
        const { listItemUpload } = this.state;

        let disable = false;
        let viewListItemUserUpload = <View />;
        const options = this.sheetActions.map((item) => {
            return item.title;
        });

        if (!Vnr_Function.CheckIsNullOrEmpty(this.props.disable) && typeof this.props.disable === 'boolean') {
            disable = this.props.disable;
        }

        if (listItemUpload.length > 0) {
            viewListItemUserUpload = (
                <View style={styles.styleListFileUpload}>
                    {/* <ScrollView> */}
                    {listItemUpload.map((item) => {
                        return (
                            <View
                                style={[
                                    styles.itemUpload,
                                    listItemUpload.length > 1 ? styles.borderBottomWidth05 : styles.borderBottomWidth0
                                ]}
                                key={item.id}
                            >
                                <View style={styles.iconFile}>{this.renderIconTypeFile(item.ext)}</View>
                                <View style={styles.fileInfo}>
                                    <View>
                                        <Text style={styleSheets.lable} numberOfLines={1}>
                                            {ManageFileSevice.getNameFileFromURI(item.fileName)}
                                        </Text>
                                    </View>
                                    <View style={styles.viewSizeAndStatus}>
                                        {this.renderStatus(item.status, item.statusMessage)}
                                    </View>
                                </View>

                                <View style={styles.viewDownload}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            item.status == 'E_SUCCESS' && this.downloadFile(item.path);
                                        }}
                                        style={[
                                            styles.bntDownload,
                                            {
                                                backgroundColor:
                                                    item.status == 'E_SUCCESS'
                                                        ? Colors.primary
                                                        : Colors.greyPrimaryConstraint
                                            }
                                        ]}
                                    >
                                        <IconDownload size={Size.iconSize} color={Colors.white} />
                                    </TouchableOpacity>

                                    {!disable && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                (item.status == 'E_SUCCESS' || item.status == 'E_FAILED') &&
                                                    this.removeFile(item.id);
                                            }}
                                            style={[
                                                styles.bntRemove,
                                                {
                                                    backgroundColor:
                                                        item.status == 'E_SUCCESS' || item.status == 'E_FAILED'
                                                            ? Colors.danger
                                                            : Colors.greyPrimaryConstraint
                                                }
                                            ]}
                                        >
                                            <IconDelete size={Size.iconSize} color={Colors.white} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                    {/* </ScrollView> */}
                </View>
            );
        }

        return (
            <View style={styles.flex1}>
                <View style={[selectPicker, !disable ? styles.enableButton : styles.disableButton]}>
                    <TouchableOpacity
                        onPress={() => (!disable && this.resActionSheet ? this.resActionSheet.show() : null)}
                        style={bntPicker}
                        activeOpacity={!disable ? 0.2 : 1}
                    >
                        <View style={styles.maxWidth90}>
                            <VnrText
                                style={[styleSheets.text, stylePlaceholder]}
                                i18nKey={
                                    !Vnr_Function.CheckIsNullOrEmpty(this.props.placeholder)
                                        ? this.props.placeholder
                                        : 'SELECT_ITEM'
                                }
                            />
                        </View>
                        <View style={styles.maxWidth10}>
                            <IconAttach size={Size.iconSize} color={Colors.black} />
                        </View>
                    </TouchableOpacity>

                    {this.sheetActions && this.sheetActions.length > 1 && (
                        <ActionSheet
                            ref={(o) => (this.resActionSheet = o)}
                            //title={'Which one do you like ?'}
                            options={options}
                            cancelButtonIndex={this.sheetActions.length - 1}
                            destructiveButtonIndex={this.sheetActions.length - 1}
                            onPress={(index) => this.actionSheetOnCLick(index)}
                        />
                    )}
                </View>
                {viewListItemUserUpload}
                <ModalChangeNameFile
                    ref={(ref) => {
                        this.refModalChangeName = ref;
                    }}
                    onFinish={() => { }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex1: {
        flex: 1
    },
    disableButton: {
        opacity: 0.7,
        backgroundColor: Colors.greyPrimaryConstraint
    },
    enableButton: {
        opacity: 1,
        backgroundColor: Colors.white
    },
    maxWidth90: {
        maxWidth: '90%'
    },
    maxWidth10: {
        maxWidth: '10%'
    },
    borderBottomWidth0: {
        borderBottomWidth: 0
    },
    borderBottomWidth05: {
        borderBottomWidth: 0.5
    },
    styleListFileUpload: {
        width: '100%',
        borderColor: Colors.gray_5,
        borderWidth: 0.5,
        marginTop: 10,
        borderRadius: styleSheets.radius_5,
        backgroundColor: Colors.white,
        paddingHorizontal: styleSheets.p_15
    },
    itemUpload: {
        flexDirection: 'row',
        paddingVertical: styleSheets.p_10,
        alignContent: 'space-around',
        borderBottomColor: Colors.grey
    },
    iconFile: {
        marginRight: styleSheets.p_10
    },
    viewDownload: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        height: '100%',
        marginLeft: styleSheets.m_5
    },
    fileInfo: {
        flex: 1,
        justifyContent: 'center'
    },
    viewSizeAndStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: 5
    },
    bntDownload: {
        backgroundColor: Colors.greyPrimaryConstraint,
        paddingVertical: styleSheets.p_5,
        paddingHorizontal: styleSheets.p_10,

        justifyContent: 'center',
        borderRadius: styleSheets.radius_5,
        alignItems: 'center'
    },
    bntRemove: {
        backgroundColor: Colors.greyPrimaryConstraint,
        paddingVertical: styleSheets.p_5,
        flexDirection: 'row',
        paddingHorizontal: styleSheets.p_10,
        borderRadius: styleSheets.radius_5,
        marginLeft: styleSheets.m_10,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
