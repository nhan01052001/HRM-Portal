/* eslint-disable react/jsx-key */
import React, { Component } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { styleSheets, Colors, Size } from '../../../../../constants/styleConfig';
import moment from 'moment';
import { translate } from '../../../../../i18n/translate';
import Vnr_Function from '../../../../../utils/Vnr_Function';

class HreEventCalendarListItem extends Component {
    constructor(props) {
        super(props);
    }

    handleLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        this.props.onLayout(this.props.index, height);
    };

    shouldComponentUpdate(nextProps) {
        // return !Vnr_Function.compare(nextProps.data, this.props.data);
        return nextProps.filter !== this.props.filter;
    }

    render() {
        const { data, filter } = this.props;

        let listDataObject = {
            ListDataDayOff: data?.ListDataDayOff || [],
            ListDataEvents: data?.ListDataEvents || [],
            ListDataLeaveday: data?.ListDataLeaveday || [],
            ListDataProfileHire: data?.ListDataProfileHire || [],
            ListDataProfileQuit: data?.ListDataProfileQuit || [],
            ListDataSenior: data?.ListDataSenior || [],
            // "ListDataDayOff": data?.ListDataDayOff || [],
            ListDataBirthDays: data?.ListDataBirthDays || []
        };

        const filteredData = Object.keys(listDataObject).filter((item) => {
            return filter.includes(item);
        });

        let activeEvent = filteredData.filter((item) => listDataObject[item].length > 0);

        if (activeEvent.length > 0) {
            return (
                <View onLayout={this.handleLayout} style={styles.container}>
                    <View style={styles.timeline}>
                        <View style={styles.circle} />
                        <View style={styles.stickViewVertical} />
                    </View>

                    <View style={styles.itemContent}>
                        <View style={styles.itemHeader}>
                            {moment(data.DateCalendar).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') && (
                                <Text style={[styleSheets.textFontMedium, { color: Colors.gray_10 }]}>
                                    {translate('HRM_PortalApp_Today')},
                                </Text>
                            )}
                            <Text style={[styleSheets.text]}>{moment(data.DateCalendar).format('DD/MM/YYYY')}</Text>
                            <View style={styles.stickViewHonrizontal} />
                        </View>
                        <View style={styles.itemBody}>
                            {filteredData.map((key) => {
                                let icon = '';
                                let eventName = '';
                                if (key === 'ListDataEvents') {
                                    icon = require('../../../../../assets/images/hreWorkHistory/event.png');
                                    eventName = translate('HRM_PortalApp_EventCalendar_Event');
                                } else if (key === 'ListDataLeaveday') {
                                    icon = require('../../../../../assets/images/hreWorkHistory/leaveDay.png');
                                    eventName = translate('HRM_PortalApp_EventCalendar_LeaveDay');
                                } else if (key === 'ListDataProfileHire') {
                                    icon = require('../../../../../assets/images/hreWorkHistory/newEmp.png');
                                    eventName = translate('HRM_PortalApp_EventCalendar_ProfileHire');
                                } else if (key === 'ListDataBirthDays') {
                                    icon = require('../../../../../assets/images/hreWorkHistory/birthDay.png');
                                    eventName = translate('HRM_PortalApp_EventCalendar_BirthDay');
                                } else if (key === 'ListDataSenior') {
                                    icon = require('../../../../../assets/images/hreWorkHistory/growthYear.png');
                                    eventName = translate('HRM_PortalApp_EventCalendar_Seniority');
                                } else if (key === 'ListDataProfileQuit') {
                                    icon = require('../../../../../assets/images/hreWorkHistory/outWork.png');
                                    eventName = translate('HRM_PortalApp_EventCalendar_Resignation');
                                } else if (key === 'ListDataDayOff') {
                                    icon = require('../../../../../assets/images/hreWorkHistory/holiday.png');
                                    eventName = translate('HRM_PortalApp_EventCalendar_Holiday');
                                }

                                if (listDataObject[key].length > 0) {
                                    return (
                                        <View style={styles.eventItem}>
                                            {key !== 'ListDataDayOff' ? (
                                                <View style={styles.eventItemTitle}>
                                                    <Image
                                                        source={icon}
                                                        style={[Size.iconSize, styles.styViewImage]}
                                                        resizeMode={'contain'}
                                                    />
                                                    <Text style={[styleSheets.lable, styles.styViewEventName]}>
                                                        {eventName}
                                                    </Text>
                                                </View>
                                            ) : null}

                                            {key === 'ListDataEvents'
                                                ? data['ListDataEvents'].map((item) => (
                                                    <View style={styles.eventItemValue}>
                                                        <View
                                                            style={[
                                                                styles.eventDotCommon,
                                                                { backgroundColor: Colors.pink }
                                                            ]}
                                                        />
                                                        <Text style={[styleSheets.text, { color: Colors.gray_10 }]}>
                                                            {item.NewsTitle}
                                                        </Text>
                                                    </View>
                                                ))
                                                : key === 'ListDataDayOff'
                                                    ? data['ListDataDayOff'].map((item) => (
                                                        <View style={styles.eventItemTitle}>
                                                            <Image
                                                                source={icon}
                                                                style={[Size.iconSize, styles.styViewImage]}
                                                                resizeMode={'contain'}
                                                            />
                                                            <Text style={[styleSheets.text, { color: Colors.purple }]}>
                                                                {translate('E_HOLIDAY')}{' '}
                                                                {moment(item.DateOff).format('DD/MM')}
                                                            </Text>
                                                        </View>
                                                    ))
                                                    : data[key].map((item) => (
                                                        <View style={styles.eventItemValue}>
                                                            {Vnr_Function.renderAvatarCricleByName(
                                                                item?.ImagePath,
                                                                item?.ProfileName,
                                                                24
                                                            )}
                                                            {/* <Image source={{
                                                                        uri: item?.ImagePath
                                                                    }} style={styles.imageAvt} resizeMode={'cover'}></Image> */}
                                                            <Text
                                                                numberOfLines={1}
                                                                style={[styleSheets.lable, styles.textProfileName]}
                                                            >
                                                                {item.ProfileName}
                                                            </Text>
                                                            <Text
                                                                numberOfLines={1}
                                                                style={[styleSheets.text, styles.textExtendInfo]}
                                                            >
                                                                {' '}
                                                                {translate(item.ExtendInfo)}
                                                            </Text>
                                                        </View>
                                                    ))}
                                        </View>
                                    );
                                }
                            })}
                        </View>
                    </View>
                </View>
            );
        } else return null;
    }
}

