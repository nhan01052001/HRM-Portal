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
            RenderItemAction = styles,
            VnrListItemAction = styleVnrListItemOvertime.VnrListItemAction;
        let ViewDateTodateFrom = <View />,
            valueTypeOT = '';

        if (!Vnr_Function.CheckIsNullOrEmpty(dataItem['WorkDate'])) {
            ViewDateTodateFrom = (
                <View style={RenderItemAction.Line}>
                    <View style={RenderItemAction.iconDateContent}>
                        <IconDate size={Size.text + 1} color={Colors.primary} />
                    </View>
                    <Text style={styleSheets.text}>{moment(dataItem.WorkDate).format('DD/MM/YY')}</Text>

                    <View style={[RenderItemAction.iconDateContent, CustomStyleSheet.marginLeft(15)]}>
                        <IconTime size={Size.text + 1} color={Colors.primary} />
                    </View>
                    {/* WorkDateTime, RegisterTimeOut: tasK 0164863 */}
                    {dataItem.RegisterTimeOut && dataItem.WorkDateTime && (
                        <Text style={[styleSheets.text]} numberOfLines={1}>
                            {`${dataItem.WorkDateTime} - ${dataItem.RegisterTimeOut}`}
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

                    <View style={RenderItemAction.rightContent} key={index}>
                        <View style={RenderItemAction.viewInfo}>
                            <View style={RenderItemAction.Line}>
                                <Text style={[styleSheets.lable]}>{dataItem['ProfileName']}</Text>
                            </View>

                            {ViewDateTodateFrom}
                            <View style={RenderItemAction.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                    i18nKey={'HRM_Attendance_AnnualLeaveDetail_LeaveType'}
                                />
                                <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text numberOfLines={1} style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                        {valueTypeOT}
                                    </Text>
                                </View>
                            </View>
                            <View style={RenderItemAction.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                    i18nKey={'HRM_System_Resource_Tra_Reason'}
                                />
                                <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text numberOfLines={1} style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                        {dataItem['ReasonOT']}
                                    </Text>
                                </View>
                            </View>
                            <View style={RenderItemAction.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                    i18nKey={'HRM_Attendance_udHour_WeekMonthYear'}
                                />
                                <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text numberOfLines={1} style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                        {`${dataItem.udHourByWeek}/${dataItem.udHourByMonth}/${dataItem.udHourByYear}`}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={RenderItemAction.viewOvertime}>
                            <View style={RenderItemAction.viewNumbertime}>
                                <View style={RenderItemAction.numberTime}>
                                    <Text style={[styleSheets.lable, { color: Colors.white }]}>
                                        {dataItem['RegisterHours']}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={RenderItemAction.viewStatus}
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
    LineSatus: {
        //paddingVertical  :2,
        paddingHorizontal: 3,
        borderRadius: styleSheets.radius_5,
        alignItems: 'center'
    },
    txtstyleStatus: {
        color: Colors.white,
        fontWeight: '600'
    }
});
