/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import moment from 'moment';

import {
    styleSheets,
    Size,
    Colors,
    stylesScreenDetailV3,
    // stylesVnrFilter,
    CustomStyleSheet
} from '../../constants/styleConfig';
import {
    // IconCancel,
    // IconCheck,
    IconCheckSquare,
    IconDown,
    IconDownload,
    IconUnCheckSquare,
    IconRight
} from '../../constants/Icons';
import Vnr_Function from '../../utils/Vnr_Function';
import { EnumName, EnumStatus } from '../../assets/constant';
import { translate } from '../../i18n/translate';
import ManageFileSevice from '../../utils/ManageFileSevice';
import VnrText from '../../components/VnrText/VnrText';
import ViewMap from '../../components/ViewMap/ViewMap';
import ViewImg from '../../components/ViewImg/ViewImg';
import format from 'number-format.js';
import { ModalDataSevice } from '../../components/modal/ModalShowData';
import VnrRenderApproverAtt from './VnrRenderApproverAtt';
import { IconShowDownChevron, IconShowUpChevron } from '../../constants/Icons';
import ViewHTML from '../../components/ViewHTML/ViewHTML';

const EnumTypeFormatRender = {
    E_GROUP: 'E_GROUP', // hiểu thị tiêu đề group
    E_GROUP_PROFILE: 'E_GROUP_PROFILE', // Group profile
    E_COMMON_PROFILE: 'E_COMMON_PROFILE', // các thông tin profile
    E_GROUP_APPROVE: 'E_GROUP_APPROVE',
    E_GROUP_FILEATTACH: 'E_GROUP_FILEATTACH',
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
    E_NODATA: 'E_NODATA',
    E_COMMON_LABEL: 'E_COMMON_LABEL',
    E_HTML: 'E_HTML'
};
// const sizeImg = 44;
const characters = '************';

