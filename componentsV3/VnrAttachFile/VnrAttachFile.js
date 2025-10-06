/* eslint-disable react-native/split-platform-components */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image, PermissionsAndroid } from 'react-native';
import { Colors, CustomStyleSheet, Size, styleSheets, styleValid, stylesScreenDetailV3, stylesVnrPickerV3 } from '../../constants/styleConfig';
import VnrText from '../../components/VnrText/VnrText';
import { VnrLoadingSevices } from '../../components/VnrLoading/VnrLoadingPages';
import { ToasterSevice } from '../../components/Toaster/Toaster';
import Vnr_Function from '../../utils/Vnr_Function';
import {
    IconAttach,
    IconDelete,
    IconDownload,
    IconUpload2,
    IconWarn
} from '../../constants/Icons';
import ManageFileSevice from '../../utils/ManageFileSevice';
import moment from 'moment';
import HttpService from '../../utils/HttpService';
import RNFS from 'react-native-fs';
import { dataVnrStorage } from '../../assets/auth/authentication';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import { translate } from '../../i18n/translate';
import { EnumName } from '../../assets/constant';

const defaultState = {
    isVisibleLoading: false,
    listItemUpload: []
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
    }

    showActionSheet = () => {
        const { disable } = this.props;
        !disable && this.resActionSheet ? this.resActionSheet.show() : null;
    };

    uploadFile = (file, idItem) => {
        const { uri } = this.props;
        let { listItemUpload } = this.state;
        let indexItemFileUploading = listItemUpload.findIndex(value => {
            return value.id == idItem;
        });
        let itemFileUploading = listItemUpload[indexItemFileUploading];

        if (!file || (itemFileUploading && itemFileUploading.status == 'E_FAILED')) {
            return true;
        }
        if (
            file.name.length > 170 ||
            // eslint-disable-next-line no-useless-escape
            Vnr_Function.toNonAccentVietnamese(file.name.replace(/[ `~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '')) ===
            false
        ) {
            const title = file.name
                .split('/')
                .pop()
                .split('#')[0]
                .split('?')[0];
            let ext = ManageFileSevice.getExtfromUri(title);
            if (!ext) {
                ext = file.type.split('/')[1];
            }

            file.name = `${moment().format('YYYYMMDDHHmmssms')}.${ext}`;
        } else {
            // eslint-disable-next-line no-useless-escape
            file.name = file.name.replace(/[ `~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
        }
        let formData = new FormData(),
            configs = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            };
        formData.append('Attachment', file);
        formData.append('mimeType', file.type);
        formData.append('size', file.size);
        formData.append('userLogin', dataVnrStorage.currentUser.headers.userlogin);
        formData.append('fileName', file.name);

        HttpService.Post(uri, formData, configs)
            .then(res => {
                VnrLoadingSevices.hide();
                if (res != null) {
                    const data = res?.Data ? res.Data : null;
                    if (res.Status == EnumName.E_SUCCESS && data) {
                        let resFile = data;
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
                    } else if (res.Status == EnumName.E_FAIL) {
                        if (data && data.message && typeof data.message == 'string') {
                            ToasterSevice.showWarning(data.message, 4000, 'TOP', false);
                            itemFileUploading.statusMessage = data.message;
                            itemFileUploading.status = 'E_FAILED';
                            this.setState({ listItemUpload });
                        } else {
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

    inintItemUpoadAndUploadFile = files => {
        const { listItemUpload } = this.state;
        if (files.length > 0) {
            files.map(item => {
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
                    itemFile = {
                        ...itemFile,
                        status: 'E_FAILED',
                        statusMessage: warning
                    };

                }

                if (!ManageFileSevice.isValidFileType(itemFile.fileName)) {
                    let extAllow = ' .xls,.xlsx,.xlsm,.doc,.docx,.dot,.pdf,.csv,.png,.img,.rar,.zip,.jpg';
                    let warning = translate('HRM_Common_VnrUpload_OnlyUploadFile') + extAllow;
                    itemFile = {
                        ...itemFile,
                        status: 'E_FAILED',
                        statusMessage: warning
                    };

                }

                listItemUpload.push(itemFile);
                item.id = newId;
                item.size = item.size / 1024; // kb đem đi so sánh và lưu ( đơn vị server đang dùng là kb )
                item.status = 'E_FAILED';
            });
            this.setState({ listItemUpload }, () => {
                // this.readFileBase64(files, 0);
                files.map((file) => {
                    this.uploadFile(file, file.id);
                });
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

    renderIconTypeFile = ext => {
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
            if (!Array.isArray(images))
                return;

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
                .then(files => {
                    if (Platform.OS == 'ios') {
                        files.map(item => {
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
                .then(file => {
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

    downloadFile = path => {
        ManageFileSevice.ReviewFile(path);
    };

    removeFile = idFile => {
        const { listItemUpload } = this.state;
        const List = Vnr_Function.removeObjectInArray(listItemUpload, { id: idFile }, 'id');
        this.setState({ listItemUpload: List }, () => {
            this.props.onFinish(this.state.listItemUpload);
        });
    };

    onConfirm = () => {
        const { listItemUpload } = this.state;
        let dataConfirm = listItemUpload.filter(item => {
            return item.status == 'E_SUCCESS';
        });
        this.props.onFinish(dataConfirm);
    };

    onRefreshControl = nextProps => {
        this.initData(nextProps);
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.refresh !== this.props.refresh) {
            this.onRefreshControl(nextProps);
        }
    }

    initData = props => {
        const { value } = props;

        if (!Vnr_Function.CheckIsNullOrEmpty(value)) {
            let _value = value.filter(item => {
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

    actionSheetOnCLick = index => {
        if (this.sheetActions[index].onPress) {
            this.sheetActions[index].onPress();
        }
    };

    componentDidMount() {
        this.initData(this.props);
    }

    render() {
        const { stylePlaceholder } = stylesVnrPickerV3; //stylesVnrPicker.VnrPicker;
        const { listItemUpload } = this.state,
            { fieldValid, isCheckEmpty, lable, children, style, styleUserUpload, isHideIconLeft } = this.props;

        let disable = false;
        let viewListItemUserUpload = <View />;
        let isShowErr = false;
        if (fieldValid && fieldValid === true && isCheckEmpty && isCheckEmpty === true && listItemUpload.length == 0) {
            isShowErr = true;
        } else {
            isShowErr = false;
        }

        const options = this.sheetActions.map(item => {
            return item.title;
        });

        if (!Vnr_Function.CheckIsNullOrEmpty(this.props.disable) && typeof this.props.disable === 'boolean') {
            disable = this.props.disable;
        }

        if (listItemUpload.length > 0) {
            viewListItemUserUpload = (
                <View style={[styles.styleListFileUpload, styleUserUpload]}>
                    {listItemUpload.map(item => {
                        return (
                            <TouchableOpacity style={styles.itemUpload} key={item.id}>
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
                                    {item.status == 'E_SUCCESS' && (
                                        <TouchableOpacity
                                            disabled={disable ? disable : false}
                                            onPress={() => {
                                                this.downloadFile(item.path);
                                            }}
                                            style={styles.bntDownload}
                                        >
                                            <IconDownload size={Size.iconSize} color={Colors.gray_8} />
                                        </TouchableOpacity>
                                    )}

                                    {!disable && (item.status == 'E_SUCCESS' || item.status == 'E_FAILED') && (
                                        <TouchableOpacity
                                            disabled={disable ? disable : false}
                                            onPress={() => {
                                                this.removeFile(item.id);
                                            }}
                                            style={styles.bntRemove}
                                        >
                                            <IconDelete size={Size.iconSize} color={Colors.danger} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            );
        }

        return (
            <View style={styles.flex1}>
                <View style={stylesVnrPickerV3.styContentPicker}>
                    <TouchableOpacity
                        disabled={disable ? disable : false}
                        onPress={() => (!disable && this.resActionSheet ? this.resActionSheet.show() : null)}
                        style={[
                            stylesVnrPickerV3.styBntPicker,
                            isShowErr && stylesVnrPickerV3.styBntPickerError,
                            disable && stylesVnrPickerV3.bntPickerDisable,
                            style && style
                        ]}
                        activeOpacity={!disable ? 0.2 : 1}
                    >
                        {children ? (
                            children
                        ) : (
                            <View
                                style={[
                                    stylesVnrPickerV3.styLeftPicker,
                                    lable && stylesVnrPickerV3.onlyFlRowSpaceBetween
                                ]}
                            >
                                {lable && (
                                    <View
                                        style={[
                                            stylesVnrPickerV3.styLbPicker,
                                            styles.maxWidth60Ali_Center
                                        ]}
                                    >
                                        {
                                            !isHideIconLeft && (
                                                <IconAttach size={Size.iconSize} color={Colors.black} />
                                            )
                                        }
                                        <VnrText
                                            numberOfLines={2}
                                            style={[styleSheets.text, stylesVnrPickerV3.styLbNotHaveValuePicker, isHideIconLeft && CustomStyleSheet.marginLeft(0)]}
                                            i18nKey={lable}
                                        />
                                        {fieldValid && <VnrText style={[styleSheets.text, styleValid]} i18nKey={'*'} />}
                                    </View>
                                )}

                                <View
                                    style={[
                                        stylesVnrPickerV3.styVlPicker,
                                        styles.maxWidth40Jutify_End_Ali_Center,
                                        stylesVnrPickerV3.wrapRightLabel
                                    ]}
                                >
                                    <VnrText
                                        numberOfLines={1}
                                        style={[
                                            styleSheets.text,
                                            stylePlaceholder,
                                            styles.textAlignCenter,
                                            CustomStyleSheet.color(Colors.black),
                                            CustomStyleSheet.marginRight(6)
                                        ]}
                                        i18nKey={'HRM_PortalApp_Please_Attachment'}
                                    />
                                    <IconUpload2 size={16} color={Colors.black} />
                                </View>
                            </View>
                        )}

                        <View style={stylesVnrPickerV3.styRightPicker}>
                            {isShowErr === true && (
                                <View style={stylesVnrPickerV3.styBtnClear}>
                                    <IconWarn color={Colors.red} size={Size.iconSize - 2} />
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>

                    {this.sheetActions && this.sheetActions.length > 1 && (
                        <ActionSheet
                            ref={o => (this.resActionSheet = o)}
                            //title={'Which one do you like ?'}
                            options={options}
                            cancelButtonIndex={this.sheetActions.length - 1}
                            destructiveButtonIndex={this.sheetActions.length - 1}
                            onPress={index => this.actionSheetOnCLick(index)}
                        />
                    )}
                </View>
                {viewListItemUserUpload}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex1: { flex: 1 },
    maxWidth60Ali_Center: { maxWidth: '60%', alignItems: 'center' },
    maxWidth40Jutify_End_Ali_Center: { maxWidth: '40%', justifyContent: 'flex-end', alignItems: 'center' },
    textAlignCenter: { textAlign: 'right' },
    styleListFileUpload: {
        width: '100%',
        backgroundColor: Colors.gray_2,
        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace
    },
    itemUpload: {
        flexDirection: 'row',
        paddingVertical: Size.defineHalfSpace,
        paddingHorizontal: Size.defineHalfSpace,

        alignContent: 'space-around',
        backgroundColor: Colors.white,

        borderRadius: 4,
        // borderWidth: 0.5,
        // borderColor: Colors.gray_5,
        marginBottom: Size.defineHalfSpace
    },
    iconFile: {
        marginRight: Size.defineHalfSpace,
        justifyContent: 'center'
    },
    viewDownload: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        height: '100%',
        marginLeft: Size.defineSpace
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
        paddingVertical: styleSheets.p_5,
        marginRight: Size.defineSpace,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bntRemove: {
        paddingVertical: styleSheets.p_5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
