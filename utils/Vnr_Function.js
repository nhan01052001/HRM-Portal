/* eslint-disable no-useless-escape */
/* eslint-disable no-unexpected-multiline */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-lonely-if */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-fallthrough */
/* eslint-disable no-console */
import React from 'react';

import { Text, View, Linking, TouchableOpacity, Platform, Image, ImageBackground } from 'react-native';
import format from 'number-format.js';
import moment from 'moment';
import VnrText from '../components/VnrText/VnrText';
import ViewImg from '../components/ViewImg/ViewImg';
import ViewMap from '../components/ViewMap/ViewMap';
import {
    styleSheets,
    Size,
    Colors,
    styleScreenDetail,
    stylesScreenDetailV2,
    stylesScreenDetailV3,
    stylesVnrFilter,
    styleApproveProcessHRE
} from '../constants/styleConfig';
import { IconCancel, IconCheck, IconCheckSquare, IconDown, IconStar, IconUnCheckSquare } from '../constants/Icons';
import Color from 'color';
import { ToasterSevice } from '../components/Toaster/Toaster';
import ManageFileSevice from './ManageFileSevice';
import { EnumName, EnumStatus, PlatformURL } from '../assets/constant';
import { translate } from '../i18n/translate';
import { ModalDataSevice } from '../components/modal/ModalShowData';
import { ConfigField } from '../assets/configProject/ConfigField';
import base64 from 'react-native-base64';
import { dataVnrStorage, setdataVnrStorageFromValue } from '../assets/auth/authentication';
import HttpService from './HttpService';
import Rate, { AndroidMarket } from 'react-native-rate';
import DeviceInfo from 'react-native-device-info';
import { PermissionForAppMobile } from '../assets/configProject/PermissionForAppMobile';
import VnrFormatStringType from '../componentsV3/VnrFormatStringType/VnrFormatStringType';
import { ConfigListDetail } from '../assets/configProject/ConfigListDetail';
import VnrFormatStringManyData from '../componentsV3/VnrFormatStringType/VnrFormatStringManyData';