class VnrFormatStringType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowMore: true
        };
    }

    renderCommonString = (col) => {
        const { data, isAlignLayout } = this.props;

        //#region handle styles
        let styTextValue = {
                ...styleSheets.lable,
                ...styTextValueInfo,
                ...(isAlignLayout ? { textAlign: 'right' } : {})
            },
            styTextLable = { ...styleSheets.text, ...{ textAlign: 'left' } },
            styHideBorder = {};

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
        }

        //#endregion

        //#region render file attachment
        if (col.TypeView == EnumTypeFormatRender.E_FILEATTACH) {
            if (typeof data[col.Name] === 'string') {
                const listFile = data[col.Name].split(',');
                return (
                    <View key={col.Label} style={[styles.styItemContent, { padding: 0, flexDirection: 'column' }]}>
                        {col.DisplayKey !== '' && (
                            <View style={styles.viewLable}>
                                <VnrText
                                    style={[styleSheets.lable, styTextLable]}
                                    i18nKey={col.DisplayKey}
                                    value={col.DisplayKey}
                                />
                            </View>
                        )}
                        {listFile.length > 0 && (
                            <View style={styles.styViewFileAttach}>
                                {listFile.map((file, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.styContentFile}
                                        onPress={() => Vnr_Function.downloadFileAttach(file.path)}
                                    >
                                        {Vnr_Function.renderIconTypeFile(file.ext)}
                                        <View style={[styles.viewLable, { marginRight: Size.defineSpace }]}>
                                            <Text style={[styleSheets.lable, styles.styTextDownload]} numberOfLines={1}>
                                                {ManageFileSevice.getNameFileFromURI(file.fileName)}
                                            </Text>
                                        </View>
                                        <IconDownload size={Size.iconSize} color={Colors.black} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                );
            } else if (Array.isArray(data[col.Name]) && data[col.Name].length > 0) {
                const listFile = data[col.Name];
                return (
                    <View key={col.Label} style={[styles.styItemContent, { padding: 0, flexDirection: 'column' }]}>
                        {col.DisplayKey !== '' && (
                            <View style={styles.viewLable}>
                                <VnrText
                                    style={[styleSheets.lable, styTextLable]}
                                    i18nKey={col.DisplayKey}
                                    value={col.DisplayKey}
                                />
                            </View>
                        )}
                        {listFile.length > 0 && (
                            <View style={styles.styViewFileAttach}>
                                {listFile.map((file, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.styContentFile}
                                        onPress={() => Vnr_Function.downloadFileAttach(file.path)}
                                    >
                                        {Vnr_Function.renderIconTypeFile(file.ext)}
                                        <View style={[styles.viewLable, { marginRight: Size.defineSpace }]}>
                                            <Text style={[styleSheets.text, styles.styTextDownload]} numberOfLines={1}>
                                                {ManageFileSevice.getNameFileFromURI(file.fileName)}
                                            </Text>
                                        </View>

                                        <IconDownload size={Size.iconSize} color={Colors.black} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                );
            } else if (col.DisplayKey) {
                return (
                    <View style={[styles.styItemContent, styHideBorder]}>
                        <View
                            style={[
                                styles.viewLable,
                                { justifyContent: 'flex-start' },
                                isAlignLayout && styles.viewLableJustify
                            ]}
                        >
                            <VnrText
                                style={[styleSheets.text, styTextLable]}
                                i18nKey={col.DisplayKey}
                            // numberOfLines={1}
                            />
                        </View>
                        <View style={[styles.styViewValue, isAlignLayout && styles.styViewValueJustify]}>
                            <Text style={[styleSheets.text, styTextValue]}>-</Text>
                        </View>
                    </View>
                );
            } else {
                return <View />;
            }
        }
        //#endregion

        //#region render common label
        if (col?.TypeView === EnumTypeFormatRender.E_COMMON_LABEL) {
            return (
                <View key={col.Label} style={[styles.styItemContent, styHideBorder, CustomStyleSheet.marginTop(4)]}>
                    <View style={[styles.viewLable, { justifyContent: 'flex-start' }]}>
                        <VnrText style={[styleSheets.lable, CustomStyleSheet.fontSize(16)]} i18nKey={col.DisplayKey} />
                    </View>
                </View>
            );
        }
        //#endregion

        let viewValue = <View />;
        let isSalary = col?.isSalary;
        if (
            Vnr_Function.CheckIsNullOrEmpty(data[col.Name]) === false ||
            Vnr_Function.CheckIsNullOrEmpty(data[col.NameOld]) === false ||
            (col.NameSecond && data[col.NameSecond])
        ) {
            data[col.Name] =
                data[col.Name] && typeof data[col.Name] === 'string'
                    ? data[col.Name].trim()
                    : typeof data[col.Name] !== 'object' ||
                        (Array.isArray(data[col.Name]) && data[col.Name].length == 2)
                        ? data[col.Name]
                        : '';
            if (col.Name == 'StatusView' || (col.DataType && col.DataType.toLowerCase() == 'status')) {

                let _colorStatus = null,
                    _bgStatusView = null;

                let checkShowStatusCancel =
                    data.RequestCancelStatus &&
                    (data.RequestCancelStatus == 'E_SUBMIT_REQUESTCANCEL' ||
                        data.RequestCancelStatus == 'E_APPROVED1_REQUESTCANCEL' ||
                        data.RequestCancelStatus == 'E_FIRST_APPROVED_REQUESTCANCEL' ||
                        data.RequestCancelStatus == 'E_APPROVED2_REQUESTCANCEL' ||
                        data.RequestCancelStatus == 'E_APPROVED3_REQUESTCANCEL');

                if (checkShowStatusCancel) {
                    const { colorStatus, bgStatus } = data.itemStatusCancel;
                    _bgStatusView = bgStatus ? Vnr_Function.convertTextToColor(bgStatus) : null;
                    _colorStatus = colorStatus != null ? Vnr_Function.convertTextToColor(colorStatus) : null;
                } else if (data.itemStatus) {
                    const { colorStatus, bgStatus } = data.itemStatus;

                    _bgStatusView = bgStatus ? Vnr_Function.convertTextToColor(bgStatus) : null;
                    _colorStatus = colorStatus
                        ? /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colorStatus)
                            ? colorStatus
                            : Vnr_Function.convertTextToColor(colorStatus)
                        : null;
                } else if (data.colorStatus) {
                    _colorStatus = Vnr_Function.convertTextToColor(data.colorStatus);
                }

                viewValue = (
                    <View
                        style={[
                            styles.styViewStatusColorNew,
                            {
                                backgroundColor: _bgStatusView ? _bgStatusView : Colors.white
                            },
                            CustomStyleSheet.borderRadius(Size.borderRadiusCircle)
                        ]}
                    >
                        <View style={[styles.styStatusWrap, { maxWidth: '100%' }]}>
                            <Text
                                numberOfLines={1}
                                style={[
                                    styTextValue,
                                    _colorStatus && {
                                        color: _colorStatus
                                    }
                                ]}
                            >
                                {data[col.Name]}
                            </Text>
                        </View>
                    </View>
                );
            } else if (col.DataType && col.DataType.toLowerCase() == 'fileattach') {
                if (typeof data[col.Name] === 'string') {
                    const listFile = data[col.Name].split(',');
                    return (
                        <View key={col.Label} style={[styles.styItemContent, { flexDirection: 'column' }]}>
                            <View style={styles.viewLable}>
                                <VnrText style={[styleSheets.text, styTextLable]} i18nKey={col.DisplayKey} />
                            </View>
                            <View style={{ marginTop: Size.defineHalfSpace }}>
                                {listFile.map((file, index) => (
                                    <TouchableOpacity key={index} onPress={() => Vnr_Function.downloadFileAttach(file)}>
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
                                <VnrText style={[styleSheets.text, styTextLable]} i18nKey={col.DisplayKey} />
                            </View>
                            <View style={{ marginTop: Size.defineHalfSpace }}>
                                {listFile.map((file, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={{ marginBottom: Size.defineSpace }}
                                        onPress={() => Vnr_Function.downloadFileAttach(file.path)}
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
                if (data[col.Name] && Array.isArray(data[col.Name]) && data[col.Name].length == 2) {
                    const dateStart = data[col.Name][0],
                        dateEnd = data[col.Name][1];

                    let value = '';
                    let dmyStart = moment(dateStart).format('DD/MM/YYYY'),
                        dmyEnd = moment(dateEnd).format('DD/MM/YYYY'),
                        myStart = moment(dateStart).format('MM/YYYY'),
                        myEnd = moment(dateEnd).format('MM/YYYY'),
                        yStart = moment(dateStart).format('YYYY'),
                        yEnd = moment(dateEnd).format('YYYY'),
                        dStart = moment(dateStart).format('DD'),
                        dEnd = moment(dateEnd).format('DD'),
                        dmStart = moment(dateStart).format('DD/MM');
                    if (dmyStart === dmyEnd) {
                        value = dmyStart;
                    } else if (myStart === myEnd) {
                        value = `${dStart} - ${dEnd}/${myStart}`;
                    } else if (yStart === yEnd) {
                        value = `${dmStart} - ${dmyEnd}`;
                    } else {
                        value = `${dmyStart} - ${dmyEnd}`;
                    }

                    viewValue = <Text style={styTextValue}>{value}</Text>;
                } else {
                    let value = moment(data[col.Name]).format(col.DataFormat);

                    if (data[col.NameSecond]) {
                        value = `${value} - ${moment(data[col.NameSecond]).format(col.DataFormat)}`;
                    }
                    viewValue = <Text style={styTextValue}>{value}</Text>;
                }
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
            } else if (col.DataType && col.DataType.toLowerCase() == 'string' && col.NameSecond) {
                let value = data[col.Name];

                if (data[col.NameSecond]) {
                    value = `${value} - ${data[col.NameSecond]}`;
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
                let unitTypeTxt = '';
                if (col.Unit) {
                    if (data && Object.keys(data).length > 0 && Object.prototype.hasOwnProperty.call(data, col.Unit)) {
                        unitTypeTxt = data[col.Unit];
                    } else {
                        unitTypeTxt = translate(col.Unit);
                    }
                }
                if (value && value.indexOf(',') == 0) {
                    value = format('0,##', data[col.Name]);
                }
                viewValue = (
                    <Text style={styTextValue}>
                        {`${value} ${value
                            ? unitTypeTxt
                            : data[col.Name] !== null && data[col.Name] !== undefined
                                ? data[col.Name] + ' ' + unitTypeTxt
                                : '-'
                        }`}
                    </Text>
                );
            } else if (col.DataType && col.DataType.toLowerCase() == 'bool') {
                viewValue = data[col.Name] ? (
                    <IconCheckSquare size={Size.iconSize} color={Colors.primary} />
                ) : (
                    <IconUnCheckSquare size={Size.iconSize} color={Colors.black} />
                );
            } else if (col.DataType && col.DataType.toLowerCase() == 'string') {
                let unitTypeTxt = '',
                    unitTypeTxtOld = '',
                    TextColor = col?.TextColor ? col?.TextColor : null;
                if (col.Unit) {
                    if (data && Object.keys(data).length > 0 && Object.prototype.hasOwnProperty.call(data, col.Unit)) {
                        unitTypeTxt = data[col.Unit];
                    } else {
                        unitTypeTxt = translate(col.Unit);
                    }
                }

                if (col.UnitOld) {
                    if (
                        data &&
                        Object.keys(data).length > 0 &&
                        Object.prototype.hasOwnProperty.call(data, col.UnitOld)
                    ) {
                        unitTypeTxtOld = data[col.UnitOld];
                    } else {
                        unitTypeTxtOld = translate(col.UnitOld);
                    }
                }

                // handle for case data === true => display "Yes" else data = false display "-"
                if (typeof data[col.Name] === 'boolean' && data[col.Name]) {
                    data[col.Name] = translate('HRM_PortalApp_Yes');
                } else if (typeof data[col.Name] === 'boolean') data[col.Name] = '-';

                switch (col.DataFormat) {
                    case 'E_IMG':
                        viewValue = <ViewImg format={col.formatImage} source={col.source} />;
                        break;
                    case 'E_MAP':
                        viewValue = <ViewMap x={col.x} y={col.y} />;
                        break;
                    case 'E_LINK':
                        viewValue = (
                            <TouchableOpacity onPress={() => Vnr_Function.openLink(col.url)}>
                                <VnrText i18n={'HRM_OutLink'} style={styTextValue} />
                            </TouchableOpacity>
                        );
                        break;
                    case 'E_MULTITEXTHORIZONTAL':
                        viewValue = (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {Array.isArray(data[col.Name]) ? (
                                    data[col.Name].map((v, i) => {
                                        return (
                                            <Text key={i} style={[styTextValue, v?.color && { color: `${v?.color}` }]}>
                                                {' '}
                                                {v?.value}{' '}
                                                {i !== data[col.Name].length - 1 ? (
                                                    <Text style={styTextValue}>|</Text>
                                                ) : (
                                                    <Text style={styTextValue}>{` ${unitTypeTxt}`}</Text>
                                                )}
                                            </Text>
                                        );
                                    })
                                ) : (
                                    <Text />
                                )}
                                <VnrText i18n={'HRM_OutLink'} style={styTextValue} />
                            </View>
                        );
                        break;
                    default:
                        viewValue = col?.NameOld ? (
                            <View style={{}}>
                                <Text
                                    style={[
                                        styTextValue,
                                        !isSalary && {
                                            textDecorationLine: 'line-through',
                                            textDecorationStyle: 'solid'
                                        }
                                    ]}
                                >
                                    {isSalary
                                        ? `${characters}`
                                        : `${data[col.NameOld] ? data[col.NameOld] : ''} ${unitTypeTxtOld}`}
                                </Text>
                                <Text style={styTextValue}>
                                    {isSalary
                                        ? `${characters}`
                                        : `${data[col.Name] ? data[col.Name] : '-'} ${unitTypeTxt}`}
                                </Text>
                            </View>
                        ) : (
                            <Text style={[styTextValue, TextColor && { color: `${TextColor}` }]}>
                                {isSalary
                                    ? `${characters}`
                                    : `${data[col.Name]}${unitTypeTxt ? ' ' + unitTypeTxt : ''}`}
                            </Text>
                        );
                }
            } else if (col?.NameOld) {
                viewValue = (
                    <View style={{ justifyContent: 'flex-start' }}>
                        <Text
                            style={[
                                styTextValue,
                                !isSalary && {
                                    textDecorationLine: 'line-through',
                                    textDecorationStyle: 'solid'
                                }
                            ]}
                        >
                            {isSalary ? `${characters}` : `${data[col.NameOld]}`}
                        </Text>
                        <Text style={styTextValue}>{isSalary ? `${characters}` : `${data[col.Name]}`}</Text>
                    </View>
                );
            } else if (col.DataType && col.DataType.toLowerCase() == 'e_html') {
                viewValue = (
                    <View>
                        <ViewHTML
                            source={data[col.Name]}
                            lable={data[col.PropName] ? data[col.PropName] : col.DisplayKey}
                        >
                            <Text style={[styleSheets.lable, styTextValue, CustomStyleSheet.color(Colors.primary)]}>
                                {translate('HRM_PortalApp_ViewDetail')}
                            </Text>
                        </ViewHTML>
                    </View>
                );
            } else {
                viewValue = <Text style={styTextValue}>{isSalary ? `${characters}` : `${data[col.Name]}`}</Text>;
            }
        } else if (col.DataType && col.DataType.toLowerCase() == 'bool') {
            viewValue = data[col.Name] ? (
                <IconCheckSquare size={Size.iconSize} color={Colors.primary} />
            ) : (
                <IconUnCheckSquare size={Size.iconSize} color={Colors.black} />
            );
        } else {
            viewValue = <Text style={[styleSheets.lable, styTextValue]}>-</Text>;
        }

        return (
            <View
                key={col.Label}
                style={[styles.styItemContent, styHideBorder, col.isWrapLine && { flexDirection: 'column' }]}
            >
                {col.DisplayKey !== '' && (
                    <View
                        style={[
                            styles.viewLable,
                            { justifyContent: 'flex-start' },
                            isAlignLayout && styles.viewLableJustify
                        ]}
                    >
                        <VnrText
                            style={[styleSheets.text, styTextLable]}
                            i18nKey={col.DisplayKey}
                        // numberOfLines={1}
                        />
                    </View>
                )}
                <View
                    style={[
                        styles.styViewValue,
                        isAlignLayout && styles.styViewValueJustify, // căn đều 2 bên
                        col.isWrapLine && { paddingLeft: 0, paddingTop: Size.defineHalfSpace, alignItems: 'flex-start' }
                    ]}
                >
                    {viewValue}
                    {/* </View> */}
                </View>
            </View>
        );
    };

    render() {
        const { data, col, allConfig } = this.props;
        const { isShowMore } = this.state;
        const groupedConfig = {};// Biến chứa các groups cần collapse
        let currentGroup = null;

        if (allConfig) {
            // eslint-disable-next-line no-unused-vars
            for (const item of allConfig) {
                //Lặp qua để chia các config con vào từng group nếu bắt đầu bằng chữ E_GROUP và có isCollapse = true
                if (item.TypeView.startsWith('E_GROUP')) {
                    if (item.isCollapse) {
                        currentGroup = item.DisplayKey;
                        if (!groupedConfig[currentGroup]) {
                            groupedConfig[currentGroup] = [];
                        }
                    } else {
                        continue; // Nếu là E_GROUP mà isCollapse = false thì đi tiếp vòng lặp kế
                    }
                } else if (currentGroup && !item.TypeView.startsWith('E_GROUP')) {
                    groupedConfig[currentGroup].push(item);
                }
            }
        }
        //#region handle styles
        let styTextValue = { ...styleSheets.lable, ...styTextValueInfo },
            styTextLable = { ...styleSheets.text, ...{ textAlign: 'left' } },
            styHideBorder = {};

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
        }

        //#endregion

        //#region Render Group Profile
        if (col.TypeView == EnumTypeFormatRender.E_GROUP_PROFILE) {
            const colProfile = allConfig.filter(
                (res) =>
                    res.TypeView === EnumTypeFormatRender.E_COMMON_PROFILE &&
                    res.Name !== 'ProfileName' &&
                    res.Name !== 'CodeEmp'
            );

            let groupProfile = {},
                currentGroup = null,
                configRemoveE_GROUP_PROFILE = [];

            if (!Array.isArray(allConfig) || allConfig.length === 0)
                return <View />;

            configRemoveE_GROUP_PROFILE = allConfig.filter(item => item?.TypeView !== EnumTypeFormatRender.E_COMMON_PROFILE)

            if (configRemoveE_GROUP_PROFILE.length === 0)
                return <View />;

            // eslint-disable-next-line no-unused-vars
            for (const item of configRemoveE_GROUP_PROFILE) {
                if (item.TypeView.startsWith('E_GROUP')) {
                    if (item.isCollapse) {
                        currentGroup = item.DisplayKey;
                        if (!groupProfile[currentGroup]) {
                            groupProfile[currentGroup] = [];
                        }
                    } else {
                        continue;
                    }
                } else if (currentGroup && !item.TypeView.startsWith('E_GROUP_PROFILE')) {
                    groupProfile[currentGroup].push(item);
                }
            }

            let txtProfileName = null;

            // const { PrimaryColor, SecondaryColor, FirstCharName } = randomColor;
            // const HIGHT_AVATAR = Size.deviceWidth >= 1024 ? 75 : Size.deviceWidth * 0.14;
            // let imageAvatar = null,
            //     txtProfileName = null;

            // if (data && data.ImagePath && Vnr_Function.checkIsPath(data.ImagePath)) {
            //     imageAvatar = { uri: data.ImagePath };
            // }

            if (data.CodeEmp != null) txtProfileName = data.CodeEmp;

            if (data.ProfileName)
                txtProfileName = txtProfileName != null ? `${txtProfileName} - ${data.ProfileName}` : data.ProfileName;

            return (
                <View>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        disabled={!col.isCollapse}
                        onPress={() => this.setState({ isShowMore: !isShowMore })}
                        key={col.Label}
                        style={[
                            styles.styItemContentGroup,
                            !isShowMore && stylesScreenDetailV3.styItemGroupCollapse,
                            CustomStyleSheet.marginVertical(0)
                        ]}
                    >
                        {/* <IconUser size={Size.text + 3} color={Colors.gray_8} /> */}
                        <VnrText
                            style={[styleSheets.lable, styles.styTextGroup, CustomStyleSheet.flex(1)]}
                            i18nKey={col.DisplayKey}
                            value={col.DisplayKey}
                        />
                        {col.isCollapse && (
                            <View onPress={() => this.setState({ isShowMore: !isShowMore })}>
                                {isShowMore ? (
                                    <IconShowUpChevron size={Size.iconSize} color={Colors.black} />
                                ) : (
                                    <IconShowDownChevron size={Size.iconSize} color={Colors.black} />
                                )}
                            </View>
                        )}
                    </TouchableOpacity>

                    {isShowMore ? (
                        <View
                            style={[
                                styles.styAvatarUser,
                                CustomStyleSheet.alignItems('flex-start'),
                                CustomStyleSheet.justifyContent('center')
                            ]}
                        >
                            <View style={styles.styAvatar}>
                                {Vnr_Function.renderAvatarCricleByName(
                                    data.ImagePath,
                                    data.ProfileName,
                                    styles.styImgAvatar.height,
                                    true
                                )}
                            </View>

                            <View style={styles.styViewProfile}>
                                <View style={styles.styProfileName}>
                                    <VnrText
                                        style={[styleSheets.lable, styles.styProfileText]}
                                        i18nKey={txtProfileName}
                                    />
                                </View>

                                <View style={styles.styListProfile}>
                                    {colProfile &&
                                        colProfile.length > 0 &&
                                        colProfile.map((colItem) => {
                                            if (data[colItem.Name])
                                                return (
                                                    <View style={styles.styListProfileItem}>
                                                        <Text style={[styleSheets.lable]}>{data[colItem.Name]}</Text>
                                                    </View>
                                                );
                                        })}
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View />
                    )}
                    <View>
                        {col.isCollapse && isShowMore ? (
                            groupProfile[col.DisplayKey] &&
                            groupProfile[col.DisplayKey].length > 0 &&
                            groupProfile[col.DisplayKey].map((colFilter) => {
                                return this.renderCommonString(colFilter);
                            })
                        ) : (
                            <View />
                        )}
                    </View>
                </View>
            );
        }
        //#endregion

        if (
            col.IsNullOrEmpty &&
            col.TypeView !== EnumTypeFormatRender.E_GROUP &&
            //&& Vnr_Function.CheckIsNullOrEmpty(col.DisplayKey)
            Vnr_Function.CheckIsNullOrEmpty(data[col.Name])
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

        //#region render lable
        if (col.TypeView == EnumTypeFormatRender.E_GROUP || col.TypeView == EnumTypeFormatRender.E_GROUP_FILEATTACH) {
            // let icon = <IconInfo size={Size.text + 3} color={Colors.gray_8} />;

            // if (col.TypeView == EnumTypeFormatRender.E_GROUP_APPROVE)
            //     icon = <IconUserCheck size={Size.text + 3} color={Colors.gray_8} />;
            // else if (col.TypeView == EnumTypeFormatRender.E_GROUP_FILEATTACH)
            //     icon = <IconFile size={Size.text + 3} color={Colors.gray_8} />;
            //reder group
            if (col.DataType && col.DataType.toLowerCase() == 'e_html') { //Render HTML dạng Group
                return (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[styles.styItemContentGroup]}
                        onPress={() => this.viewHTMLRef.show()}
                    >
                        <VnrText
                            style={[styleSheets.lable, styles.styTextGroup, CustomStyleSheet.flex(1)]}
                            i18nKey={data[col.PropName] ? data[col.PropName] : col.DisplayKey}
                            value={data[col.PropName] ? data[col.PropName] : col.DisplayKey}
                        />
                        <ViewHTML
                            ref={(ref) => (this.viewHTMLRef = ref)}
                            source={data[col.Name]}
                            lable={data[col.PropName] ? data[col.PropName] : col.DisplayKey}
                        >
                            <IconRight size={Size.iconSize} color={Colors.black} />
                        </ViewHTML>
                    </TouchableOpacity>
                );
            } else
                return (
                    <View>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            disabled={!col.isCollapse}
                            onPress={() => this.setState({ isShowMore: !isShowMore })}
                            key={col.Label}
                            style={[
                                styles.styItemContentGroup,
                                !isShowMore && stylesScreenDetailV3.styItemGroupCollapse
                            ]}
                        >
                            {/* {icon} */}
                            <VnrText
                                style={[styleSheets.lable, styles.styTextGroup, CustomStyleSheet.flex(1)]}
                                i18nKey={data[col.PropName] ? data[col.PropName] : col.DisplayKey}
                                value={data[col.PropName] ? data[col.PropName] : col.DisplayKey}
                            />
                            {col.isCollapse && (
                                <View>
                                    {isShowMore ? (
                                        <IconShowUpChevron size={Size.iconSize} color={Colors.black} />
                                    ) : (
                                        <IconShowDownChevron size={Size.iconSize} color={Colors.black} />
                                    )}
                                </View>
                            )}
                        </TouchableOpacity>
                        <View>
                            {col.isCollapse && isShowMore ? (
                                groupedConfig[col.DisplayKey] &&
                                groupedConfig[col.DisplayKey].length > 0 &&
                                groupedConfig[col.DisplayKey].map((colFilter) => {
                                    return this.renderCommonString(colFilter);
                                })
                            ) : (
                                <View />
                            )}
                        </View>
                    </View>
                );
        }
        //#endregion

        //#region render level approve
        if (col.TypeView == EnumTypeFormatRender.E_GROUP_APPROVE) {
            return (
                <VnrRenderApproverAtt
                    dataApprover={data.ProcessApproval}
                    lable={col.DisplayKey}
                    isCollapse={col.isCollapse}
                />
            );
        }
        //#endregion

        //#region render reason
        if (col.TypeView == EnumTypeFormatRender.E_REASON) {
            // render nguyen nhan
            if (data.Status === EnumName.E_CANCEL) {
                return (
                    <View key={col.Label} style={styles.styItemContent}>
                        <View style={styles.viewLable}>
                            <VnrText
                                style={[styleSheets.text, styTextLable]}
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
                        <View style={styles.viewLable}>
                            <VnrText
                                style={[styleSheets.text, styTextLable]}
                                i18nKey={'HRM_Attendance_Leaveday_DeclineReason'}
                            />
                        </View>
                        <View style={styles.styViewValue}>
                            <Text style={styTextValue}>
                                {col.NameReject && data[col.NameReject] ? data[col.NameReject] : ''}
                            </Text>
                        </View>
                    </View>
                );
            } else {
                return (
                    <View key={col.Label} style={styles.styItemContent}>
                        <View style={styles.viewLable}>
                            <VnrText style={[styleSheets.text, styTextLable]} i18nKey={col.DisplayKey} />
                        </View>
                        <View style={styles.styViewValue}>
                            <Text style={styTextValue}>{data[col.Name]}</Text>
                        </View>
                    </View>
                );
            }
        }
        //#endregion

        //#region render status
        if (col.TypeView == EnumTypeFormatRender.E_STATUS) {
            let _colorStatus = null,
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
                const { colorStatus, bgStatus } = data.itemStatusCancel;
                _bgStatusView = bgStatus ? Vnr_Function.convertTextToColor(bgStatus) : null;
                _colorStatus = colorStatus != null ? Vnr_Function.convertTextToColor(colorStatus) : null;
            } else if (data.itemStatus) {
                const { colorStatus, bgStatus } = data.itemStatus;
                _bgStatusView = bgStatus ? Vnr_Function.convertTextToColor(bgStatus) : null;
                _colorStatus = colorStatus
                    ? /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colorStatus)
                        ? colorStatus
                        : Vnr_Function.convertTextToColor(colorStatus)
                    : null;
            } else if (data.colorStatus) {
                _colorStatus = Vnr_Function.convertTextToColor(data.colorStatus);
            }

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
                        _timeStatus = `${translate('HRM_PortalApp_DateCreate')}:  ${data.DateApprove ? moment(data.DateApprove).format('DD/MM/YYYY') : ''
                        }`;
                    } else if (data.ApprovalDate) {
                        _timeStatus = `${translate('HRM_PortalApp_DateCreate')}:  ${data.ApprovalDate ? moment(data.ApprovalDate).format('DD/MM/YYYY') : ''
                        }`;
                    } else {
                        _timeStatus = `${translate('HRM_PortalApp_DateCreate')}:  ${data.DateUpdate ? moment(data.DateUpdate).format('DD/MM/YYYY') : ''
                        }`;
                    }
                } else if (data.Status === EnumName.E_REJECT || data.Status === EnumName.E_REJECTED) {
                    // hiển thị ngày từ chối
                    _timeStatus = `${translate('HRM_PortalApp_DateCreate')}:  ${data.DateReject ? moment(data.DateReject).format('DD/MM/YYYY') : ''
                    }`;
                } else if (data.Status === EnumName.E_CANCEL) {
                    // hiển thị ngày hủy
                    _timeStatus = `${translate('HRM_PortalApp_DateCreate')}:  ${data.DateCancel ? moment(data.DateCancel).format('DD/MM/YYYY') : ''
                    }`;
                } else if (data.Status === EnumStatus.E_SUBMIT_TEMP) {
                    // hiển thị ngày lưu tạm
                    _timeStatus = `${translate('HRM_PortalApp_DateCreate')}:  ${data.DateUpdate ? moment(data.DateUpdate).format('DD/MM/YYYY') : ''
                    }`;
                } else if (data.Status === EnumName.E_CONFIRM) {
                    // hiển thị ngày xác nhận
                    _timeStatus = `${translate('HRM_PortalApp_DateCreate')}:  ${moment(data.DateConfirm).format(
                        'DD/MM/YYYY'
                    )}`;
                } else if (data.DateUpdate) {
                    // hiển thị ngày yêu cầu
                    _timeStatus = `${translate('HRM_PortalApp_DateCreate')}:  ${moment(data.DateUpdate).format(
                        'DD/MM/YYYY'
                    )}`;
                }
            } else if (!_timeStatus && data[col.Name] && data.DateUpdate) {
                // hiển thị ngày yêu cầu
                _timeStatus = `${translate('HRM_PortalApp_DateCreate')}:  ${moment(data.DateUpdate).format(
                    'DD/MM/YYYY'
                )}`;
            }

            return (
                <View
                    style={[
                        styles.styViewStatusColor,
                        {
                            borderBottomColor: _colorStatus ? _colorStatus : Colors.gray_10,
                            backgroundColor: _bgStatusView ? _bgStatusView : Colors.white
                        }
                    ]}
                >
                    <View style={styles.styStatusWrap}>
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
                    </View>

                    {_timeStatus !== null && !col?.isHiddenDate && (
                        <View style={styles.styTimeWrap}>
                            <Text numberOfLines={1} style={[styTextValue, styles.styTextValueDateTimeStatus]}>
                                {_timeStatus}
                            </Text>
                        </View>
                    )}
                </View>
            );
        }
        //#endregion

        //#region render level approve
        if (
            [
                EnumTypeFormatRender.E_USERAPPROVE1,
                EnumTypeFormatRender.E_USERAPPROVE2,
                EnumTypeFormatRender.E_USERAPPROVE3,
                EnumTypeFormatRender.E_USERAPPROVE4
            ].includes(col.TypeView)
        ) {
            return null;
        }
        // if (
        //     [
        //         EnumTypeFormatRender.E_USERAPPROVE1,
        //         EnumTypeFormatRender.E_USERAPPROVE2,
        //         EnumTypeFormatRender.E_USERAPPROVE3,
        //         EnumTypeFormatRender.E_USERAPPROVE4
        //     ].includes(col.TypeView)
        // ) {
        //     //let isShowClassSalaryName = Vnr_Function.checkIsShowConfigField('ScreenViewDetail', 'ClassSalaryName')
        //     // render Cấp duyệt
        //     let approverDetail = {
        //         // Người duyệt đầu
        //         Approver1: {
        //             cancle: null,
        //             reject: null,
        //             approved: null
        //         },
        //         // Người duyệt kế tiếp
        //         Approver3: {
        //             cancle: null,
        //             reject: null,
        //             approved: null
        //         },
        //         // Người duyệt tiếp theo
        //         Approver4: {
        //             cancle: null,
        //             reject: null,
        //             approved: null
        //         },
        //         // Người duyệt cuối
        //         Approver2: {
        //             cancle: null,
        //             reject: null,
        //             approved: null
        //         }
        //     };

        //     if (data?.UserCanelID) {
        //         approverDetail = {
        //             ...approverDetail,
        //             Approver2: {
        //                 ...approverDetail.Approver2,
        //                 cancle:
        //                     data?.UserApproveID2 && data?.UserCanelID === data?.UserApproveID2
        //                         ? {
        //                             id: data.UserCanelID,
        //                             name: data?.UserCancelName,
        //                             date: data?.DateCancel
        //                                 ? moment(data.DateCancel).format('DD/MM/YYYY HH:mm:ss')
        //                                 : null,
        //                             comment: data?.CommentCancel,
        //                             subTitle:
        //                                   data?.CommentCancel !== ''
        //                                       ? translate('HRM_PortalApp_CanceledAndFeedback')
        //                                       : translate('HRM_PortalApp_Canceled')
        //                         }
        //                         : null
        //             }
        //         };
        //     }

        //     if (data?.UserRejectID) {
        //         approverDetail = {
        //             Approver1: {
        //                 ...approverDetail.Approver1,
        //                 reject:
        //                     data?.UserApproveID && data?.UserRejectID === data?.UserApproveID
        //                         ? {
        //                             id: data.UserRejectID,
        //                             name: data?.UserRejectName,
        //                             date: data?.DateReject
        //                                 ? moment(data.DateReject).format('DD/MM/YYYY HH:mm:ss')
        //                                 : null,
        //                             comment: data?.DeclineReason,
        //                             subTitle:
        //                                   data?.DeclineReason !== ''
        //                                       ? translate('HRM_PortalApp_RejectedAndFeedback')
        //                                       : translate('HRM_PortalApp_Rejected')
        //                         }
        //                         : null
        //             },
        //             Approver2: {
        //                 ...approverDetail.Approver2,
        //                 reject:
        //                     data?.UserApproveID2 && data?.UserRejectID === data?.UserApproveID2
        //                         ? {
        //                             id: data.UserRejectID,
        //                             name: data?.UserRejectName,
        //                             date: data?.DateReject
        //                                 ? moment(data.DateReject).format('DD/MM/YYYY HH:mm:ss')
        //                                 : null,
        //                             comment: data?.DeclineReason,
        //                             subTitle:
        //                                   data?.DeclineReason !== ''
        //                                       ? translate('HRM_PortalApp_RejectedAndFeedback')
        //                                       : translate('HRM_PortalApp_Rejected')
        //                         }
        //                         : null
        //             },
        //             Approver3: {
        //                 ...approverDetail.Approver3,
        //                 reject:
        //                     data?.UserApproveID3 && data?.UserRejectID === data?.UserApproveID3
        //                         ? {
        //                             id: data.UserRejectID,
        //                             name: data?.UserRejectName,
        //                             date: data?.DateReject
        //                                 ? moment(data.DateReject).format('DD/MM/YYYY HH:mm:ss')
        //                                 : null,
        //                             comment: data?.DeclineReason,
        //                             subTitle:
        //                                   data?.DeclineReason !== ''
        //                                       ? translate('HRM_PortalApp_RejectedAndFeedback')
        //                                       : translate('HRM_PortalApp_Rejected')
        //                         }
        //                         : null
        //             },
        //             Approver4: {
        //                 ...approverDetail.Approver4,
        //                 reject:
        //                     data?.UserApproveID4 && data?.UserRejectID === data?.UserApproveID4
        //                         ? {
        //                             id: data.UserRejectID,
        //                             name: data?.UserRejectName,
        //                             date: data?.DateReject
        //                                 ? moment(data.DateReject).format('DD/MM/YYYY HH:mm:ss')
        //                                 : null,
        //                             comment: data?.DeclineReason,
        //                             subTitle:
        //                                   data?.DeclineReason !== ''
        //                                       ? translate('HRM_PortalApp_RejectedAndFeedback')
        //                                       : translate('HRM_PortalApp_Rejected')
        //                         }
        //                         : null
        //             }
        //         };
        //     }

        //     // Người duyệt đầu
        //     if (data?.DateApprove1 && data?.UserProcessApproveID) {
        //         approverDetail = {
        //             ...approverDetail,
        //             Approver1: {
        //                 ...approverDetail.Approver1,
        //                 approved:
        //                     data?.UserApproveID && data?.UserProcessApproveID === data?.UserApproveID
        //                         ? {
        //                             id: data.UserProcessApproveID,
        //                             name: data?.UserApproveName,
        //                             date: moment(data.DateApprove1).format('DD/MM/YYYY HH:mm:ss'),
        //                             comment:
        //                                   data?.ApproveComment1 && data?.ApproveComment1 !== ''
        //                                       ? data?.ApproveComment1
        //                                       : null,
        //                             subTitle:
        //                                   data?.ApproveComment1 && data?.ApproveComment1 !== ''
        //                                       ? translate('HRM_PortalApp_ApprovedAndFeedback')
        //                                       : translate('HRM_PortalApp_Approved')
        //                         }
        //                         : null
        //             }
        //         };
        //     }
        //     // Người duyệt kế tiếp
        //     if (data?.DateApprove2 && data?.UserProcessApproveID2) {
        //         approverDetail = {
        //             ...approverDetail,
        //             Approver3: {
        //                 ...approverDetail.Approver3,
        //                 approved:
        //                     data?.UserApproveID3 && data?.UserProcessApproveID2 === data?.UserApproveID3
        //                         ? {
        //                             id: data.UserProcessApproveID2,
        //                             name: data?.UserApproveName3,
        //                             date: moment(data.DateApprove2).format('DD/MM/YYYY HH:mm:ss'),
        //                             comment:
        //                                   data?.ApproveComment2 && data?.ApproveComment2 !== ''
        //                                       ? data?.ApproveComment2
        //                                       : null,
        //                             subTitle:
        //                                   data?.ApproveComment2 && data?.ApproveComment2 !== ''
        //                                       ? translate('HRM_PortalApp_ApprovedAndFeedback')
        //                                       : translate('HRM_PortalApp_Approved')
        //                         }
        //                         : null
        //             }
        //         };
        //     }
        //     // Người duyệt tiếp theo
        //     if (data?.DateApprove3 && data?.UserProcessApproveID3) {
        //         approverDetail = {
        //             ...approverDetail,
        //             Approver4: {
        //                 ...approverDetail.Approver4,
        //                 approved:
        //                     data?.UserApproveID4 && data?.UserProcessApproveID3 === data?.UserApproveID4
        //                         ? {
        //                             id: data.UserProcessApproveID3,
        //                             name: data?.UserApproveName4,
        //                             date: moment(data.DateApprove3).format('DD/MM/YYYY HH:mm:ss'),
        //                             comment:
        //                                   data?.ApproveComment3 && data?.ApproveComment3 !== ''
        //                                       ? data?.ApproveComment3
        //                                       : null,
        //                             subTitle:
        //                                   data?.ApproveComment3 && data?.ApproveComment3 !== ''
        //                                       ? translate('HRM_PortalApp_ApprovedAndFeedback')
        //                                       : translate('HRM_PortalApp_Approved')
        //                         }
        //                         : null
        //             }
        //         };
        //     }
        //     // Người duyệt cuối
        //     if (data?.DateApprove && data?.UserProcessApproveID4) {
        //         approverDetail = {
        //             ...approverDetail,
        //             Approver2: {
        //                 ...approverDetail.Approver2,
        //                 approved:
        //                     data?.UserApproveID2 && data?.UserProcessApproveID4 === data?.UserApproveID2
        //                         ? {
        //                             id: data.UserProcessApproveID4,
        //                             name: data?.UserApproveName2,
        //                             date: moment(data.DateApprove).format('DD/MM/YYYY HH:mm:ss'),
        //                             comment:
        //                                   data?.ApproveComment4 && data?.ApproveComment4 !== ''
        //                                       ? data?.ApproveComment4
        //                                       : null,
        //                             subTitle:
        //                                   data?.ApproveComment4 && data?.ApproveComment4 !== ''
        //                                       ? translate('HRM_PortalApp_ApprovedAndFeedback')
        //                                       : translate('HRM_PortalApp_Approved')
        //                         }
        //                         : null
        //             }
        //         };
        //     }

        //     let isApproverReject = {
        //         // Người duyệt đầu
        //         Approver1: approverDetail.Approver1.reject ? true : false,

        //         // Người duyệt kế tiếp
        //         Approver3: approverDetail.Approver3.reject ? true : false,

        //         // Người duyệt tiếp theo
        //         Approver4: approverDetail.Approver4.reject ? true : false,

        //         // Người duyệt cuối
        //         Approver2: approverDetail.Approver2.reject ? true : false
        //     };

        //     let isApproverApproved = {
        //         // Người duyệt đầu
        //         Approver1: approverDetail.Approver1.approved ? true : false,

        //         // Người duyệt kế tiếp
        //         Approver3: approverDetail.Approver3.approved ? true : false,

        //         // Người duyệt tiếp theo
        //         Approver4: approverDetail.Approver4.approved ? true : false,

        //         // Người duyệt cuối
        //         Approver2: approverDetail.Approver2.approved ? true : false
        //     };

        //     let isApproverCancle = {
        //         // Người duyệt cuối
        //         Approver2: approverDetail.Approver2.cancle ? true : false
        //     };

        //     let isCurrentApprover = {
        //         // Người duyệt đầu
        //         Approver1: !approverDetail.Approver1.approved && !approverDetail.Approver1.reject ? true : false,

        //         // Người duyệt kế tiếp
        //         Approver3: approverDetail.Approver3.approved && !approverDetail.Approver3.reject ? true : false,

        //         // Người duyệt tiếp theo
        //         Approver4: approverDetail.Approver4.approved && !approverDetail.Approver4.reject ? true : false,

        //         // Người duyệt cuối
        //         Approver2: approverDetail.Approver2.approved && !approverDetail.Approver2.reject ? true : false
        //     };

        //     if (EnumTypeFormatRender.E_USERAPPROVE1 === col.TypeView) {
        //         // render Cấp duyệt 1
        //         let imageAvatar = data.AvatarUserApprove1 ? data.AvatarUserApprove1 : null; //: require('../../')
        //         return (
        //             <View key={col.Label} style={{ marginBottom: Size.defineSpace - 4 }}>
        //                 <View style={styles.wrapLevelApproveAndDisplaykey}>
        //                     <View
        //                         style={[
        //                             styles.wrapLevelApprove,
        //                             (isApproverApproved.Approver1 || isCurrentApprover.Approver1) && {
        //                                 backgroundColor: Colors.green
        //                             },
        //                             isApproverReject.Approver1 && { backgroundColor: Colors.red }
        //                         ]}
        //                     >
        //                         {isApproverReject.Approver1 ? (
        //                             <IconCancel size={Size.iconSize - 10} color={Colors.white} />
        //                         ) : isApproverApproved.Approver1 ? (
        //                             <IconCheck size={Size.iconSize - 10} color={Colors.white} />
        //                         ) : (
        //                             <Text
        //                                 style={[
        //                                     styleSheets.styTextValueDateTimeStatus,
        //                                     (isApproverApproved.Approver1 || isCurrentApprover.Approver1) && {
        //                                         color: Colors.white
        //                                     }
        //                                 ]}
        //                             >
        //                                 1
        //                             </Text>
        //                         )}
        //                     </View>
        //                     <VnrText
        //                         style={[styleSheets.text, styTextLable]}
        //                         i18nKey={col.DisplayKey}
        //                         value={col.DisplayKey}
        //                     />
        //                 </View>
        //                 <View style={[styles.wrapInforApprover]}>
        //                     <View style={styles.wrapStraightLine}>
        //                         <View
        //                             style={[
        //                                 styles.straightLine,
        //                                 (isApproverApproved.Approver1 || isCurrentApprover.Approver1) && {
        //                                     backgroundColor: Colors.green
        //                                 },
        //                                 isApproverReject.Approver1 && { backgroundColor: Colors.red }
        //                             ]}
        //                         />
        //                     </View>
        //                     <View style={{ flex: 1 }}>
        //                         <View style={stylesVnrFilter.viewLable}>
        //                             {Vnr_Function.renderAvatarCricleByName(imageAvatar, data[col.Name], sizeImg)}
        //                             <View style={styleSheets.wrapNameAndSubtitle}>
        //                                 <View style={{ flex: 1 }}>
        //                                     <Text numberOfLines={2} style={[styleSheets.subTitleApprover]}>
        //                                         <Text style={[styleSheets.detailNameApprover]}>{data[col.Name]}</Text>
        //                                         {approverDetail.Approver1.cancle?.subTitle
        //                                             ? approverDetail.Approver1.cancle?.subTitle
        //                                             : approverDetail.Approver1.reject?.subTitle
        //                                                 ? approverDetail.Approver1.reject?.subTitle
        //                                                 : approverDetail.Approver1.approved?.subTitle
        //                                                     ? approverDetail.Approver1.approved?.subTitle
        //                                                     : null}
        //                                     </Text>
        //                                 </View>
        //                                 <Text style={[styleSheets.detailPositionApprover]}>
        //                                     {approverDetail.Approver1.reject?.date
        //                                         ? approverDetail.Approver1.reject?.date
        //                                         : approverDetail.Approver1.approved?.date
        //                                             ? approverDetail.Approver1.approved?.date
        //                                             : data?.PositionNameApprove1}
        //                                 </Text>
        //                             </View>
        //                         </View>
        //                         {approverDetail.Approver1.reject?.comment ||
        //                         approverDetail.Approver1.approved?.comment ? (
        //                                 <View style={[{ marginLeft: sizeImg + Size.defineSpace - 4 }, styles.styleComment]}>
        //                                     <Text style={styleSheets.text}>
        //                                         {approverDetail.Approver1.reject?.comment ||
        //                                         approverDetail.Approver1.approved?.comment}
        //                                     </Text>
        //                                 </View>
        //                             ) : null}
        //                     </View>
        //                 </View>
        //             </View>
        //         );
        //     } else if (EnumTypeFormatRender.E_USERAPPROVE3 === col.TypeView) {
        //         // render Cấp duyệt 2
        //         let imageAvatar = data.AvatarUserApprove2 ? data.AvatarUserApprove2 : null; //: require('../../')
        //         return (
        //             <View key={col.Label} style={{ marginBottom: Size.defineSpace - 4 }}>
        //                 <View style={styles.wrapLevelApproveAndDisplaykey}>
        //                     <View
        //                         style={[
        //                             styles.wrapLevelApprove,
        //                             (isApproverApproved.Approver3 || isCurrentApprover.Approver3) && {
        //                                 backgroundColor: Colors.green
        //                             },
        //                             isApproverReject.Approver3 && { backgroundColor: Colors.red }
        //                         ]}
        //                     >
        //                         <Text style={[styleSheets.styTextValueDateTimeStatus]}>
        //                             {isApproverReject.Approver3 ? (
        //                                 <IconCancel size={Size.iconSize - 10} color={Colors.white} />
        //                             ) : isApproverApproved.Approver3 ? (
        //                                 <IconCheck size={Size.iconSize - 10} color={Colors.white} />
        //                             ) : (
        //                                 <Text
        //                                     style={[
        //                                         styleSheets.styTextValueDateTimeStatus,
        //                                         (isApproverApproved.Approver3 || isCurrentApprover.Approver3) && {
        //                                             color: Colors.white
        //                                         }
        //                                     ]}
        //                                 >
        //                                     2
        //                                 </Text>
        //                             )}
        //                         </Text>
        //                     </View>
        //                     <VnrText
        //                         style={[styleSheets.text, styTextLable]}
        //                         i18nKey={col.DisplayKey}
        //                         value={col.DisplayKey}
        //                     />
        //                 </View>
        //                 <View style={[styles.wrapInforApprover]}>
        //                     <View style={styles.wrapStraightLine}>
        //                         <View
        //                             style={[
        //                                 styles.straightLine,
        //                                 (isApproverApproved.Approver3 || isCurrentApprover.Approver3) && {
        //                                     backgroundColor: Colors.green
        //                                 },
        //                                 isApproverReject.Approver3 && { backgroundColor: Colors.red }
        //                             ]}
        //                         />
        //                     </View>
        //                     <View style={{ flex: 1 }}>
        //                         <View style={stylesVnrFilter.viewLable}>
        //                             {Vnr_Function.renderAvatarCricleByName(imageAvatar, data[col.Name], sizeImg)}
        //                             <View style={styleSheets.wrapNameAndSubtitle}>
        //                                 <View style={{ flex: 1 }}>
        //                                     <Text numberOfLines={2} style={[styleSheets.subTitleApprover]}>
        //                                         <Text style={[styleSheets.detailNameApprover]}>{data[col.Name]}</Text>
        //                                         {approverDetail.Approver3.cancle?.subTitle
        //                                             ? approverDetail.Approver3.cancle?.subTitle
        //                                             : approverDetail.Approver3.reject?.subTitle
        //                                                 ? approverDetail.Approver3.reject?.subTitle
        //                                                 : approverDetail.Approver3.approved?.subTitle
        //                                                     ? approverDetail.Approver3.approved?.subTitle
        //                                                     : null}
        //                                     </Text>
        //                                 </View>
        //                                 <Text style={[styleSheets.detailPositionApprover]}>
        //                                     {approverDetail.Approver3.reject?.date
        //                                         ? approverDetail.Approver3.reject?.date
        //                                         : approverDetail.Approver3.approved?.date
        //                                             ? approverDetail.Approver3.approved?.date
        //                                             : data?.PositionNameApprove3}
        //                                 </Text>
        //                             </View>
        //                         </View>
        //                         {approverDetail.Approver3.reject?.comment ||
        //                         approverDetail.Approver3.approved?.comment ? (
        //                                 <View style={[{ marginLeft: sizeImg + Size.defineSpace - 4 }, styles.styleComment]}>
        //                                     <Text style={styleSheets.text}>
        //                                         {approverDetail.Approver3.reject?.comment ||
        //                                         approverDetail.Approver3.approved?.comment}
        //                                     </Text>
        //                                 </View>
        //                             ) : null}
        //                     </View>
        //                 </View>
        //             </View>
        //         );
        //     } else if (EnumTypeFormatRender.E_USERAPPROVE4 === col.TypeView) {
        //         // render Cấp duyệt 3
        //         let imageAvatar = data.AvatarUserApprove3 ? data.AvatarUserApprove3 : null; //: require('../../')
        //         return (
        //             <View key={col.Label} style={{ marginBottom: Size.defineSpace - 4 }}>
        //                 <View style={styles.wrapLevelApproveAndDisplaykey}>
        //                     <View
        //                         style={[
        //                             styles.wrapLevelApprove,
        //                             (isApproverApproved.Approver4 || isCurrentApprover.Approver4) && {
        //                                 backgroundColor: Colors.green
        //                             },
        //                             isApproverReject.Approver4 && { backgroundColor: Colors.red }
        //                         ]}
        //                     >
        //                         <Text style={[styleSheets.styTextValueDateTimeStatus]}>
        //                             {isApproverReject.Approver4 ? (
        //                                 <IconCancel size={Size.iconSize - 10} color={Colors.white} />
        //                             ) : isApproverApproved.Approver4 ? (
        //                                 <IconCheck size={Size.iconSize - 10} color={Colors.white} />
        //                             ) : (
        //                                 <Text
        //                                     style={[
        //                                         styleSheets.styTextValueDateTimeStatus,
        //                                         (isApproverApproved.Approver4 || isCurrentApprover.Approver4) && {
        //                                             color: Colors.white
        //                                         }
        //                                     ]}
        //                                 >
        //                                     3
        //                                 </Text>
        //                             )}
        //                         </Text>
        //                     </View>
        //                     <VnrText
        //                         style={[styleSheets.text, styTextLable]}
        //                         i18nKey={col.DisplayKey}
        //                         value={col.DisplayKey}
        //                     />
        //                 </View>
        //                 <View style={[styles.wrapInforApprover]}>
        //                     <View style={styles.wrapStraightLine}>
        //                         <View
        //                             style={[
        //                                 styles.straightLine,
        //                                 (isApproverApproved.Approver4 || isCurrentApprover.Approver4) && {
        //                                     backgroundColor: Colors.green
        //                                 },
        //                                 isApproverReject.Approver4 && { backgroundColor: Colors.red }
        //                             ]}
        //                         />
        //                     </View>
        //                     <View style={{ flex: 1 }}>
        //                         <View style={stylesVnrFilter.viewLable}>
        //                             {Vnr_Function.renderAvatarCricleByName(imageAvatar, data[col.Name], sizeImg)}
        //                             <View style={styleSheets.wrapNameAndSubtitle}>
        //                                 <View style={{ flex: 1 }}>
        //                                     <Text numberOfLines={2} style={[styleSheets.subTitleApprover]}>
        //                                         <Text style={[styleSheets.detailNameApprover]}>{data[col.Name]}</Text>
        //                                         {approverDetail.Approver4.cancle?.subTitle
        //                                             ? approverDetail.Approver4.cancle?.subTitle
        //                                             : approverDetail.Approver4.reject?.subTitle
        //                                                 ? approverDetail.Approver4.reject?.subTitle
        //                                                 : approverDetail.Approver4.approved?.subTitle
        //                                                     ? approverDetail.Approver4.approved?.subTitle
        //                                                     : null}
        //                                     </Text>
        //                                 </View>
        //                                 <Text style={[styleSheets.detailPositionApprover]}>
        //                                     <Text style={[styleSheets.detailPositionApprover]}>
        //                                         {approverDetail.Approver4.reject?.date
        //                                             ? approverDetail.Approver4.reject?.date
        //                                             : approverDetail.Approver4.approved?.date
        //                                                 ? approverDetail.Approver4.approved?.date
        //                                                 : data?.PositionNameApprove4}
        //                                     </Text>
        //                                 </Text>
        //                             </View>
        //                         </View>
        //                         {approverDetail.Approver4.reject?.comment ||
        //                         approverDetail.Approver4.approved?.comment ? (
        //                                 <View style={[{ marginLeft: sizeImg + Size.defineSpace - 4 }, styles.styleComment]}>
        //                                     <Text style={styleSheets.text}>
        //                                         {approverDetail.Approver4.reject?.comment ||
        //                                         approverDetail.Approver4.approved?.comment}
        //                                     </Text>
        //                                 </View>
        //                             ) : null}
        //                     </View>
        //                 </View>
        //             </View>
        //         );
        //     } else if (EnumTypeFormatRender.E_USERAPPROVE2 === col.TypeView) {
        //         // render Người duyệt cuối
        //         let imageAvatar = data.AvatarUserApprove4 ? data.AvatarUserApprove4 : null; //: require('../../')
        //         return (
        //             <View key={col.Label} style={{ marginBottom: Size.defineSpace - 4 }}>
        //                 <View style={styles.wrapLevelApproveAndDisplaykey}>
        //                     <View
        //                         style={[
        //                             styles.wrapLevelApprove,
        //                             (isApproverApproved.Approver2 || isCurrentApprover.Approver2) && {
        //                                 backgroundColor: Colors.green
        //                             },
        //                             (isApproverReject.Approver2 || isApproverCancle.Approver2) && {
        //                                 backgroundColor: Colors.red
        //                             }
        //                         ]}
        //                     >
        //                         <Text style={[styleSheets.styTextValueDateTimeStatus]}>
        //                             {isApproverReject.Approver2 || isApproverCancle.Approver2 ? (
        //                                 <IconCancel size={Size.iconSize - 10} color={Colors.white} />
        //                             ) : isApproverApproved.Approver2 ? (
        //                                 <IconCheck size={Size.iconSize - 10} color={Colors.white} />
        //                             ) : (
        //                                 <Text
        //                                     style={[
        //                                         styleSheets.styTextValueDateTimeStatus,
        //                                         (isApproverApproved.Approver2 || isCurrentApprover.Approver2) && {
        //                                             color: Colors.white
        //                                         }
        //                                     ]}
        //                                 >
        //                                     4
        //                                 </Text>
        //                             )}
        //                         </Text>
        //                     </View>
        //                     <VnrText
        //                         style={[styleSheets.text, styTextLable]}
        //                         i18nKey={col.DisplayKey}
        //                         value={col.DisplayKey}
        //                     />
        //                 </View>
        //                 <View style={[styles.wrapInforApprover]}>
        //                     <View style={styles.wrapStraightLine}>
        //                         <View
        //                             style={[
        //                                 styles.straightLine,
        //                                 (isApproverApproved.Approver2 || isCurrentApprover.Approver2) && {
        //                                     backgroundColor: Colors.green
        //                                 },
        //                                 (isApproverReject.Approver2 || isApproverCancle.Approver2) && {
        //                                     backgroundColor: Colors.red
        //                                 }
        //                             ]}
        //                         />
        //                     </View>
        //                     <View style={{ flex: 1 }}>
        //                         <View style={stylesVnrFilter.viewLable}>
        //                             {Vnr_Function.renderAvatarCricleByName(imageAvatar, data[col.Name], sizeImg)}
        //                             <View style={styleSheets.wrapNameAndSubtitle}>
        //                                 <View style={{ flex: 1 }}>
        //                                     <Text numberOfLines={2} style={[styleSheets.subTitleApprover]}>
        //                                         <Text style={[styleSheets.detailNameApprover]}>{data[col.Name]}</Text>
        //                                         {approverDetail.Approver2.cancle?.subTitle
        //                                             ? approverDetail.Approver2.cancle?.subTitle
        //                                             : approverDetail.Approver2.reject?.subTitle
        //                                                 ? approverDetail.Approver2.reject?.subTitle
        //                                                 : approverDetail.Approver2.approved?.subTitle
        //                                                     ? approverDetail.Approver2.approved?.subTitle
        //                                                     : null}
        //                                     </Text>
        //                                 </View>
        //                                 <Text style={[styleSheets.detailPositionApprover]}>
        //                                     {approverDetail.Approver2.cancle?.date
        //                                         ? approverDetail.Approver2.cancle?.date
        //                                         : approverDetail.Approver2.reject?.date
        //                                             ? approverDetail.Approver2.reject?.date
        //                                             : approverDetail.Approver2.approved?.date
        //                                                 ? approverDetail.Approver2.approved?.date
        //                                                 : data?.PositionNameApprove2}
        //                                 </Text>
        //                             </View>
        //                         </View>
        //                         {approverDetail.Approver2.reject?.comment?.length > 0 ||
        //                         approverDetail.Approver2.approved?.comment?.length > 0 ||
        //                         approverDetail.Approver2.cancle?.comment?.length > 0 ? (
        //                                 <View style={[{ marginLeft: sizeImg + Size.defineSpace - 4 }, styles.styleComment]}>
        //                                     <Text style={styleSheets.text}>
        //                                         {isApproverCancle.Approver2
        //                                             ? approverDetail.Approver2.cancle?.comment
        //                                             : isApproverReject.Approver2
        //                                                 ? approverDetail.Approver2.reject?.comment
        //                                                 : isApproverApproved.Approver2 || isCurrentApprover.Approver2
        //                                                     ? approverDetail.Approver2.approved?.comment
        //                                                     : null}
        //                                     </Text>
        //                                 </View>
        //                             ) : null}
        //                     </View>
        //                 </View>
        //             </View>
        //         );
        //     }
        // }
        //#endregion

        //#region render limit (Lỗi vi phạm đăng lý)
        if (col.TypeView == EnumTypeFormatRender.E_LIMIT) {
            return data[col.Name] ? (
                <View style={styles.styViewWarning}>
                    <Text style={[styleSheets.lable, styles.styWarText]}>{data[col.Name]}</Text>
                </View>
            ) : (
                <View />
            );
        }
        //#endregion

        //#region render show more infor
        if (col.TypeView == EnumTypeFormatRender.E_SHOW_MORE_INFO) {
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
                    <IconDown size={Size.iconSize} color={Colors.primary} />
                    <VnrText
                        style={[styleSheets.lable, styles.styTextLableInfo, styles.styViewBtnShowHideText]}
                        i18nKey={col.DisplayKey ? col.DisplayKey : 'HRM_PortalApp_Expand_Info'}
                    />
                </TouchableOpacity>
            ) : (
                <View />
            );
        }
        //#endregion

        //#region render no data
        if (col.TypeView == EnumTypeFormatRender.E_NODATA) {
            return (
                <View key={col.Label} style={[styles.styItemContent, styHideBorder]}>
                    <View style={styles.viewLable}>
                        <VnrText style={[styleSheets.text, styTextLable]} i18nKey={col.DisplayKey} />
                    </View>
                    <View style={styles.styViewValue}>
                        <VnrText style={styTextValue} i18nKey={col.Name} />
                    </View>
                </View>
            );
        }
        //#endregion

        //#region render common
        const isHaveGroupCollapse = Object.values(groupedConfig).some((group) =>
            group.some((item) => item.Name === col.Name)
        ); //Check xem dòng đang render có nằm trong groupedConfig không
        if (!col.isCollapse && !isHaveGroupCollapse) {
            return this.renderCommonString(col);
        } else {
            return <View />;
        }
        //#endregion
    }
}

const styles = stylesScreenDetailV3;
const { styTextValueInfo } = styles;

export default VnrFormatStringType;
