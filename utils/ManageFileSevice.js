/* eslint-disable react-native/split-platform-components */
/* eslint-disable no-console */
import RNFetchBlob from 'rn-fetch-blob';
import FileViewer from 'react-native-file-viewer';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { VnrLoadingSevices } from '../components/VnrLoading/VnrLoadingPages';
import { ToasterSevice } from '../components/Toaster/Toaster';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import base64 from 'react-native-base64';
import { dataVnrStorage } from '../assets/auth/authentication';
import Vnr_Services from './Vnr_Services';
import moment from 'moment';

export default class ManageFileSevice {
    // Hàm ghi log vào file
    static writeLogToFile = async (logMessage, isOpen = true) => {
        try {
            // Kiểm tra quyền truy cập trên Android
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    ToasterSevice.showError('WRITE_EXTERNAL_STORAGE_DENIED', 5000);
                    return;
                }
            }

            if (!logMessage) return;

            const userName = dataVnrStorage?.currentUser?.headers?.userlogin || '',
                newDate = moment(new Date()).format('DD_MM_YY');
            // Đường dẫn file log (Lưu vào thư mục Documents trên Android hoặc iOS)
            const path = `${RNFetchBlob.fs.dirs.DocumentDir}/app_logs_${userName}_${newDate}.txt`;

            // Kiểm tra nếu file đã tồn tại, thêm log mới vào file
            const exists = await RNFS.exists(path),
                contentLog = typeof logMessage == 'string' ? logMessage : JSON.stringify(logMessage);

            if (exists) {
                await RNFS.appendFile(path, `\n${contentLog}`);
            } else {
                // Tạo file mới nếu chưa tồn tại
                await RNFS.writeFile(path, contentLog);
            }

            !isOpen && ToasterSevice.showError('WRITE_EXTERNAL_STORAGE_SAVE', 5000);