const defaultFormat = 'YYYY-MM-DD HH:mm:ss';
const sizeImg = 44;
export default class Vnr_Function {
    static checkIsHaveConfigListDetail(keyScreen, NameField) {
        // have return true
        const configDetail = ConfigListDetail.value[keyScreen];
        if (configDetail) {
            const indexNameFiled = configDetail.findIndex((item) => item.Name === NameField);
            return indexNameFiled > -1;
        }
        return false;
    }
    static checkPermission(key, rule = 'View') {
        if (key && rule)
            return PermissionForAppMobile.value[key] && PermissionForAppMobile.value[key][rule] ? true : false;
        else return false;
    }
    static rateAppStore() {
        const options = {
            AppleAppID: '6450327312',
            GooglePackageName: 'com.hrmeportal',
            OtherAndroidURL: 'https://play.google.com/store/apps/details?id=com.hrmeportal',
            preferredAndroidMarket: AndroidMarket.Google,
            preferInApp: true,
            openAppStoreIfInAppFails: false,
            fallbackPlatformURL: PlatformURL
        };

        Rate.rate(options, (success, errorMessage) => {
            if (success) {
                console.log(success, 'success');
                setdataVnrStorageFromValue('isFinishedRateApp', true);
                // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
            }
            if (errorMessage) {
                // errorMessage comes from the native code. Useful for debugging, but probably not for users to view
                console.error(`Example page Rate.rate() error: ${errorMessage}`);
            }
        });
    }
    static getUnitIdApp() {
        return new Promise(async (resolve, reject) => {
            try {
                if (Platform.OS === 'ios') {
                    resolve(DeviceInfo.getUniqueId());
                } else {
                    resolve(DeviceInfo.getAndroidId());
                    // 1 số máy andorid không trả ra 1 uni ID nhất định nên tự tạo ID
                    // const uiniqueId = await SInfoService.getItem('E_SAVE_UNIQUEID_ANDROID');
                    // if (uiniqueId != null) {
                    //   resolve(uiniqueId);
                    // } else {
                    //   let makeUniqueId = this.MakeId(32);
                    //   SInfoService.setItem('E_SAVE_UNIQUEID_ANDROID', makeUniqueId);
                    //   resolve(makeUniqueId);
                    // }
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    static parseDateTime(date, resetTime = true) {
        if (!date) return date;

        // format chuẩn Server và đưa date về 00:00:00
        if (moment(date).isValid()) {
            var _date = moment(date).toDate();
            if (resetTime) {
                _date.setHours(0);
                _date.setMinutes(0);
                _date.setSeconds(0);
                _date.setMilliseconds(0);
            }
            return moment(_date).format(defaultFormat);
        } else {
            return date;
        }
    }

    //#region jwtDecode
    static b64DecodeUnicode(str) {
        return decodeURIComponent(
            base64.decode(str).replace(/(.)/g, function (m, p) {
                var code = p.charCodeAt(0).toString(16).toUpperCase();
                if (code.length < 2) {
                    code = '0' + code;
                }
                return '%' + code;
            })
        );
    }
    static base64_url_decode(str) {
        var output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw new Error('base64 string is not of the correct length');
        }

        try {
            return this.b64DecodeUnicode(output);
        } catch (err) {
            return base64.decode(output);
        }
    }
    static jwtDecode(token, options) {
        if (typeof token !== 'string') {
            return null;
        }

        options = options || {};
        let pos = options.header === true ? 0 : 1;

        let part = token.split('.')[pos];
        if (typeof part !== 'string') {
            console.log('Invalid token specified: missing part #');
            return null;
        } else {
            let decoded = null;
            try {
                decoded = this.base64_url_decode(part);
            } catch (e) {
                console.log('Invalid token specified: invalid base64 for part #' + (pos + 1) + ' (' + e.message + ')');
                return null;
            }

            try {
                return JSON.parse(decoded);
            } catch (e) {
                console.log('Invalid token specified: invalid json for part #' + (pos + 1) + ' (' + e.message + ')');
                return null;
            }
        }
    }
    //#endregion

    static checkIsPath(value) {
        const regex = /(http[s]?:\/\/)?([^\/\s]+\/)(.*)/,
            namePath = value.split('/').pop().split('#')[0].split('?')[0];
        if (regex.test(value) && namePath !== '') return true;
        else return false;
    }

    static formatDateAPI(value, isEndOfDay, isStartDay) {
        if (value) {
            if (isEndOfDay) return moment(value).endOf('day').format('YYYY-MM-DD HH:mm:ss');
            else if (isStartDay) return moment(value).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            else return moment(value).format('YYYY-MM-DD HH:mm:ss');
        } else return null;
    }

    static checkIsShowConfigField(screenName, field) {
        let _configField =
            ConfigField && ConfigField.value && screenName && ConfigField.value[screenName]
                ? ConfigField.value[screenName]['Hidden']
                : [];
        return _configField.findIndex((key) => key == field) > -1 ? false : true;
    }

    static renderIconTypeFile = (ext) => {
        //".xls,.xlsx,.xlsm,.doc,.docx,.dot,.pdf,.csv,.png,.img,.rar,.zip,.jpg";
        if (ext == '.xls' || ext == '.xlsx' || ext == '.xlsm')
            return (
                <Image
                    source={require('../assets/images/icon/IconXLS.png')}
                    style={stylesScreenDetailV3.styIamgeType}
                />
            );
        else if (ext == '.doc' || ext == '.docx' || ext == '.dot')
            return (
                <Image
                    source={require('../assets/images/icon/IconDoc.png')}
                    style={stylesScreenDetailV3.styIamgeType}
                />
            );
        else if (ext == '.pdf')
            return (
                <Image
                    source={require('../assets/images/icon/IconPDF.png')}
                    style={stylesScreenDetailV3.styIamgeType}
                />
            );
        else if (ext == '.png' || ext == '.img')
            return (
                <Image
                    source={require('../assets/images/icon/IconPNG.png')}
                    style={stylesScreenDetailV3.styIamgeType}
                />
            );
        else if (ext == '.jpg')
            return (
                <Image
                    source={require('../assets/images/icon/IconJPG.png')}
                    style={stylesScreenDetailV3.styIamgeType}
                />
            );
        else if (ext == '.rar')
            return (
                <Image
                    source={require('../assets/images/icon/IconRar.png')}
                    style={stylesScreenDetailV3.styIamgeType}
                />
            );
        else if (ext == '.zip')
            return (
                <Image
                    source={require('../assets/images/icon/IconZip.png')}
                    style={stylesScreenDetailV3.styIamgeType}
                />
            );
        else if (ext == '.csv')
            return (
                <Image
                    source={require('../assets/images/icon/IconCsv.png')}
                    style={stylesScreenDetailV3.styIamgeType}
                />
            );
        else
            return (
                <Image
                    source={require('../assets/images/icon/IconFile.png')}
                    style={stylesScreenDetailV3.styIamgeType}
                />
            );
    };

    static formatTimeAPI(value) {
        if (value) return moment(value).format('HH:mm');
        else return null;
    }

    static convertTextToColor(value) {
        try {
            if (!this.CheckIsNullOrEmpty(value) && typeof value == 'string' && value.includes(',')) {
                const [num1, num2, num3, opacity] = value.split(',');
                if (num1 && num2 && num3 && opacity) {
                    return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
                } else {
                    return value;
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    static MakeId(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return `${new Date().getSeconds()}${result}${new Date().getMilliseconds()}`;
    }

    static CheckIsNullOrEmpty(data) {
        if (data !== undefined && data !== null && data !== '' && data !== 'NaN') return false;
        else return true;
    }

    static CheckContains(dataItem, fieldQuery, query) {
        if (dataItem[fieldQuery] && dataItem[fieldQuery].toLowerCase().includes(query.toLowerCase())) {
            return true;
        }
        return false;
    }

    static removeObjectInArray(arr, object, valueField) {
        const indexObject = arr.findIndex((value) => {
            return value[valueField] == object[valueField];
        });
        if (indexObject >= 0) {
            arr.splice(indexObject, 1);
            return arr;
        } else {
            return arr;
        }
    }

    static mathRoundNumber(number) {
        if (typeof number == 'number') {
            return Math.round(number * 100) / 100;
        } else {
            return number;
        }
    }

    static formatNumber(number) {
        if (number == 0) {
            return '0';
        }

        if (number) {
            return format('#,###.#', number);
        }
    }

    static async openLink(url) {
        // if (url == 'employeeapp://home/World') {
        //   // vì chạy hàm Linking.canOpenURL ios sẽ vô kiểm tra trong file info.plit chứ thêm vô sẽ bị lỗi
        //   // tạm thời cho chạy như vậy để fix.
        //   try {
        //     await Linking.openURL(url);
        //   } catch (error) {
        //     ToasterSevice.showError('HRM_PortalApp_HRIS_HRMS_Open_Error', 5000)
        //   }
        // }
        // else {
        //   const supported = await Linking.canOpenURL(url);
        //   if (supported) {
        //     await Linking.openURL(url);
        //   } else {
        //     ToasterSevice.showError(`Don't know how to open this URL: ${url}`);
        //     // Alert.alert(`Don't know how to open this URL: ${url}`);
        //   }
        // }

        try {
            await Linking.openURL(url);
        } catch (error) {
            ToasterSevice.showError('HRM_PortalApp_HRIS_HRMS_Open_Error', 5000);
        }
    }

    static getOriginFromUrl(urlString) {
        if (urlString == null) return null;

        const match = urlString.match(/^(https?:\/\/[^\/]+)/);
        return match ? match[1] : null;
    }

    static async downloadFileAttach(path) {
        //Vnr_Function.openLink(`market://details?id=com.portal4edu`) ==> open CH play tu app
        // Vnr_Function.openLink(`itms-apps://itunes.apple.com/us/app/id${1498286846}?mt=81`)
        // if (Platform.OS == 'ios') {
        //   ManageFileSevice.ReviewFile(path);
        // } else {
        //   ManageFileSevice.DownloadFile(path);
        // }
        ManageFileSevice.ReviewFile(path);
    }

    static formatStringType(data, col) {
        const { textValueInfo } = styleScreenDetail,
            styTextValue = { ...styleSheets.text, ...textValueInfo };
        if (this.CheckIsNullOrEmpty(data[col.Name]) === false) {
            if (col.Name == 'StatusView') {
                let _colorStatus = null;
                if (data.itemStatus) {
                    const { colorStatus } = data.itemStatus;
                    _colorStatus = colorStatus != null ? this.convertTextToColor(colorStatus) : null;
                } else if (data.colorStatus) {
                    _colorStatus = this.convertTextToColor(data.colorStatus);
                }

                return (
                    <Text
                        style={[
                            styTextValue,
                            _colorStatus !== null && {
                                color: _colorStatus
                            }
                        ]}
                    >
                        {data[col.Name]}
                    </Text>
                );
            } else if (col.DataType && col.DataType.toLowerCase() == 'datetime') {
                return <Text style={styTextValue}>{moment(data[col.Name]).format(col.DataFormat)}</Text>;
            } else if (col.DataType && col.DataType.toLowerCase() == 'stringcolor') {
                let _colorStatus = null;
                if (col.FieldColor && data[col.FieldColor]) {
                    _colorStatus = data[col.FieldColor];
                }
                return (
                    <Text
                        style={[
                            styTextValue,
                            _colorStatus !== null && {
                                color: _colorStatus
                            }
                        ]}
                    >
                        {data[col.Name]}
                    </Text>
                );
            } else if (col.DataType && col.DataType.toLowerCase() == 'double') {
                let value = format(col.DataFormat, data[col.Name]);
                if (value && value.indexOf(',') == 0) {
                    value = format('0,##', data[col.Name]);
                }

                return <Text style={styTextValue}>{value}</Text>;
            } else if (col.DataType && col.DataType.toLowerCase() == 'fileattach') {
                if (typeof data[col.Name] === 'string') {
                    const listFile = data[col.Name].split(',');
                    return listFile.map((file, index) => (
                        <TouchableOpacity key={index} onPress={() => this.downloadFileAttach(file)}>
                            <Text
                                style={[
                                    styTextValue,
                                    {
                                        color: Colors.primary,
                                        textDecorationLine: 'underline',
                                        textDecorationStyle: 'solid',
                                        textDecorationColor: Colors.primary
                                    }
                                ]}
                            >
                                {file}
                            </Text>
                        </TouchableOpacity>
                    ));
                } else if (Array.isArray(data[col.Name])) {
                    const listFile = data[col.Name];
                    return (
                        <View>
                            {listFile.map((file, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={{ marginBottom: Size.defineSpace }}
                                    onPress={() => this.downloadFileAttach(file.path)}
                                >
                                    <Text
                                        style={[
                                            styTextValue,
                                            {
                                                color: Colors.primary,
                                                textDecorationLine: 'underline',
                                                textDecorationStyle: 'solid',
                                                textDecorationColor: Colors.primary
                                            }
                                        ]}
                                    >
                                        {file.fileName}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    );
                }
            } else if (col.DataType && col.DataType.toLowerCase() == 'bool') {
                return data[col.Name] ? (
                    <IconCheckSquare size={Size.iconSize} color={Colors.primary} />
                ) : (
                    <IconUnCheckSquare size={Size.iconSize} color={Colors.primary} />
                );
            } else if (col.DataType && col.DataType.toLowerCase() == 'string') {
                switch (col.DataFormat) {
                    case 'E_IMG':
                        return <ViewImg format={col.formatImage} source={col.source} />;
                    case 'E_MAP':
                        return <ViewMap x={col.x} y={col.y} />;
                    case 'E_LINK':
                        return (
                            <TouchableOpacity onPress={() => this.openLink(col.url)}>
                                <VnrText i18n={'HRM_OutLink'} style={styTextValue} />
                            </TouchableOpacity>
                        );
                    default:
                        return <Text style={styTextValue}>{data[col.Name]}</Text>;
                }
            } else {
                return <Text style={styTextValue}>{data[col.Name]}</Text>;
            }
        } else if (col.DataType && col.DataType.toLowerCase() == 'bool') {
            return data[col.Name] ? (
                <IconCheckSquare size={Size.iconSize} color={Colors.primary} />
            ) : (
                <IconUnCheckSquare size={Size.iconSize} color={Colors.primary} />
            );
        } else {
            return <Text />;
        }
    }

    static formatStringTypeV2 = (data, col) => {
        const EnumTypeFormatRender = {
            E_GROUP: 'E_GROUP', // hiểu thị tiêu đề group
            E_FILEATTACH: 'E_FILEATTACH', // hiển thị file đính kèm
            E_LIMIT: 'E_LIMIT', // hiển thị vượt trần
            E_USERAPPROVE1: 'E_USERAPPROVE1', // hiển thị cấp duyệt 1
            E_USERAPPROVE2: 'E_USERAPPROVE2', // hiển thị cấp duyệt 2
            E_USERAPPROVE3: 'E_USERAPPROVE3', // hiển thị cấp duyệt 3
            E_USERAPPROVE4: 'E_USERAPPROVE4', // hiển thị cấp duyệt 4
            E_REASON: 'E_REASON', // hiển thị lý do,
            E_STATUS: 'E_STATUS', // hiển thị trạng thái
            E_COMMON: 'E_COMMON', // (dateItem,string,colorString, double,bool)
            E_SHOW_MORE_INFO: 'E_SHOW_MORE_INFO',
            E_NODATA: 'E_NODATA'
        };
        const configAlign = ConfigListDetail.configAlign;
        let isAlignLayout = true;
        if (configAlign === 'E_LEFT_LAYOUT') {
            isAlignLayout = false;
        } else if (configAlign === 'E_ALIGN_LAYOUT') {
            isAlignLayout = true;
        }

        const styles = stylesScreenDetailV2;
        const { styTextValueInfo } = styles;
        let styTextValue = {
                ...styleSheets.text,
                ...styTextValueInfo,
                ...(!isAlignLayout ? { textAlign: 'left' } : {})
            },
            styTextLable = { ...styleSheets.lable, ...{ textAlign: 'left' } },
            styHideBorder = {};
        // styTextGroup = {};

        if (col && col.IsBold) {
            styTextValue = {
                ...styTextValue,
                color: Colors.black,
                fontWeight: 'bold'
            };

            styTextLable = {
                ...styTextLable,
                color: Colors.black,
                fontWeight: 'bold'
            };
        }

        if (col && col.IsItalic) {
            styTextValue = {
                ...styTextValue,
                ...styleSheets.textItalic,
                color: Colors.gray_7
            };

            styTextLable = {
                ...styTextLable,
                ...styleSheets.textItalic
            };
        }

        if (col && col.IsHideBorder) {
            styHideBorder = {
                borderTopWidth: 0
            };
        }

        if (col && col.ValueColor) {
            styTextValue = {
                ...styTextValue,
                color: col.ValueColor
            };

            // styTextGroup = {
            //     ...styles.styTextGroup,
            //     color: col.ValueColor
            // };
        }
        if (
            col.IsNullOrEmpty &&
            col.TypeView !== EnumTypeFormatRender.E_GROUP &&
            //&& this.CheckIsNullOrEmpty(col.DisplayKey)
            this.CheckIsNullOrEmpty(data[col.Name])
        ) {
            return <View />;
        }

        // không hiển thị dữ liệu là 0
        if (
            col.IsValueZero &&
            col.TypeView !== EnumTypeFormatRender.E_GROUP &&
            (data[col.Name] == 0 || data[col.Name] == '0')
        ) {
            return <View />;
        }

        if (col.TypeView == EnumTypeFormatRender.E_GROUP) {
            //reder group
            return (
                <View key={col.Label} style={styles.styItemContentGroup}>
                    <View style={styles.viewLable}>
                        <VnrText
                            style={[styleSheets.lable, styles.styTextGroup]}
                            i18nKey={col.DisplayKey}
                            value={col.DisplayKey}
                        />
                    </View>
                </View>
            );
        } else if (col.TypeView == EnumTypeFormatRender.E_FILEATTACH) {
            // render fileAttach
            if (typeof data[col.Name] === 'string') {
                const listFile = data[col.Name].split(',');
                return (
                    <View key={col.Label} style={[styles.styItemContent, { padding: 0, flexDirection: 'column' }]}>
                        <View style={styles.viewLable}>
                            <VnrText
                                style={[styleSheets.lable, styles.styTextLableInfo]}
                                i18nKey={col.DisplayKey}
                                value={col.DisplayKey}
                            />
                        </View>
                        {listFile.length > 0 && (
                            <View style={styles.styViewFileAttach}>
                                {listFile.map((file, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.styContentFile}
                                        onPress={() => this.downloadFileAttach(file.path)}
                                    >
                                        {this.renderIconTypeFile(file.ext)}
                                        <View style={styles.viewLable}>
                                            <Text style={[styleSheets.text, styles.styTextDownload]} numberOfLines={1}>
                                                {ManageFileSevice.getNameFileFromURI(file.fileName)}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                );
            } else if (Array.isArray(data[col.Name])) {
                const listFile = data[col.Name];
                return (
                    <View key={col.Label} style={[styles.styItemContent, { padding: 0, flexDirection: 'column' }]}>
                        <View style={styles.viewLable}>
                            <VnrText
                                style={[styleSheets.lable, styles.styTextLableInfo]}
                                i18nKey={col.DisplayKey}
                                value={col.DisplayKey}
                            />
                        </View>

                        {listFile.length > 0 && (
                            <View style={styles.styViewFileAttach}>
                                {listFile.map((file, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.styContentFile}
                                        onPress={() => this.downloadFileAttach(file.path)}
                                    >
                                        {this.renderIconTypeFile(file.ext)}
                                        <View style={styles.viewLable}>
                                            <Text style={[styleSheets.text, styles.styTextDownload]} numberOfLines={1}>
                                                {ManageFileSevice.getNameFileFromURI(file.fileName)}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                );
            }
        } else if (col.TypeView == EnumTypeFormatRender.E_REASON) {
            // render nguyen nhan
            if (data.Status === EnumName.E_CANCEL) {
                return (
                    <View key={col.Label} style={styles.styItemContent}>
                        <View style={styles.viewLable}>
                            <VnrText
                                style={[styleSheets.lable, styles.styTextLableInfo]}
                                i18nKey={'HRM_Attendance_Roster_CommentCancel'}
                            />
                        </View>
                        <View style={styles.styViewValue}>
                            <Text style={styTextValue}>
                                {col.NameCancel && data[col.NameCancel] ? data[col.NameCancel] : ''}
                            </Text>
                        </View>
                    </View>
                );
            } else if (data.Status === EnumStatus.E_REJECTED || data.Status === EnumStatus.E_REJECT) {
                return (
                    <View key={col.Label} style={styles.styItemContent}>
                        <View style={[styles.viewLable, !isAlignLayout && styles.viewLableLeft]}>
                            <VnrText
                                style={[styleSheets.lable, styles.styTextLableInfo]}
                                i18nKey={'HRM_Attendance_Leaveday_DeclineReason'}
                            />
                        </View>
                        <View style={[styles.styViewValue, !isAlignLayout && styles.styViewValueLeft]}>
                            <Text style={styTextValue}>
                                {col.NameReject && data[col.NameReject] ? data[col.NameReject] : ''}
                            </Text>
                        </View>
                    </View>
                );
            } else {
                return (
                    <View key={col.Label} style={styles.styItemContent}>
                        <View style={[styles.viewLable, !isAlignLayout && styles.viewLableLeft]}>
                            <VnrText style={[styleSheets.lable, styles.styTextLableInfo]} i18nKey={col.DisplayKey} />
                        </View>
                        <View style={[styles.styViewValue, !isAlignLayout && styles.styViewValueLeft]}>
                            <Text style={styTextValue}>{data[col.Name]}</Text>
                        </View>
                    </View>
                );
            }
        } else if (col.TypeView == EnumTypeFormatRender.E_STATUS) {
            // render Trạng thái
            let _colorStatus = null,
                _borderStatusView = null,
                _timeStatus = null,
                _bgStatusView = null;

            let checkShowStatusCancel =
                data.RequestCancelStatus &&
                (data.RequestCancelStatus == 'E_SUBMIT_REQUESTCANCEL' ||
                    data.RequestCancelStatus == 'E_APPROVED1_REQUESTCANCEL' ||
                    data.RequestCancelStatus == 'E_FIRST_APPROVED_REQUESTCANCEL' ||
                    data.RequestCancelStatus == 'E_APPROVED2_REQUESTCANCEL' ||
                    data.RequestCancelStatus == 'E_APPROVED3_REQUESTCANCEL');

            if (checkShowStatusCancel) {
                const { colorStatus, borderStatus, bgStatus } = data.itemStatusCancel;
                _borderStatusView = borderStatus ? this.convertTextToColor(borderStatus) : null;
                _bgStatusView = bgStatus ? this.convertTextToColor(bgStatus) : null;
                _colorStatus = colorStatus != null ? this.convertTextToColor(colorStatus) : null;
            } else if (data.itemStatus) {
                const { colorStatus, borderStatus, bgStatus } = data.itemStatus;
                _borderStatusView = borderStatus ? this.convertTextToColor(borderStatus) : null;
                _bgStatusView = bgStatus ? this.convertTextToColor(bgStatus) : null;
                _colorStatus = colorStatus != null ? this.convertTextToColor(colorStatus) : null;
            } else if (data.colorStatus) {
                _colorStatus = this.convertTextToColor(data.colorStatus);
            }
            console.log(data[col.Name], 'data.Status');
            if (data.Status) {
                // Trạng thái yêu cầu hủy
                if (checkShowStatusCancel) {
                    data[col.Name] = translate('HRM_Common_WaittingCancel');
                    _timeStatus = `${translate('HRM_Att_Leaveday_LeavedayList_DateRequest')}:  ${moment(
                        data.DateUpdate
                    ).format('DD/MM/YYYY')}`;
                } else if (
                    [
                        EnumStatus.E_APPROVE,
                        EnumStatus.E_APPROVED,
                        EnumStatus.E_APPROVED1,
                        EnumStatus.E_APPROVED2,
                        EnumStatus.E_APPROVED3,
                        EnumStatus.E_WAIT_APPROVED,
                        EnumStatus.E_FIRST_APPROVED
                    ].includes(data.Status)
                ) {
                    // hiển thị ngày duyệt
                    if (data.DateApprove) {
                        _timeStatus = `${translate('HRM_Attendance_Leaveday_DateApprove')}:  ${
                            data.DateApprove ? moment(data.DateApprove).format('DD/MM/YYYY') : ''
                        }`;
                    } else if (data.ApprovalDate) {
                        _timeStatus = `${translate('HRM_Attendance_Leaveday_DateApprove')}:  ${
                            data.ApprovalDate ? moment(data.ApprovalDate).format('DD/MM/YYYY') : ''
                        }`;
                    } else {
                        _timeStatus = `${translate('HRM_Attendance_Leaveday_DateApprove')}:  ${
                            data.DateUpdate ? moment(data.DateUpdate).format('DD/MM/YYYY') : ''
                        }`;
                    }
                } else if (data.Status === EnumName.E_REJECT || data.Status === EnumName.E_REJECTED) {
                    // hiển thị ngày từ chối
                    _timeStatus = `${translate('HRM_Attendance_Leaveday_DateReject')}:  ${
                        data.DateReject ? moment(data.DateReject).format('DD/MM/YYYY') : ''
                    }`;
                } else if (data.Status === EnumName.E_CANCEL) {
                    // hiển thị ngày hủy
                    _timeStatus = `${translate('DateCancel')}:  ${
                        data.DateCancel ? moment(data.DateCancel).format('DD/MM/YYYY') : ''
                    }`;
                } else if (data.Status === EnumStatus.E_SUBMIT_TEMP) {
                    // hiển thị ngày lưu tạm
                    _timeStatus = `${translate('HRM_Att_Leaveday_LeavedayList_DateSubmitTemp')}:  ${
                        data.DateUpdate ? moment(data.DateUpdate).format('DD/MM/YYYY') : ''
                    }`;
                } else if (data.Status === EnumName.E_CONFIRM) {
                    // hiển thị ngày xác nhận
                    _timeStatus = `${translate('HRM_Attendance_Overtime_WorkDateConfirm')}:  ${moment(
                        data.DateConfirm
                    ).format('DD/MM/YYYY')}`;
                } else if (data.DateUpdate) {
                    // hiển thị ngày yêu cầu
                    _timeStatus = `${translate('HRM_Att_Leaveday_LeavedayList_DateRequest')}:  ${moment(
                        data.DateUpdate
                    ).format('DD/MM/YYYY')}`;
                }
            } else if (!_timeStatus && data[col.Name] && data.DateUpdate) {
                // hiển thị ngày yêu cầu
                _timeStatus = `${translate('HRM_Common_DateUpdate')}:  ${moment(data.DateUpdate).format('DD/MM/YYYY')}`;
            }

            return (
                <View
                    style={[
                        styles.styViewStatusColor,
                        {
                            borderColor: _borderStatusView ? _borderStatusView : Colors.gray_10,
                            backgroundColor: _bgStatusView ? _bgStatusView : Colors.white
                        }
                    ]}
                >
                    <Text
                        style={[
                            styTextValue,
                            _colorStatus !== null && {
                                color: _colorStatus
                            }
                        ]}
                    >
                        {data[col.Name]}
                    </Text>

                    {_timeStatus !== null && (
                        <Text
                            style={[
                                styTextValue,
                                styles.styTextValueDateTimeStatus,
                                _colorStatus !== null && {
                                    color: _colorStatus
                                }
                            ]}
                        >
                            {_timeStatus}
                        </Text>
                    )}
                </View>
            );
        } else if (
            [
                EnumTypeFormatRender.E_USERAPPROVE1,
                EnumTypeFormatRender.E_USERAPPROVE2,
                EnumTypeFormatRender.E_USERAPPROVE3,
                EnumTypeFormatRender.E_USERAPPROVE4
            ].includes(col.TypeView)
        ) {
            let isShowClassSalaryName = this.checkIsShowConfigField('ScreenViewDetail', 'ClassSalaryName');
            // render Cấp duyệt
            if (EnumTypeFormatRender.E_USERAPPROVE1 === col.TypeView) {
                // render Cấp duyệt 1
                return (
                    <View key={col.Label} style={styles.styItemContent}>
                        <View style={styles.viewLable}>
                            <VnrText
                                style={[styleSheets.lable, styles.styTextLableInfo]}
                                i18nKey={col.DisplayKey}
                                value={col.DisplayKey}
                            />
                        </View>
                        <View style={styles.styViewValue}>
                            {data.UserApproveID1ClassSalaryName != null && isShowClassSalaryName && (
                                <Text style={styTextValue}>{data.UserApproveID1ClassSalaryName}</Text>
                            )}
                            <View style={styles.styInfoApprove}>
                                {/* <Image source={imageAvatar} style={styles.styAvatarApprove} /> */}
                                <Text style={[styleSheets.text, styles.styNameApprove]}>{data[col.Name]}</Text>
                            </View>
                        </View>
                    </View>
                );
            } else if (EnumTypeFormatRender.E_USERAPPROVE2 === col.TypeView) {
                // render Cấp duyệt 2
                return (
                    <View key={col.Label} style={styles.styItemContent}>
                        <View style={styles.viewLable}>
                            <VnrText
                                style={[styleSheets.lable, styles.styTextLableInfo]}
                                i18nKey={col.DisplayKey}
                                value={col.DisplayKey}
                            />
                        </View>
                        <View style={styles.styViewValue}>
                            {data.UserApproveID2ClassSalaryName != null && isShowClassSalaryName && (
                                <Text style={styTextValue}>{data.UserApproveID2ClassSalaryName}</Text>
                            )}
                            <View style={styles.styInfoApprove}>
                                {/* <Image source={imageAvatar} style={styles.styAvatarApprove} /> */}
                                <Text style={[styleSheets.text, styles.styNameApprove]}>{data[col.Name]}</Text>
                            </View>
                        </View>
                    </View>
                );
            } else if (EnumTypeFormatRender.E_USERAPPROVE3 === col.TypeView) {
                // render Cấp duyệt 3
                return (
                    <View key={col.Label} style={styles.styItemContent}>
                        <View style={styles.viewLable}>
                            <VnrText
                                style={[styleSheets.lable, styles.styTextLableInfo]}
                                i18nKey={col.DisplayKey}
                                value={col.DisplayKey}
                            />
                        </View>
                        <View style={styles.styViewValue}>
                            {data.UserApproveID3ClassSalaryName != null && isShowClassSalaryName && (
                                <Text style={styTextValue}>{data.UserApproveID3ClassSalaryName}</Text>
                            )}
                            <View style={styles.styInfoApprove}>
                                {/* <Image source={imageAvatar} style={styles.styAvatarApprove} /> */}
                                <Text style={[styleSheets.text, styles.styNameApprove]}>{data[col.Name]}</Text>
                            </View>
                        </View>
                    </View>
                );
            } else if (EnumTypeFormatRender.E_USERAPPROVE4 === col.TypeView) {
                // render Cấp duyệt 4
                return (
                    <View key={col.Label} style={styles.styItemContent}>
                        <View style={styles.viewLable}>
                            <VnrText
                                style={[styleSheets.lable, styles.styTextLableInfo]}
                                i18nKey={col.DisplayKey}
                                value={col.DisplayKey}
                            />
                        </View>
                        <View style={styles.styViewValue}>
                            {data.UserApproveID4ClassSalaryName != null && isShowClassSalaryName && (
                                <Text style={styTextValue}>{data.UserApproveID4ClassSalaryName}</Text>
                            )}
                            <View style={styles.styInfoApprove}>
                                {/* <Image source={imageAvatar} style={styles.styAvatarApprove} /> */}
                                <Text style={[styleSheets.text, styles.styNameApprove]}>{data[col.Name]}</Text>
                            </View>
                        </View>
                    </View>
                );
            }
        } else if (col.TypeView == EnumTypeFormatRender.E_LIMIT) {
            //reder Lỗi vi phạm đăng lý
            return data[col.Name] ? (
                <View style={styles.styViewWarning}>
                    <Text style={[styleSheets.lable, styles.styWarText]}>{data[col.Name]}</Text>
                </View>
            ) : (
                <View />
            );
        } else if (col.TypeView == EnumTypeFormatRender.E_SHOW_MORE_INFO) {
            //reder Show more info
            return col.ConfigListDetail && col.ConfigListDetail.length > 0 ? (
                <TouchableOpacity
                    style={styles.styViewBtnShowHide}
                    onPress={() =>
                        ModalDataSevice.show({
                            title: col.DisplayKey,
                            configListDetail: col.ConfigListDetail,
                            dataItem: data
                        })
                    }
                >
                    <IconDown size={Size.iconSize - 3} color={Colors.primary} />
                    <VnrText
                        style={[styleSheets.lable, styles.styTextLableInfo, styles.styViewBtnShowHideText]}
                        i18nKey={col.DisplayKey ? col.DisplayKey : 'HRM_PortalApp_Expand_Info'}
                    />
                </TouchableOpacity>
            ) : (
                <View />
            );
        } else if (col.TypeView == EnumTypeFormatRender.E_NODATA) {
            return (
                <View key={col.Label} style={[styles.styItemContent, styHideBorder]}>
                    <View style={styles.viewLable}>
                        <VnrText style={[styleSheets.lable, styTextLable]} i18nKey={col.DisplayKey} />
                    </View>
                    <View style={styles.styViewValue}>
                        <VnrText style={styTextValue} i18nKey={col.Name} />
                    </View>
                </View>
            );
        } else {
            /// render string type(E_COMMON)

            let viewValue = <View />;
            if (this.CheckIsNullOrEmpty(data[col.Name]) === false || (col.NameSecond && data[col.NameSecond])) {
                if (col.Name == 'StatusView') {
                    // lấy màu trong itemStatus

                    let _colorStatus = null;
                    if (data.itemStatus) {
                        const { colorStatus } = data.itemStatus;
                        _colorStatus = colorStatus != null ? this.convertTextToColor(colorStatus) : null;
                    } else if (data.colorStatus) {
                        _colorStatus = this.convertTextToColor(data.colorStatus);
                    }

                    viewValue = (
                        <Text
                            style={[
                                styTextValue,
                                _colorStatus !== null && {
                                    color: _colorStatus
                                }
                            ]}
                        >
                            {data[col.Name]}
                        </Text>
                    );
                } else if (col.DataType && col.DataType.toLowerCase() == 'fileattach') {
                    if (typeof data[col.Name] === 'string') {
                        const listFile = data[col.Name].split(',');
                        return (
                            <View key={col.Label} style={[styles.styItemContent, { flexDirection: 'column' }]}>
                                <View style={styles.viewLable}>
                                    <VnrText
                                        style={[styleSheets.lable, styles.styTextLableInfo]}
                                        i18nKey={col.DisplayKey}
                                    />
                                </View>
                                <View style={{ marginTop: Size.defineHalfSpace }}>
                                    {listFile.map((file, index) => (
                                        <TouchableOpacity key={index} onPress={() => this.downloadFileAttach(file)}>
                                            <Text
                                                style={[
                                                    styTextValue,
                                                    {
                                                        color: Colors.primary,
                                                        textDecorationLine: 'underline',
                                                        textDecorationStyle: 'solid',
                                                        textDecorationColor: Colors.primary,
                                                        textAlign: 'left'
                                                    }
                                                ]}
                                            >
                                                {file}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                    {/* </View> */}
                                </View>
                            </View>
                        );
                    } else if (Array.isArray(data[col.Name])) {
                        const listFile = data[col.Name];
                        return (
                            <View key={col.Label} style={[styles.styItemContent, { flexDirection: 'column' }]}>
                                <View style={styles.viewLable}>
                                    <VnrText
                                        style={[styleSheets.lable, styles.styTextLableInfo]}
                                        i18nKey={col.DisplayKey}
                                    />
                                </View>
                                <View style={{ marginTop: Size.defineHalfSpace }}>
                                    {listFile.map((file, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={{ marginBottom: Size.defineSpace }}
                                            onPress={() => this.downloadFileAttach(file.path)}
                                        >
                                            <Text
                                                style={[
                                                    styTextValue,
                                                    {
                                                        color: Colors.primary,
                                                        textDecorationLine: 'underline',
                                                        textDecorationStyle: 'solid',
                                                        textDecorationColor: Colors.primary,
                                                        textAlign: 'left'
                                                    }
                                                ]}
                                            >
                                                {file.fileName}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        );
                    }
                } else if (col.DataType && col.DataType.toLowerCase() == 'datetime') {
                    viewValue = <Text style={styTextValue}>{moment(data[col.Name]).format(col.DataFormat)}</Text>;
                } else if (col.DataType && col.DataType.toLowerCase() == 'datetofrom') {
                    let value = moment(data[col.Name]).format(col.DataFormat);

                    if (data[col.NameSecond]) {
                        value = `${value} - ${moment(data[col.NameSecond]).format(col.DataFormat)}`;
                    }
                    viewValue = <Text style={styTextValue}>{value}</Text>;
                } else if (col.DataType && col.DataType.toLowerCase() == 'stringcolor') {
                    let _colorStatus = null;
                    if (col.FieldColor && data[col.FieldColor]) {
                        _colorStatus = data[col.FieldColor];
                    }
                    viewValue = (
                        <Text
                            style={[
                                styTextValue,
                                _colorStatus !== null && {
                                    color: _colorStatus
                                }
                            ]}
                        >
                            {data[col.Name]}
                        </Text>
                    );
                } else if (col.DataType && col.DataType.toLowerCase() == 'double') {
                    let value = format(col.DataFormat, data[col.Name]);
                    if (value && value.indexOf(',') == 0) {
                        value = format('0,##', data[col.Name]);
                    }
                    viewValue = <Text style={styTextValue}>{value}</Text>;
                } else if (col.DataType && col.DataType.toLowerCase() == 'bool') {
                    viewValue = data[col.Name] ? (
                        <IconCheckSquare size={Size.iconSize} color={Colors.primary} />
                    ) : (
                        <IconUnCheckSquare size={Size.iconSize} color={Colors.black} />
                    );
                } else if (col.DataType && col.DataType.toLowerCase() == 'string') {
                    switch (col.DataFormat) {
                        case 'E_IMG':
                            viewValue = <ViewImg format={col.formatImage} source={col.source} />;
                        case 'E_MAP':
                            viewValue = <ViewMap x={col.x} y={col.y} />;
                        case 'E_LINK':
                            viewValue = (
                                <TouchableOpacity onPress={() => this.openLink(col.url)}>
                                    <VnrText i18n={'HRM_OutLink'} style={styTextValue} />
                                </TouchableOpacity>
                            );
                        default:
                            viewValue = <Text style={styTextValue}>{data[col.Name]}</Text>;
                    }
                } else {
                    viewValue = <Text style={styTextValue}>{data[col.Name]}</Text>;
                }
            } else if (col.DataType && col.DataType.toLowerCase() == 'bool') {
                viewValue = data[col.Name] ? (
                    <IconCheckSquare size={Size.iconSize} color={Colors.primary} />
                ) : (
                    <IconUnCheckSquare size={Size.iconSize} color={Colors.black} />
                );
            } else {
                viewValue = <Text />;
            }
            return (
                <View
                    key={col.Label}
                    style={[styles.styItemContent, styHideBorder, col.isWrapLine && { flexDirection: 'column' }]}
                >
                    <View style={[styles.viewLable, !isAlignLayout && styles.viewLableLeft]}>
                        <VnrText
                            style={[styleSheets.lable, styTextLable]}
                            i18nKey={col.DisplayKey}
                            // numberOfLines={1}
                        />
                    </View>
                    <View
                        style={[
                            styles.styViewValue,
                            !isAlignLayout && styles.styViewValueLeft,
                            col.isWrapLine && { paddingLeft: 0, paddingTop: Size.defineSpace }
                        ]}
                    >
                        {viewValue}
                        {/* </View> */}
                    </View>
                </View>
            );
        }
    };

    static renderAvatarCricleByName = (imageAvatar, name, size, isFixSize, isImportant = false) => {
        const randomColor = this.randomColorV3(name ? name : ''),
            { PrimaryColor, SecondaryColor, FirstCharName } = randomColor;

        if (size > Size.AvatarSize && !isFixSize) size = Size.AvatarSize;

        const styles = stylesScreenDetailV3;

        if (imageAvatar && ManageFileSevice.getNameFileFromURI(imageAvatar) !== '') {
            if (!Vnr_Function.checkIsPath(imageAvatar)) {
                if (dataVnrStorage.apiConfig && dataVnrStorage.apiConfig.uriStorage) {
                    imageAvatar = HttpService.handelUrl(`[URI_STORAGE]images/${imageAvatar}`);
                } else if (dataVnrStorage.apiConfig && dataVnrStorage.apiConfig.uriCenter) {
                    imageAvatar = HttpService.handelUrl(`[URI_CENTER]/Resources/ProfileImage/${imageAvatar}`);
                } else {
                    imageAvatar = HttpService.handelUrl(`[URI_MAIN]/Images/${imageAvatar}`);
                }
            }
        }

        return (
            <View style={[styles.styAvatar, { width: size, height: size }]}>
                {isImportant && (
                    <View
                        style={{
                            position: 'absolute',
                            right: -8,
                            top: -8,
                            zIndex: 100,
                            elevation: 100
                        }}
                    >
                        <View
                            style={{
                                padding: 4,
                                borderRadius: 100,
                                backgroundColor: Colors.white
                            }}
                        >
                            <IconStar size={14} color={Colors.yellow} />
                        </View>
                    </View>
                )}
                <ImageBackground
                    source={{ uri: imageAvatar ?? 'A' }}
                    resizeMode="cover"
                    style={[styles.styImgAvatar, { width: size, height: size }]}
                    imageStyle={[styles.styImgAvatar, { width: size, height: size, zIndex: 2, elevation: 2 }]}
                >
                    <View
                        style={[
                            styles.styleftContentAvatar,
                            { backgroundColor: SecondaryColor, width: size, height: size, zIndex: 1, elevation: 1 }
                        ]}
                    >
                        <Text
                            style={[
                                styleSheets.textFontMedium,
                                {
                                    color: PrimaryColor,
                                    fontSize: size / 2
                                }
                            ]}
                        >
                            {FirstCharName}
                        </Text>
                    </View>
                </ImageBackground>
            </View>
        );
    };

    static isValidateEmail = (email) => {
        return /^[\w+.-]+([\.-]?[\w+]+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email);
    };

    static formatStringTypeV3 = (data, col, allConfig) => {
        const configAlign = ConfigListDetail.configAlign;
        let isAlignLayout = true;

        if (configAlign === 'E_LEFT_LAYOUT') {
            isAlignLayout = false;
        } else if (configAlign === 'E_ALIGN_LAYOUT') {
            isAlignLayout = true;
        }
        return <VnrFormatStringType isAlignLayout={isAlignLayout} data={data} col={col} allConfig={allConfig} />;
    };

    static formatStringTypeManyData = (data, allConfig) => {
        return <VnrFormatStringManyData data={data} allConfig={allConfig} />;
    };

    static tranlateCurencyChar(currencyCode) {
        switch (currencyCode) {
            case 'VND':
                return require('../assets/images/CurencyChar/VND.png');
            case 'USD':
                return require('../assets/images/CurencyChar/USD.jpg');
            default:
                return require('../assets/images/CurencyChar/money.png');
        }
    }

    //chuyển về tiếng việt không dấu
    //chuyển về in thường
    static toSlug(str) {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .toLowerCase();
    }

    //delay ms
    static delay = (() => {
        let timer = 0;
        return (callback, ms) => {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    //sort data
    static sortData(data, sortField, sortBy, dataType) {
        if (dataType == 'number') {
            return data.sort((a, b) => {
                let fieldA = a[sortField],
                    fieldB = b[sortField];

                if (sortBy == 'ASC') {
                    return fieldA - fieldB;
                } else if (sortBy == 'DESC') {
                    return fieldB - fieldA;
                }
            });
        } else if (dataType == 'string') {
            return data.sort((a, b) => {
                let fieldA = a[sortField].toUpperCase(),
                    fieldB = b[sortField].toUpperCase();

                if (sortBy == 'ASC') {
                    return fieldA.localeCompare(fieldB);
                } else if (sortBy == 'DESC') {
                    return fieldB.localeCompare(fieldA);
                }
            });
        }
    }

    static isEqual = (item1, item2, addIf) => {
        let typeItem = Object.prototype.toString.call(item1);
        // kiem tra chung type
        if (typeItem !== Object.prototype.toString.call(item2)) {
            // console.log('kiem tra chung type', 'isEqual');
            return false;
        }

        //Sau khi chung type. Nếu typeItem là object hoặc array thì gọi đệ quy hàm (isEqual)
        if (['[object Array]', '[object Object]'].indexOf(typeItem) > -1) {
            if (!this.compare(item1, item2, addIf)) {
                // console.log('Nếu typeItem là object hoặc array thì gọi đệ quy hàm (isEqual)', 'isEqual');
                return false;
            }
        } else {
            // Nếu typeItem là function thì chuyển về string và so sánh.

            if (typeItem === '[object Function]') {
                if (item1.toString() !== item2.toString()) return false;
            } else if (typeof item1 === 'string' && item1.includes('Date')) {
                if (moment(item1).format('DD/MM/YYYY HH:mm:ss') !== moment(item2).format('DD/MM/YYYY HH:mm:ss'))
                    return false;
            } else if (item1 !== item2) {
                // console.log(item1, item2, 'Hai tham số không bằng nhau', 'isEqual');
                return false;
            }
        }
        return true;
    };

    static compare = (
        value,
        other,
        addIf = () => {
            return true;
        }
    ) => {
        // hàm kiểm tra 2 phần tử trùng nhau
        // if (addIf == null) {
        //     addIf = () => { return true }
        // }

        // console.log(addIf)
        let type = Object.prototype.toString.call(value);
        // kiem tra chung type
        if (type !== Object.prototype.toString.call(other)) {
            // console.log('kiem tra chung type', 'compare');
            return false;
        }

        // khi 2 props chung type, Kiểm tra 2 prop phải là "Array" hoặc "object"
        if (['[object Array]', '[object Object]'].indexOf(type) < 0) {
            // console.log('Kiểm tra 2 prop phải là "Array" hoặc "object"', 'compare');
            return false;
        }

        let lengthValue = type === '[object Array]' ? value.length : Object.keys(value).length,
            lengthOther = type === '[object Array]' ? other.length : Object.keys(other).length;

        // Kiểm tra length bằng nhau
        if (lengthOther !== lengthValue) {
            // console.log('Kiểm tra length bằng nhau', 'compare');
            return false;
        }
        //debugger
        if (type == '[object Array]') {
            for (let i = 0; i < lengthValue; i++) {
                if (!this.isEqual(value[i], other[i], addIf) && addIf(value[i], other[i])) {
                    return false;
                }
            }
        } else {
            // eslint-disable-next-line no-unused-vars
            for (let key in value) {
                if (!this.isEqual(value[key], other[key], addIf) && addIf(value[key], other[key])) {
                    //&& key != 'DateUpdate'
                    return false;
                }
            }
        }

        return true;
    };

    static randomColor = (key) => {
        const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            themeColor = [
                {
                    PrimaryColor: Colors.green,
                    SecondaryColor: Colors.green_1
                },
                {
                    PrimaryColor: Colors.yellow,
                    SecondaryColor: Colors.yellow_1
                },
                {
                    PrimaryColor: Colors.orange,
                    SecondaryColor: Colors.orange_1
                },
                {
                    PrimaryColor: Colors.volcano,
                    SecondaryColor: Colors.volcano_1
                },
                {
                    PrimaryColor: Colors.red,
                    SecondaryColor: Colors.red_1
                },
                {
                    PrimaryColor: Colors.neutralGreen,
                    SecondaryColor: Colors.neutralGreen_1
                },
                {
                    PrimaryColor: Colors.purple,
                    SecondaryColor: Colors.purple_1
                }
            ];

        if (key && (typeof key === 'string' || typeof key === 'number')) {
            const indexOfKey = char.indexOf(key);
            if (indexOfKey % 6 === 0) {
                return themeColor[6];
            } else if (indexOfKey % 5 === 0) {
                return themeColor[5];
            } else if (indexOfKey % 4 === 0) {
                return themeColor[4];
            } else if (indexOfKey % 3 === 0) {
                return themeColor[3];
            } else if (indexOfKey % 2 === 0) {
                return themeColor[2];
            } else {
                return indexOfKey < 30 ? themeColor[0] : themeColor[1];
            }
        } else {
            return themeColor[Math.floor(Math.random() * 7)];
        }
    };

    static randomColorV3 = (fullName) => {
        if (fullName == null || fullName == '') {
            return {
                FirstCharName: '',
                PrimaryColor: Colors.white,
                SecondaryColor: Colors.white
            };
        }

        let strFull = fullName.trim().split(' - ')[0].trim(),
            splFull = strFull.split(' '),
            strFirstName = splFull[splFull.length - 1],
            strFirst = strFirstName.charAt(0).toUpperCase();

        let colours = [
                '#1abc9c',
                '#2ecc71',
                '#3498db',
                '#9b59b6',
                '#34495e',
                '#f7ca18',
                '#f15a22',
                '#1ba39c',
                '#2abb9b',
                '#1f3a93',
                '#96281b',
                '#e67e22',
                '#e74c3c',
                '#95a5a6',
                '#f39c12',
                '#d35400',
                '#c0392b',
                '#22a7f0',
                '#5CDD1D',
                '#FA9528',
                '#FA541C',
                '#F63741',
                '#1DC596',
                '#8043D6',
                '#C7ABED',
                '#0A7EF5',
                '#6CB1F9 ',
                '#8BE95D',
                '#D9D9D9',
                '#FADB14',
                '#FB7B50',
                '#FA999E',
                '#B4ECDC',
                '#3B98F7',
                '#4F67CE',
                '#F74F58',
                '#F8686F'
            ],
            nameSplit = strFirst,
            charIndex = '',
            initials = '',
            colourIndex = 0;

        initials = nameSplit ? nameSplit[nameSplit.length - 1].charAt(0) : ''; //+ nameSplit[1].charAt(0);
        charIndex = (initials == '?' ? 72 : initials.charCodeAt(0)) - 14;
        colourIndex = charIndex % 20;

        return {
            FirstCharName: strFirst,
            PrimaryColor: Colors.white,
            SecondaryColor: colours[colourIndex - 1]
        };
    };

    // https://gist.github.com/jarvisluong/f01e108e963092336f04c4b7dd6f7e45
    // This function converts the string to lowercase, then perform the conversion
    static toLowerCaseNonAccentVietnamese = (str) => {
        str = str.toLowerCase();
        //     We can also use this instead of from line 11 to line 17
        //     str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
        //     str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
        //     str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
        //     str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
        //     str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
        //     str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
        //     str = str.replace(/\u0111/g, "d");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
        return str;
    };

    // This function keeps the casing unchanged for str, then perform the conversion
    static toNonAccentVietnamese = (str) => {
        // str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
        // str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        // str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
        // str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        // str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
        // str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        // str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
        // str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        // str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
        // str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        // str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
        // str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        // str = str.replace(/Đ/g, "D");
        // str = str.replace(/đ/g, "d");
        // // Some system encode vietnamese combining accent as individual utf-8 characters
        // str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
        // str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        // str = str.replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
        // return str;

        // charCodeAt of encode Vietnamese
        let arr = [
            192, 193, 194, 195, 200, 201, 202, 204, 205, 210, 211, 212, 213, 217, 218, 258, 272, 296, 360, 416, 224,
            225, 226, 227, 232, 233, 234, 236, 237, 242, 243, 244, 245, 249, 250, 259, 273, 297, 361, 417, 431, 258,
            7840, 7842, 7844, 7846, 7848, 7850, 7852, 7854, 8230, 7890, 7892, 7894, 7896, 7898, 7900, 7902, 7904, 7906,
            7908, 7910, 7912, 7914, 7877, 7871, 7879, 7881, 7883, 7885, 7887, 7889, 7891, 7893, 7895, 7897, 7899, 7901,
            7903, 7905, 7907, 7909, 7911, 7913, 7915, 7916, 7918, 7920, 7922, 7924, 221, 7926, 7928, 7917, 7919, 7921,
            7923, 7925, 7927, 7929
        ];
        let isExists = false;
        let regex = /[`~!@#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/]/;
        for (let i = 0; i < str.replace(/ /gi, '').split('').length; i++) {
            arr.find((item) => {
                if (
                    str.replace(/ /gi, '').split('')[i].toString().charCodeAt() === item ||
                    regex.test(str.replace(/ /gi, '').split('')[i].toString())
                ) {
                    isExists = true;
                }
            });
            if (isExists === true) {
                return false;
            }
        }

        return true;
    };

    static renderApproveProcessHRE = (dataApprover = [], configLeveApprove = [], lable = '', sub = null) => {
        //#region handle styles
        const { contentScroll } = styleScreenDetail;
        const styles = styleApproveProcessHRE;
        let styTextLable = { ...styleSheets.text, ...{ textAlign: 'left' } },
            rsConfigApprove = null;

        return (
            <View style={contentScroll}>
                <View style={styles.wrapEvaluationProcess}>
                    <Text style={[styleSheets.lable, { marginLeft: 6 }]}>{translate(lable)}</Text>
                </View>
                {dataApprover.length > 0 &&
                    dataApprover.map((item, index) => {
                        rsConfigApprove = configLeveApprove.find((itemApprove) =>
                            itemApprove?.TypeView.includes(item?.FieldName)
                        );
                        return rsConfigApprove ? (
                            <View key={index} style={{ marginBottom: Size.defineSpace - 4, paddingHorizontal: 16 }}>
                                <View style={stylesScreenDetailV3.wrapLevelApproveAndDisplaykey}>
                                    <View
                                        style={[
                                            stylesScreenDetailV3.wrapLevelApprove,
                                            (item?.StatusProcess === EnumName.E_success ||
                                                item?.StatusProcess === EnumName.E_process ||
                                                dataApprover[index - 1]?.StatusProcess === EnumName.E_success) && {
                                                backgroundColor: Colors.green
                                            },
                                            item?.FieldName === 'UserReject' && { backgroundColor: Colors.red }
                                        ]}
                                    >
                                        {item?.FieldName === 'UserReject' ? (
                                            <IconCancel size={Size.iconSize - 10} color={Colors.white} />
                                        ) : item?.StatusProcess === EnumName.E_success ? (
                                            <IconCheck size={Size.iconSize - 10} color={Colors.white} />
                                        ) : (
                                            <Text
                                                style={[
                                                    styleSheets.styTextValueDateTimeStatus,
                                                    item?.StatusProcess === EnumName.E_process && {
                                                        color: Colors.white
                                                    }
                                                ]}
                                            >
                                                {index + 1}
                                            </Text>
                                        )}
                                    </View>
                                    <VnrText
                                        style={[styleSheets.text, styTextLable]}
                                        i18nKey={
                                            item?.FieldName === 'UserReject'
                                                ? 'HRM_PortalApp_RejectionUser'
                                                : rsConfigApprove?.DisplayKey
                                        }
                                        value={
                                            item?.FieldName === 'UserReject'
                                                ? 'HRM_PortalApp_RejectionUser'
                                                : rsConfigApprove?.DisplayKey
                                        }
                                    />
                                </View>
                                <View style={[stylesScreenDetailV3.wrapInforApprover]}>
                                    <View style={stylesScreenDetailV3.wrapStraightLine}>
                                        <View
                                            style={[
                                                stylesScreenDetailV3.straightLine,
                                                (item?.StatusProcess === EnumName.E_success ||
                                                    item?.StatusProcess === EnumName.E_process ||
                                                    dataApprover[index - 1]?.StatusProcess === EnumName.E_success) && {
                                                    backgroundColor: Colors.green
                                                },
                                                item?.FieldName === 'UserReject' && { backgroundColor: Colors.red }
                                            ]}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <View style={stylesVnrFilter.viewLable}>
                                            {Vnr_Function.renderAvatarCricleByName(
                                                item?.ImagePath,
                                                item[rsConfigApprove?.Name] ? item[rsConfigApprove?.Name] : 'A',
                                                sizeImg
                                            )}
                                            <View style={styleSheets.wrapNameAndSubtitle}>
                                                <View style={{ flex: 1 }}>
                                                    <Text numberOfLines={2} style={[styleSheets.subTitleApprover]}>
                                                        <Text style={[styleSheets.detailNameApprover]}>
                                                            {item[rsConfigApprove?.Name]}{' '}
                                                        </Text>
                                                        {item?.Content
                                                            ? item?.Content
                                                            : item?.FieldName === 'UserReject'
                                                              ? translate('HRM_PortalApp_Rejected')
                                                              : item?.StatusProcess === EnumName.E_success
                                                                ? translate('HRM_PortalApp_Approved')
                                                                : ''}
                                                    </Text>
                                                </View>
                                                {sub && item[sub] && (
                                                    <Text style={[styleSheets.detailPositionApprover]}>
                                                        {item[sub]}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                        {item?.Comment ? (
                                            <View
                                                style={[
                                                    stylesScreenDetailV3.styMarginLeftCmt,
                                                    stylesScreenDetailV3.styleComment
                                                ]}
                                            >
                                                <Text style={styleSheets.text}>{item?.Comment}</Text>
                                            </View>
                                        ) : null}
                                        {item?.DateUpdated && (
                                            <View style={stylesScreenDetailV3.styMarginLeftCmt}>
                                                <Text style={stylesScreenDetailV3.styDateUpdate}>
                                                    {translate('E_AT_TIME')}{' '}
                                                    {moment(item?.DateUpdated).format('HH:mm, DD/MM/YYYY')}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>
                        ) : null;
                    })}
            </View>
        );
    };

    static sendMailFeedback = async (key) => {
        // const dataListQr = await AsyncStorage.getItem('@DATA_SCANED_QR_LIST'),
        //     dataListQrJson = dataListQr != null ? JSON.parse(dataListQr) : [],
        //     qrSelected = dataListQrJson.find(item => item.isSelect == true);
        // const { apiConfig } = dataVnrStorage,
        //     _uriPor = apiConfig ? apiConfig.uriPor : null;
        // HttpService.Post('[URI_SYS]/sys_getdata/FeedbackErrorApp', {
        //     DataFeedback: {
        //         CusCode: qrSelected?.CusCode ? qrSelected?.CusCode : qrSelected?.CusName ? qrSelected?.CusName : '',
        //         CusName: qrSelected?.CusName ? qrSelected?.CusName : '',
        //         VersionCode: qrSelected?.VersionCode,
        //         UriPor: _uriPor,
        //         DateError: moment(new Date()).format('DD-MM-YYYY HH:mm:ss'),
        //         PlatForm: Platform.OS,
        //         PlatFormVersion: Platform.Version.toString(),
        //         UserName: dataVnrStorage.currentUser?.headers?.userlogin,
        //         Email: 'nhan.nguyenthanh@vnresource.org', //Email.value,
        //         ScreenName: '',
        //         DescriptionError: key,
        //         StatusError: '',
        //         NameAPI: '',
        //         DescriptionErrorAPI: key,
        //         LinkVideo: '',
        //         LinkImage: '',
        //         UserID: dataVnrStorage.currentUser?.headers?.userid,
        //         ProfileID: dataVnrStorage.currentUser?.info?.ProfileID,
        //         NamePhone: '',
        //         Note: 'Lỗi key dịch'
        //     }
        // })
        //     .then(() => {
        //         //
        //     })
        //     .catch(() => {
        //         //
        //     });
    };

    static HandleConfigListDetailATT = (configListDetail, tblName) => {
        // 0180640: Nghiên cứu giải pháp đồng bộ cấu hình cho app vs portal V3
        return new Promise(async (resolve) => {
            try {
                const configPortal = await HttpService.Get(
                    `[URI_CENTER]/api/Sys_Common/GetDetailConfig?tableName=${tblName}`
                );

                if (
                    configPortal?.Data?.DetailConfigs &&
                    Array.isArray(configPortal.Data.DetailConfigs) &&
                    configListDetail
                ) {
                    const { DetailConfigs } = configPortal.Data;
                    let newConfig = [];
                    DetailConfigs.forEach((el) => {
                        if (el.type == 'E_STATUS' && !el.hidden) {
                            // group
                            const itemStatus = configListDetail.find((item) => item.TypeView === 'E_STATUS');
                            newConfig.push(itemStatus);
                        }

                        if (el.type == 'E_EMP_INFORMATION' && !el.hidden) {
                            // group
                            let configGroup = configListDetail.find((item) => item.TypeView === 'E_GROUP_PROFILE');
                            newConfig.push(configGroup);

                            // tag
                            if (
                                el.config &&
                                el.config[0] &&
                                !el.config[0].hidden &&
                                el.config[0].config &&
                                el.config[0].config.length > 0
                            ) {
                                el.config[0].config.forEach((detail) => {
                                    let itemMatch = configListDetail.find(
                                        (item) => item.Name && item.Name === detail.fieldName
                                    );

                                    if (itemMatch && !detail.hidden) {
                                        newConfig.push(itemMatch);
                                    }
                                });
                            }
                        }

                        if (el.type == 'E_DETAILS_VIEW' && !el.hidden) {
                            // group
                            let configGroup = configListDetail.filter((item) => item.TypeView === 'E_GROUP');
                            if (
                                configGroup &&
                                configGroup.length > 0 &&
                                el.config.length > 0 &&
                                configGroup.length == el.config.length
                            ) {
                                configGroup.forEach((groupApp, index) => {
                                    newConfig.push(groupApp);
                                    // tag
                                    if (
                                        el.config &&
                                        el.config[index] &&
                                        !el.config[index].hidden &&
                                        el.config[index].config &&
                                        el.config[index].config.length > 0
                                    ) {
                                        el.config[index].config.forEach((detail) => {
                                            let itemMatch = configListDetail.find((item) => {
                                                if (item.Name && item.Name === detail.fieldName) {
                                                    if (!item.DataType.includes('Date')) {
                                                        return true;
                                                    } else if (
                                                        item.DataFormat?.toLowerCase() == detail.format?.toLowerCase()
                                                    ) {
                                                        return true;
                                                    } else return false;
                                                }
                                                return false;
                                            });
                                            if (itemMatch && !detail.hidden) {
                                                newConfig.push(itemMatch);
                                            }
                                        });
                                    }
                                });
                            } else {
                                newConfig.push(configGroup[0]);

                                // tag
                                if (
                                    el.config &&
                                    el.config[0] &&
                                    !el.config[0].hidden &&
                                    el.config[0].config &&
                                    el.config[0].config.length > 0
                                ) {
                                    el.config[0].config.forEach((detail) => {
                                        let itemMatch = configListDetail.find((item) => {
                                            if (item.Name && item.Name === detail.fieldName) {
                                                if (!item.DataType.includes('Date')) {
                                                    return true;
                                                } else if (
                                                    item.DataFormat?.toLowerCase() == detail.format?.toLowerCase()
                                                ) {
                                                    return true;
                                                } else return false;
                                            }
                                            return false;
                                        });
                                        if (itemMatch && !detail.hidden) {
                                            newConfig.push(itemMatch);
                                        }
                                    });
                                }
                            }
                        }

                        if (el.type == 'E_PROCESS_APPROVED' && !el.hidden) {
                            // group
                            let configGroup = configListDetail.find((item) => item.TypeView === 'E_GROUP_APPROVE');
                            newConfig.push(configGroup);
                        }
                    });
                    resolve(newConfig);
                } else {
                    resolve(configListDetail);
                }
            } catch (error) {
                console.log(error, 'error');
            }
        });
    };

    static openSettings() {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
        } else {
            Linking.openSettings();
        }
    }
}
