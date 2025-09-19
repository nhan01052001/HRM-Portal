import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, CustomStyleSheet, Size, styleSheets, styleVnrListItemOvertime } from '../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { IconDate, IconTime } from '../../../../../constants/Icons';
import VnrText from '../../../../../components/VnrText/VnrText';

export default class RenderItemDataAnalysic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    formatStringType = (data, col, styleText) => {
        if (!Vnr_Function.CheckIsNullOrEmpty(data[col.Name])) {
            if (col.Name == 'StatusView' && !Vnr_Function.CheckIsNullOrEmpty(data.colorStatus)) {
                return (
                    <View style={[styles.LineSatus, { backgroundColor: data.colorStatus }]}>
                        <Text style={[styleSheets.textItalic, styles.txtstyleStatus]} numberOfLines={2}>
                            {data[col.Name]}
                        </Text>
                    </View>
                );
            }
            if (col.DataType && col.DataType.toLowerCase() == 'datetime') {
                return (
                    <Text style={[styleSheets.text, { fontSize: Size.text - 2 }]} numberOfLines={1}>
                        {moment(data[col.Name]).format(col.DataFormat)}
                    </Text>
                );
            }
            if (col.DataType && col.DataType.toLowerCase() == 'double') {
                return (
                    <Text style={[styleSheets.text, { fontSize: Size.text - 2 }]} numberOfLines={1}>
                        {format(col.DataFormat, data[col.Name])}
                    </Text>
                );
            } else {
                return (
                    <Text style={[styleSheets.text, styleText]} numberOfLines={1}>
                        {data[col.Name]}
                    </Text>
                );
            }
        }
    };

    render() {
        const { dataItem, index, removeItem } = this.props,
            VnrListItemAction = styleVnrListItemOvertime.VnrListItemAction;
        let ViewDateTodateFrom = <View />,
            valueTypeOT = '';

        if (!Vnr_Function.CheckIsNullOrEmpty(dataItem['WorkDate'])) {
            ViewDateTodateFrom = (
                <View style={styles.Line}>
                    <View style={styles.iconDateContent}>
                        <IconDate size={Size.text + 1} color={Colors.primary} />
                    </View>
                    <Text style={styleSheets.text}>{moment(dataItem.WorkDate).format('DD/MM/YY')}</Text>

                    <View style={[styles.iconDateContent, CustomStyleSheet.marginLeft(15)]}>
                        <IconTime size={Size.text + 1} color={Colors.primary} />
                    </View>
                    {/* //OutTime InTime */}
                    {dataItem.OutTime && dataItem.InTime && (
                        <Text style={[styleSheets.text]} numberOfLines={1}>
                            {`${moment(dataItem.InTime).format('HH:mm')} - ${moment(dataItem.OutTime).format('HH:mm')}`}
                        </Text>
                    )}
                </View>
            );
        }

        if (dataItem['DurationTypeView']) {
            valueTypeOT = `${dataItem['DurationTypeView']}`;
            if (dataItem.OvertimeTypeName) {
                valueTypeOT += ` - ${dataItem.OvertimeTypeName}`;
            }
        }

        return (
            <View style={{ ...CustomStyleSheet.flex(1), ...CustomStyleSheet.paddingHorizontal(Size.defineSpace) }}>
                <View style={VnrListItemAction.styleViewBorderButtom}>
                    {/* <View style={{}}>
                        <CheckBoxComponent
                            avatar={ImagePath}
                        />
                    </View> */}

                    <View style={styles.rightContent} key={index}>
                        <View style={styles.viewInfo}>
                            <View style={styles.Line}>
                                <Text style={[styleSheets.lable]}>{dataItem['ProfileName']}</Text>
                            </View>

                            {ViewDateTodateFrom}
                            <View style={styles.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styles.fontText]}
                                    i18nKey={'HRM_Attendance_AnnualLeaveDetail_LeaveType'}
                                />
                                <Text style={[styleSheets.textItalic, styles.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text numberOfLines={1} style={[styleSheets.textItalic, styles.fontText]}>
                                        {valueTypeOT}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styles.fontText]}
                                    i18nKey={'HRM_System_Resource_Tra_Reason'}
                                />
                                <Text style={[styleSheets.textItalic, styles.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text numberOfLines={1} style={[styleSheets.textItalic, styles.fontText]}>
                                        {dataItem['ReasonOT']}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styles.fontText]}
                                    i18nKey={'HRM_Attendance_udHour_WeekMonthYear'}
                                />
                                <Text style={[styleSheets.textItalic, styles.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text numberOfLines={1} style={[styleSheets.textItalic, styles.fontText]}>
                                        {`${dataItem.udHourByWeek}/${dataItem.udHourByMonth}/${dataItem.udHourByYear}`}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.viewOvertime}>
                            <View style={styles.viewNumbertime}>
                                <View style={styles.numberTime}>
                                    <Text style={[styleSheets.lable, { color: Colors.white }]}>
                                        {dataItem['RegisterHours']}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.viewStatus}
                                onPress={() => removeItem(dataItem.ID)}
                            >
                                <VnrText
                                    style={[styleSheets.lable, { color: Colors.white }]}
                                    i18nKey={'HRM_System_Resource_Sys_Delete'}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewStatus: {
        backgroundColor: Colors.danger,
        paddingHorizontal: 18,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    fontText: {
        fontSize: Size.text - 1
    },
    viewNumbertime: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    LineSatus: {
        //paddingVertical  :2,
        paddingHorizontal: 3,
        borderRadius: styleSheets.radius_5,
        alignItems: 'center'
    },
    txtstyleStatus: {
        color: Colors.white,
        fontWeight: '600'
    },
    viewOvertime: {
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    numberTime: {
        backgroundColor: Colors.primary,
        width: 38,
        height: 38,
        borderRadius: 38 * 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewInfo: {
        flex: 1
    },
    rightContent: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: styleSheets.p_10,
        backgroundColor: Colors.white
    },
    Line: {
        flex: 1,
        flexDirection: 'row',
        maxWidth: '100%',
        marginVertical: 1.5
    },
    iconDateContent: {
        marginRight: 5,
        justifyContent: 'center'
    }
});
