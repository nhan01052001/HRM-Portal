import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Size, styleSheets, Colors } from '../../../../constants/styleConfig';
import moment from 'moment';
import VnrText from '../../../../components/VnrText/VnrText';
import { getDayOfWeek } from '../../../../i18n/langCalendars';
export default class AttDataWorkdaysEmpsItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { dataItem, index } = this.props;

        let listTotalOT = [],
            listTotalLD = [],
            listTotalRT = [],
            dayOffWeek = '',
            isToday = false,
            day = '';
        if (dataItem.data && dataItem.data[0]) {
            day = moment(dataItem.dateTime).format('DD');
            dayOffWeek = getDayOfWeek(dataItem.dateTime);
        }

        if (moment(dataItem.dateTime).format('DD/MM/YYYY') === moment().format('DD/MM/YYYY')) {
            isToday = true;
        }

        if (dataItem && dataItem.data && Array.isArray(dataItem.data)) {
            dataItem.data.forEach(item => {
                if (item.CalendarType == 'E_OVERTIME') {
                    listTotalOT.push(item);
                }
                if (item.CalendarType == 'E_LEAVE_DAY') {
                    listTotalLD.push(item);
                }
                if (item.CalendarType == 'E_ROSTER') {
                    listTotalRT.push(item);
                }
            });
        }

        return (
            <View style={styles.swipeable} key={index}>
                <View style={styles.leftBody}>
                    <Text style={[styleSheets.text, styles.viewTime_week, isToday && { color: Colors.primary }]}>
                        {dayOffWeek}
                    </Text>
                    <Text style={[styleSheets.text, styles.viewTime_day, isToday && { color: Colors.primary }]}>
                        {day}
                    </Text>
                </View>
                <View style={styles.rightBody}>
                    {listTotalOT.length > 0 && (
                        <View style={styles.line}>
                            <View style={styles.lineLeft}>
                                <View style={[styles.stylesDot, styles.dotOT]} />
                                <VnrText
                                    style={[styleSheets.text, styles.lineLeft_title]}
                                    i18nKey={'HRM_Att_Overtime'}
                                />
                            </View>
                            <View style={styles.lineRight}>
                                <Text style={[styleSheets.text, styles.lineRight_value]}>{listTotalOT.length}</Text>
                            </View>
                        </View>
                    )}

                    {listTotalLD.length > 0 && (
                        <View style={styles.line}>
                            <View style={styles.lineLeft}>
                                <View style={[styles.stylesDot, styles.dotLD]} />
                                <VnrText
                                    style={[styleSheets.text, styles.lineLeft_title]}
                                    i18nKey={'HRM_Att_LeaveDay'}
                                />
                            </View>
                            <View style={styles.lineRight}>
                                <Text style={[styleSheets.text, styles.lineRight_value]}>{listTotalLD.length}</Text>
                            </View>
                        </View>
                    )}

                    {listTotalRT.length > 0 && (
                        <View style={styles.line}>
                            <View style={styles.lineLeft}>
                                <View style={[styles.stylesDot, styles.dotRT]} />
                                <VnrText
                                    style={[styleSheets.text, styles.lineLeft_title]}
                                    i18nKey={'HRM_Attendance_ShiftName'}
                                />
                            </View>
                            <View style={styles.lineRight}>
                                <Text style={[styleSheets.text, styles.lineRight_value]}>{listTotalRT.length}</Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    swipeable: {
        flex: 1,
        flexDirection: 'row',
        marginTop: Size.defineSpace,
        marginHorizontal: Size.defineSpace
    },
    viewTime_week: {
        fontSize: Size.text + 1,
        color: Colors.gray_7
    },
    viewTime_day: {
        fontSize: Size.text + 11,
        fontWeight: '600',
        color: Colors.gray_10
    },

    leftBody: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight: 23
    },
    rightBody: {
        flex: 1,
        paddingHorizontal: Size.defineSpace,
        backgroundColor: Colors.white,
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        borderRadius: 8
    },
    line: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: Size.defineSpace / 2
    },
    lineLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    lineLeft_title: {
        marginLeft: 7,
        color: Colors.gray_10,
        fontWeight: '400'
    },
    lineRight_value: {
        fontSize: Size.text + 2,
        fontWeight: '500'
    },
    stylesDot: {
        width: Size.text - 5,
        height: Size.text - 5,
        borderRadius: (Size.text - 5) / 2
    },
    dotOT: {
        backgroundColor: Colors.red
    },
    dotLD: {
        backgroundColor: Colors.purple
    },
    dotRT: {
        backgroundColor: Colors.green
    }
});
