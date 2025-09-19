import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Size, styleSheets, Colors } from '../../../../../constants/styleConfig';
import moment from 'moment';
import VnrText from '../../../../../components/VnrText/VnrText';
import { getDayOfWeek } from '../../../../../i18n/langCalendars';
import { IconLogin, IconLogout } from '../../../../../constants/Icons';
import { EnumName } from '../../../../../assets/constant';
import ViewMap from '../../../../../components/ViewMap/ViewMap';
export default class InOutItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderItem = (data) => {
        let viewIconInOut = null,
            viewTextInOut = null,
            viewinfo = <View />,
            // Lỗi IOS Chỉnh lại giờ cửa ĐT nên dùng cách này lấy giờ format từ server.
            timeLogVal = data.TimeLogTimeView ? data.TimeLogTimeView.split(':') : null;
        // xử lý icon In/Out
        if (data.Type && data.Type === EnumName.E_IN) {
            viewIconInOut = <IconLogin size={Size.iconSize - 5} color={Colors.gray_8} />;
            viewTextInOut = (
                <VnrText
                    i18nKey={'E_IN'}
                    style={[styleSheets.text, styles.line_intout__time, { color: Colors.primary }]}
                />
            );
        } else if (data.Type && data.Type === EnumName.E_OUT) {
            viewIconInOut = <IconLogout size={Size.iconSize - 5} color={Colors.gray_8} />;
            viewTextInOut = (
                <VnrText
                    i18nKey={'E_OUT'}
                    style={[styleSheets.text, styles.line_intout__time, { color: Colors.orange }]}
                />
            );
        }

        if (data.ShopNamebyGPSCheckInOut) {
            viewinfo = (
                <View style={styles.lineItemCenterValue}>
                    <Text style={[styleSheets.text, styles.valueText]} numberOfLines={1}>
                        {data.ShopNamebyGPSCheckInOut}
                    </Text>
                </View>
            );
        } else if (
            data.Coodinate !== null &&
            data.Coodinate !== '' &&
            data.Coodinate !== 'NULL' &&
            typeof data.Coodinate == 'string' &&
            data.Coodinate.split('|').length > 1
        ) {
            let coodinate = data.Coodinate.split('|');
            viewinfo = (
                <View style={styles.lineItemCenterValue}>
                    <ViewMap
                        x={Number.parseFloat(coodinate[0])}
                        y={Number.parseFloat(coodinate[1])}
                        address={data.LocationAddress}
                        styleTextButton={{ fontSize: Size.text - 1 }}
                    />
                </View>
            );
        } else if (data.WifiCode !== null) {
            viewinfo = (
                <View style={styles.lineItemCenterValue}>
                    <Text style={[styleSheets.text, styles.valueText]} numberOfLines={1}>
                        {data.WifiCode}
                    </Text>
                </View>
            );
        } else if (data.MachineCodeView != null && data.MachineCodeView !== 'NULL') {
            viewinfo = (
                <View style={styles.lineItemCenterValue}>
                    <Text style={[styleSheets.text, styles.valueText]} numberOfLines={1}>
                        {data.MachineCodeView}
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.lineItem}>
                {viewIconInOut != null && viewTextInOut != null && (
                    <View style={styles.lineItemLeft}>
                        {viewIconInOut}
                        {viewTextInOut}
                    </View>
                )}

                <View style={styles.lineItemCenter}>
                    {viewinfo}
                    <View style={styles.lineItemCenterLable}>
                        <Text style={[styleSheets.text, styles.lableText]}>
                            {data.TamScanLogType != null && data.TamScanLogType !== 'NULL' ? data.TamScanLogType : ''}
                        </Text>
                    </View>
                </View>

                <View style={styles.lineItemRight}>
                    <Text style={[styleSheets.text, styles.lineItemRight_textTime]}>
                        {timeLogVal ? `${timeLogVal[0]}:${timeLogVal[1]}` : ''}
                    </Text>
                    <VnrText i18nKey={'HRM_Sys_TimeRange'} style={[styleSheets.text, styles.lableText]} />
                </View>
            </View>
        );
    };

    render() {
        const { dataItem, index } = this.props;

        let dayOffWeek = '',
            isToday = false,
            day = '';

        if (dataItem.data && dataItem.data[0]) {
            day = moment(dataItem.dateTime).format('DD');
            dayOffWeek = getDayOfWeek(dataItem.dateTime);
        }

        if (moment(dataItem.dateTime).format('DD/MM/YYYY') === moment().format('DD/MM/YYYY')) {
            isToday = true;
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
                    {dataItem.data != null && dataItem.data.map((item) => this.renderItem(item))}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    swipeable: {
        // flex: 1,
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
        marginRight: Size.defineSpace
    },
    rightBody: {
        flexGrow: 1,
        paddingHorizontal: Size.defineSpace,
        backgroundColor: Colors.white,
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        borderRadius: 8,
        // justifyContent: 'center',
        // paddingBottom: 0,
        height: 'auto',
        alignSelf: 'center',
        paddingBottom: 14
    },
    lineItem: {
        flexDirection: 'row',
        marginTop: 14
    },
    lineItemLeft: {
        paddingRight: Size.defineSpace,
        justifyContent: 'flex-end'
        // justifyContent: 'space-between'
    },
    lineItemCenter: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    lineItemCenterValue: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: Size.defineSpace,
        marginBottom: 3
    },
    lineItemRight: {
        paddingLeft: Size.defineSpace,
        borderLeftColor: Colors.gray_5,
        borderLeftWidth: 0.5,
        justifyContent: 'flex-end'
    },
    lineItemRight_textTime: {
        fontSize: Size.text,
        fontWeight: '500'
    },
    lableText: {
        color: Colors.gray_7,
        fontSize: Size.text - 3
    },

    valueText: {
        fontSize: Size.text - 1
    },
    line_intout__time: {
        fontSize: Size.text - 3,
        fontWeight: '600',
        marginTop: 2
    }
});
