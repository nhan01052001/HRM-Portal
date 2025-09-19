/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';

import { styleSheets, Size, Colors, CustomStyleSheet } from '../../constants/styleConfig';
import { IconCheckSquare, IconUnCheckSquare } from '../../constants/Icons';
import Vnr_Function from '../../utils/Vnr_Function';
import { translate } from '../../i18n/translate';
import VnrText from '../../components/VnrText/VnrText';
import ViewMap from '../../components/ViewMap/ViewMap';
import ViewImg from '../../components/ViewImg/ViewImg';
import format from 'number-format.js';
class VnrFormatStringTypeItem extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { data, col } = this.props;

        //#region handle styles
        let styTextValue = { ...styleSheets.lable, ...styles.styTextValueInfo },
            styTextLable = { ...styleSheets.text, ...styles.styTextLableInfo },
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
        // if (col.TypeView == EnumTypeFormatRender.E_FILEATTACH) {
        //     if (typeof data[col.Name] === 'string') {
        //         const listFile = data[col.Name].split(',');
        //         return (
        //             <View style={styles.styViewFileAttach}>
        //                 {listFile.map(file => (
        //                     <TouchableOpacity
        //                         style={styles.styContentFile}
        //                         onPress={() => Vnr_Function.downloadFileAttach(file.path)}>
        //                         {Vnr_Function.renderIconTypeFile(file.ext)}
        //                         <View style={styles.viewLable}>
        //                             <Text style={[styleSheets.lable, styles.styTextDownload]} numberOfLines={1}>
        //                                 {ManageFileSevice.getNameFileFromURI(file.fileName)}
        //                             </Text>
        //                         </View>
        //                         <IconDownload size={Size.iconSize} color={Colors.black} />
        //                     </TouchableOpacity>
        //                 ))}
        //             </View>
        //         );
        //     } else if (Array.isArray(data[col.Name]) && data[col.Name].length > 0) {
        //         const listFile = data[col.Name];
        //         return (
        //             <View style={styles.styViewFileAttach}>
        //                 {listFile.map(file => (
        //                     <TouchableOpacity
        //                         style={styles.styContentFile}
        //                         onPress={() => Vnr_Function.downloadFileAttach(file.path)}>
        //                         {Vnr_Function.renderIconTypeFile(file.ext)}
        //                         <View style={styles.viewLable}>
        //                             <Text style={[styleSheets.text, styles.styTextDownload]} numberOfLines={1}>
        //                                 {ManageFileSevice.getNameFileFromURI(file.fileName)}
        //                             </Text>
        //                         </View>

        //                         <IconDownload size={Size.iconSize} color={Colors.black} />
        //                     </TouchableOpacity>
        //                 ))}
        //             </View>
        //         );
        //     }
        // }
        //#endregion

        //#region render common
        let viewValue = <View />;
        if (
            Vnr_Function.CheckIsNullOrEmpty(data[col.Name]) === false ||
            Vnr_Function.CheckIsNullOrEmpty(data[col.NameOld]) === false ||
            (col.NameSecond && data[col.NameSecond])
        ) {
            if (col.Name == 'StatusView') {
                // lấy màu trong itemStatus

                let _colorStatus = null;
                if (data.itemStatus) {
                    const { colorStatus } = data.itemStatus;
                    _colorStatus = colorStatus != null ? Vnr_Function.convertTextToColor(colorStatus) : null;
                } else if (data.colorStatus) {
                    _colorStatus = Vnr_Function.convertTextToColor(data.colorStatus);
                } else if (col?.colorText) {
                    _colorStatus = Vnr_Function.convertTextToColor(col?.colorText);
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
                        <View key={col.Label} style={[styles.styItemContent, CustomStyleSheet.flexDirection('row')]}>
                            <View style={styles.viewLable}>
                                <VnrText style={[styleSheets.text, styTextLable]} i18nKey={col.DisplayKey} />
                            </View>
                            <View style={styles.styViewValue}>
                                {listFile.map((file, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={CustomStyleSheet.flex(1)}
                                        onPress={() => Vnr_Function.downloadFileAttach(file)}
                                    >
                                        <Text
                                            numberOfLines={1}
                                            style={[
                                                styTextValue,
                                                // eslint-disable-next-line react-native/no-inline-styles
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
                        <View key={col.Label} style={[styles.styItemContent, CustomStyleSheet.flexDirection('column')]}>
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
                                                // eslint-disable-next-line react-native/no-inline-styles
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
                viewValue = <Text style={styTextValue}>{`${value} ${unitTypeTxt}`}</Text>;
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
                    if (data && Object.keys(data).length > 0 && Object.prototype.hasOwnProperty.call(data, col.UnitOld)) {
                        unitTypeTxtOld = data[col.UnitOld];
                    } else {
                        unitTypeTxtOld = translate(col.UnitOld);
                    }
                }

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
                                        {
                                            textDecorationLine: 'line-through',
                                            textDecorationStyle: 'solid'
                                        }
                                    ]}
                                >
                                    {`${data[col.NameOld]} ${unitTypeTxtOld}`}
                                </Text>
                                <Text style={styTextValue}>{`${data[col.Name]} ${unitTypeTxt}`}</Text>
                            </View>
                        ) : (
                            <Text style={[styTextValue, TextColor && { color: `${TextColor}` }]}>
                                {`${data[col.Name]} ${unitTypeTxt}`}
                            </Text>
                        );
                }
            } else if (col?.NameOld) {
                viewValue = (
                    <View style={{ justifyContent: 'flex-start' }}>
                        <Text
                            style={[
                                styTextValue,
                                {
                                    textDecorationLine: 'line-through',
                                    textDecorationStyle: 'solid'
                                }
                            ]}
                        >
                            {data[col.NameOld]}
                        </Text>
                        <Text style={styTextValue}>{data[col.Name]}</Text>
                    </View>
                );
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
            viewValue = <Text style={[styleSheets.text, styTextValue]}>-</Text>;
        }
        return (
            <View key={col.Label} style={[styles.styItemContent, styHideBorder]}>
                <View style={[styles.viewLable, { justifyContent: 'flex-start' }]}>
                    <VnrText
                        style={[styleSheets.text, styTextLable]}
                        i18nKey={col.DisplayKey}
                        // numberOfLines={1}
                    />
                </View>
                <View style={styles.styViewValue}>
                    {viewValue}
                    {/* </View> */}
                </View>
            </View>
        );
        //#endregion
    }
}

const styles = StyleSheet.create({
    styItemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5
    },
    styViewValue: {
        flex: 8,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingLeft: Size.defineSpace,
        minWidth: 160 - Size.defineSpace * 2
    },
    viewLable: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'flex-start',
        minWidth: 160 - Size.defineSpace * 2
    },
    styTextLableInfo: {
        fontSize: Size.text - 1,
        color: Colors.gray_10,
        textAlign: 'left'
    },
    styTextValueInfo: {
        fontSize: Size.text - 1,
        color: Colors.gray_10,
        textAlign: 'right'
    }
});

export default VnrFormatStringTypeItem;