const styles = StyleSheet.create({
    styViewEventName: { fontWeight: '600', color: Colors.gray_10 },
    styViewImage: { marginRight: 6, width: 16, height: 16 },
    circle: {
        backgroundColor: Colors.white,
        width: 16,
        height: 16,
        borderWidth: 1.5,
        borderRadius: 16,
        borderColor: Colors.gray_6,
        marginTop: 5
    },
    stickViewHonrizontal: {
        borderBottomWidth: 0.5,
        flex: 1,
        marginLeft: Size.defineHalfSpace,
        borderBottomColor: Colors.gray_5
    },
    stickViewVertical: {
        flex: 1,
        marginTop: 2,
        borderLeftWidth: 2,
        marginBottom: 2,
        borderLeftColor: Colors.gray_6
    },
    container: {
        flexDirection: 'row'
    },
    timeline: {
        marginRight: 10,
        flexDirection: 'column',
        alignItems: 'center'
    },
    itemContent: {
        flexDirection: 'column',
        flex: 1
    },
    itemHeader: {
        marginBottom: 6,
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemBody: {
        padding: Size.defineHalfSpace,
        backgroundColor: Colors.white,
        marginTop: 6,
        marginBottom: Size.defineSpace
    },
    eventItem: {
        marginBottom: 12
    },
    eventItemTitle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    eventItemValue: {
        marginTop: Size.defineHalfSpace,
        flexDirection: 'row',
        alignItems: 'center'
    },
    eventDotCommon: {
        width: 4,
        height: 4,
        borderRadius: 4,
        marginRight: 4
    },
    textProfileName: {
        fontWeight: '500',
        color: Colors.gray_10,
        flex: 1,
        marginLeft: 6
    },
    textExtendInfo: {
        color: Colors.gray_10,
        width: 100,
        textAlign: 'right'
    }
});

export default HreEventCalendarListItem;