            isOpen &&
                FileViewer.open(path, {
                    showOpenWithDialog: true,
                    showAppsSuggestions: true
                })
                    .then(() => {
                        VnrLoadingSevices.hide();
                    })
                    .catch(() => {
                        VnrLoadingSevices.hide();
                    });
        } catch (error) {
            console.error('Failed to write log to file', error);
        }
    };
    static reverse = (s) => {
        return s.split('').reverse().join('');
    };

    static getExtfromUri = (uri) => {
        let uriRe = this.reverse(uri);
        let type = uriRe.substring(0, uriRe.indexOf('.'));
        return this.reverse(type);
    };
    static async ReviewFile(fileUrl) {
        if (!fileUrl) {
            return;
        }
        VnrLoadingSevices.show();
        const ext = fileUrl.split(/[#?]/)[0].split('.').pop().trim();

        let title = fileUrl
            .split('/')
            .pop()
            .split('#')[0]
            .split('?')[0];
        title = decodeURI(title).trim();
        let dir = `${RNFetchBlob.fs.dirs.DocumentDir}/${title}`;

        const config = {
            fileCache: true,
            appendExt: ext,
            path: dir
        };
        const configOptions = Platform.select({
            ios: {
                ...config
            },
            android: {
                ...config
            }
        });

        RNFetchBlob.config(configOptions)
            .fetch('GET', fileUrl)
            .then(res => {
                let path = Platform.OS === 'android' ? 'file://' + res.path() : '' + res.path();
                FileViewer.open(path,
                    {
                        showOpenWithDialog: true,
                        showAppsSuggestions: true,
                        onDismiss: () => {
                            RNFetchBlob.fs.unlink(res.path());
                        }
                    }).then(() => {
                    VnrLoadingSevices.hide();
                }).catch(() => {
                    VnrLoadingSevices.hide();
                });
            })
            .catch(() => {
                VnrLoadingSevices.hide();
            });
    }

    static async DownloadFileBase64(fileUrlBase64, fileName) {
        if (!fileUrlBase64) {
            return;
        }

        const { dirs } = RNFetchBlob.fs;
        VnrLoadingSevices.show();

        // Define a file path to save the file
        let parts = fileName.split(/\.(?=[^.]+$)/); // Tách ở dấu chấm cuối cùng

        let namePart = parts[0].replace(/[/\s]+/g, '_'), //phần tên file thay ký tự ' ' và / bằng dấu '_'
            extPart = parts[1], // phần đuôi file
            fileDirecName = `${namePart}${moment(new Date()).format('DDMMYYYY_HHmmss')}.${extPart}`;

        const path =
            Platform.OS === 'android'
                ? `${dirs.DownloadDir}` // Android: Lưu vào thư mục Download
                : `${dirs.DocumentDir}`; // iOS: Lưu vào Document directory

        const filePath = `${path}/${fileDirecName}`;

        // Xác định vị trí của ';base64,'
        const base64Marker = ';base64,',
            startIndex = fileUrlBase64.indexOf(base64Marker) + base64Marker.length,
            base64Data = fileUrlBase64.slice(startIndex);

        RNFetchBlob.fs
            .writeFile(filePath, base64Data, 'base64')
            .then(() => {
                VnrLoadingSevices.hide();
                ToasterSevice.showSuccess('DownloadSucceesfull', 5000);
                console.log('File saved successfully at', filePath);
            })
            .catch((error) => {
                VnrLoadingSevices.hide();
                ToasterSevice.showError('HRM_Payroll_ErrorInProcessing', 5000);
                console.log('Error saving file:', error);
            });
    }

    static ActionDownLoad(urlFile) {
        let dir = Platform.OS == 'ios' ? RNFetchBlob.fs.dirs.DocumentDir : RNFetchBlob.fs.dirs.DownloadDir;
        const title = urlFile.split('/').pop().split('#')[0].split('?')[0];
        const ext = this.getExtfromUri(title);
        const isImage = [
            'jpg',
            'jpeg',
            'png',
            'gif',
            'bmp',
            'tiff',
            'tif',
            'webp',
            ' heif',
            'heic',
            'svg',
            'raw',
            'cr2',
            'nef',
            'arw'
        ].includes(ext);
        const folder = isImage ? 'image' : 'file';
        const config = {
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                mediaScannable: true,
                title: title,
                path: `${dir}/${folder}/${title}`
            },
            appendExt: ext
        };
        const configOptions = Platform.select({
            ios: {
                fileCache: config.fileCache,
                path: config.addAndroidDownloads.path,
                title: config.addAndroidDownloads.title,
                appendExt: config.appendExt
            },
            android: config
        });
        return new Promise((resolve) => {
            RNFetchBlob.config({ ...configOptions, timeout: 3000 })
                .fetch('GET', urlFile, {})
                .then((res) => {
                    console.log(res, res?.taskId, res?.data);
                    if (Platform.OS === 'android' && res?.taskId && res?.data) resolve(true);

                    if (res?.respInfo?.status !== 200) resolve(false);
                    resolve(true);
                })
                .catch((err) => {
                    if (
                        Platform.OS === 'android' &&
                        err.message === 'Download manager download failed, the file does not downloaded to destination.'
                    ) {
                        resolve(true);
                    }
                    resolve(false);
                });
        });
    }

    static async ActualDownloadMulti(urlFiles = []) {
        try {
            if (!Array.isArray(urlFiles) || urlFiles.length === 0) return;

            VnrLoadingSevices.show();
            const resAll = urlFiles.map((res) => {
                return this.ActionDownLoad(res);
            });

            const result = await Promise.all(resAll);

            VnrLoadingSevices.hide();
            if (!result.includes(true)) ToasterSevice.showError('HRM_Payroll_ErrorInProcessing', 5000);
            else ToasterSevice.showSuccess('DownloadSucceesfull', 5000);
        } catch (error) {
            VnrLoadingSevices.hide();
            ToasterSevice.showError('HRM_Payroll_ErrorInProcessing', 5000);
        }
    }

    static async ActualDownload(urlFile) {
        VnrLoadingSevices.show();
        const res = await this.ActionDownLoad(urlFile);
        VnrLoadingSevices.hide();
        if (res) ToasterSevice.showSuccess('DownloadSucceesfull', 5000);
        else ToasterSevice.showError('HRM_Payroll_ErrorInProcessing', 5000);
    }
    static async DownloadFile(urlFile) {
        try {
            const granted = await Vnr_Services.checkVersionDeviceGreaterThan33();
            if (granted) {
                this.ActualDownload(urlFile);
            } else {
                Alert.alert('Permission Denied!', 'You need to give storage permission to download the file');
            }
        } catch (err) {
            console.warn(err);
        }
    }
    static async uploadMultiFile() {
        return new Promise((resolve, reject) => {
            try {
                const res = DocumentPicker.pickMultiple({
                    type: [DocumentPicker.types.allFiles]
                });
                resolve(res);
            } catch (err) {
                if (DocumentPicker.isCancel(err)) {
                    reject(err);
                    // User cancelled the picker, exit any dialogs or menus and move on
                } else {
                    throw err;
                }
            }
        });
    }
    static async uploadFile() {
        return new Promise((resolve, reject) => {
            try {
                const res = DocumentPicker.pick({
                    type: [DocumentPicker.types.allFiles]
                });

                resolve(res);
            } catch (err) {
                if (DocumentPicker.isCancel(err)) {
                    reject(err);
                    // User cancelled the picker, exit any dialogs or menus and move on
                } else {
                    throw err;
                }
            }
        });
    }
    static uploadFileConvertContentToText() {
        VnrLoadingSevices.show();
        const typeSupported = ['application/json', 'text/plain', 'application/xml'];
        return new Promise((resolve, reject) => {
            this.uploadFile()
                .then((file) => {
                    if (typeSupported.indexOf(file.type) < 0) {
                        VnrLoadingSevices.hide();
                        ToasterSevice.showError('TypeFileNotSupported', 4000);
                        return false;
                    }
                    let realPath = file.uri;
                    if (Platform.OS == 'ios') {
                        const split = file.uri.split('/');
                        const name = split.pop();
                        const inbox = split.pop();
                        realPath = `${RNFS.TemporaryDirectoryPath}${inbox}/${name}`;
                    }
                    RNFS.readFile(realPath, 'base64')
                        .then((content) => {
                            VnrLoadingSevices.hide();
                            resolve(base64.decode(content));
                        })
                        .catch((error) => {
                            VnrLoadingSevices.hide();
                            ToasterSevice.showError('HRM_Payroll_ErrorInProcessing', 4000);
                            reject(error);
                        });
                })
                .catch((error) => {
                    VnrLoadingSevices.hide();
                    console.log(error);
                });
        });
    }
    static setFileAttachApp(uri) {
        try {
            if (!uri) return null;
            if (typeof uri == 'string') {
                let strFile = uri.split('|')[0],
                    lstFile = strFile.split(','),
                    { apiConfig } = dataVnrStorage,
                    { uriCenter } = apiConfig;

                let listFile = [];
                lstFile.map((fileName) => {
                    let urlDownload = `${uriCenter}/Resources/Uploads/${fileName}`,
                        extFile = this.getExtfromUri(fileName);

                    let valFile = {
                        fileName: fileName,
                        path: urlDownload,
                        size: null,
                        ext: `.${extFile}`
                    };

                    listFile.push(valFile);
                });
                return listFile;
            }

            return null;
        } catch (error) {
            return null;
        }
    }
    static getNameFileFromURI(uri) {
        if (!uri || (uri && typeof uri != 'string')) return '';

        return uri.split('/').pop().split('#')[0].split('?')[0];
    }

    static isValidFileType(filename) {
        // Danh sách các phần mở rộng tệp hợp lệ
        const validExtensions = [
            '.xls',
            '.xlsx',
            '.xlsm',
            '.doc',
            '.docx',
            '.dot',
            '.pdf',
            '.csv',
            '.png',
            '.img',
            '.rar',
            '.zip',
            '.jpg'
        ];

        // Lấy phần mở rộng của tệp
        const fileExtension = this.getExtfromUri(filename);
        console.log(fileExtension, 'fileExtension');
        // Kiểm tra xem phần mở rộng có trong danh sách hợp lệ không
        return validExtensions.includes(`.${fileExtension.toLowerCase()}`);
    }
}
