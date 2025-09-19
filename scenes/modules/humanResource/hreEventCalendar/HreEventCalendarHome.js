/* eslint-disable react/jsx-key */
/* eslint-disable react-native/no-raw-text */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { styleSheets, Colors, Size } from '../../../../constants/styleConfig';
import DrawerServices from '../../../../utils/DrawerServices';
import moment from 'moment';
import { translate } from '../../../../i18n/translate';
import { EnumName, EnumStatus, ScreenName } from '../../../../assets/constant';
import Vnr_Function from '../../../../utils/Vnr_Function';
import VnrLoadingScreen from '../../../../components/VnrLoading/VnrLoadingScreen';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import HttpService from '../../../../utils/HttpService';

class HreEventCalendarHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: true
        };
    }

    componentDidMount() {
        this.getData();
    }

    shouldComponentUpdate(nextState) {
        return !Vnr_Function.compare(nextState.data, this.state.data);
    }

    getData = () => {
        try {
            if (dataVnrStorage.isNewLayoutV3) {
                HttpService.Post('[URI_CENTER]/api/Att_GetData/GetDataCalendarDashboard', {
                    IsApp: true,
                    Month: null
                })
                    .then(res => {
                        if (res?.Status === EnumName.E_SUCCESS) {
                            this.setState({
                                data: res.Data,
                                isLoading: false
                            });
                        }
                    })
                    .catch(error => {
                        // eslint-disable-next-line no-console
                        console.log('error khi gọi http:', error);
                    });
            }
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', {
                ErrorDisplay: 'Thiêu Prop keyDataLocal'
            });
        }
    };

    router = (roouterName, params) => {
        DrawerServices.navigateForVersion(roouterName, params);
    };

    render() {
        let { data, isLoading } = this.state;

        // const showEventDate = data?.ListWorkdayByDate?.[0]

        let showEventDate = null;
        const eventDataFor7Days = data?.ListWorkdayByDate;

        // Kiểm tra xem có sự kiện trong 7 ngày hay không
        let hasEventIn7Days = false;

        // Kiểm tra ngày đầu tiên
        if (
            eventDataFor7Days?.[0]?.ListDataEvents.length > 0 ||
            eventDataFor7Days?.[0]?.ListDataLeaveday.length > 0 ||
            eventDataFor7Days?.[0]?.ListDataProfileHire.length > 0 ||
            eventDataFor7Days?.[0]?.ListDataProfileQuit.length > 0 ||
            eventDataFor7Days?.[0]?.ListDataBirthDays.length > 0 ||
            eventDataFor7Days?.[0]?.ListDataSenior.length > 0 ||
            eventDataFor7Days?.[0]?.ListDataDayOff.length > 0
        ) {
            hasEventIn7Days = true;
            showEventDate = eventDataFor7Days?.[0];
        } else {
            // Kiểm tra trong 6 ngày còn lại
            for (let i = 1; i < eventDataFor7Days?.length; i++) {
                if (
                    eventDataFor7Days?.[i]?.ListDataEvents.length > 0 ||
                    eventDataFor7Days?.[i]?.ListDataLeaveday.length > 0 ||
                    eventDataFor7Days?.[i]?.ListDataProfileHire.length > 0 ||
                    eventDataFor7Days?.[i]?.ListDataProfileQuit.length > 0 ||
                    eventDataFor7Days?.[i]?.ListDataBirthDays.length > 0 ||
                    eventDataFor7Days?.[i]?.ListDataSenior.length > 0 ||
                    eventDataFor7Days?.[i]?.ListDataDayOff.length > 0
                ) {
                    hasEventIn7Days = true;
                    showEventDate = eventDataFor7Days?.[i];
                    break;
                }
            }
        }

        // Hiển thị thông báo không có sự kiện nếu không có sự kiện trong 7 ngày
        if (!hasEventIn7Days) {
            showEventDate = null;
        }

        let allEventData = {
            ListDataEvents: showEventDate?.ListDataEvents || [],
            ListDataLeaveday: showEventDate?.ListDataLeaveday || [],
            ListDataProfileHire: showEventDate?.ListDataProfileHire || [],
            ListDataProfileQuit: showEventDate?.ListDataProfileQuit || [],
            ListDataSenior: showEventDate?.ListDataSenior || [],
            // "ListDataDayOff": showEventDate?.ListDataDayOff || [],
            ListDataBirthDays: showEventDate?.ListDataBirthDays || []
        };

        let activeEvent = Object.keys(allEventData).filter((item) => allEventData[item].length > 0);

        if (isLoading) {
            let typeLoading = EnumStatus.E_WAITING;
            return (
                <View style={styles.styleViewContainer}>
                    <View style={styles.noDataContainer}>
                        <VnrLoadingScreen size="large" isVisible={isLoading} type={typeLoading} />
                    </View>
                </View>
            );
        } else if (Vnr_Function.CheckIsNullOrEmpty(showEventDate)) {
            return (
                <View style={styles.styleViewContainer}>
                    <View style={styles.noDataContainer}>
                        <Image
                            source={require('../../../../assets/images/hreWorkHistory/noDataEvent.png')}
                            style={[Size.iconSize, { width: 80, height: 80, marginBottom: Size.defineHalfSpace }]}
                            resizeMode={'contain'}
                        />
                        <Text style={[styleSheets.headerTitleStyle]}>
                            {translate('HRM_PortalApp_EventCalendar_NoInfoIn7Days')}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                DrawerServices.navigate('HreEventCalendar');
                            }}
                        >
                            <Text style={[styleSheets.text, { color: Colors.gray_8, fontSize: Size.text - 2 }]}>
                                {translate('HRM_PortalApp_EventCalendar_SeeMoreEvent')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else if (!Vnr_Function.CheckIsNullOrEmpty(showEventDate)) {
            return (
                <TouchableWithoutFeedback
                    onPress={() => {
                        // DrawerServices.navigate('HreEventCalendar')
                        this.router(ScreenName.HreEventCalendar, showEventDate);
                    }}
                >
                    <View style={styles.styleViewContainer}>
                        <View style={styles.eventContainer}>
                            <View style={styles.eventHeader}>
                                {showEventDate?.DateCalendar &&
                                    moment(showEventDate?.DateCalendar).format('YYYY-MM-DD') ===
                                        moment().format('YYYY-MM-DD') && (
                                        <Text style={[styleSheets.lable, { color: Colors.gray_10 }]}>
                                            {translate('HRM_PortalApp_Today')},{' '}
                                        </Text>
                                    )}
                                <Text style={[styleSheets.lable, { color: Colors.gray_10 }]}>
                                    {showEventDate?.DateCalendar
                                        ? moment(showEventDate?.DateCalendar).format('DD/MM/YYYY')
                                        : ''}
                                </Text>
                            </View>
                            {showEventDate?.ListDataDayOff && (
                                <View style={{ marginBottom: 12 }}>
                                    {showEventDate?.ListDataDayOff.map((item, index) => (
                                        <View style={styles.eventItemTitle} key={index}>
                                            <Image
                                                source={require('../../../../assets/images/hreWorkHistory/event.png')}
                                                style={[Size.iconSize, { marginRight: 6, width: 16, height: 16 }]}
                                                resizeMode={'contain'}
                                            />
                                            <Text style={[styleSheets.text, { color: Colors.purple }]}>
                                                {translate('E_HOLIDAY')} {moment(item.DateOff).format('DD/MM')}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                            <View style={styles.eventBody}>
                                {activeEvent.slice(0, 3).map((key, index) => {
                                    let icon = '';
                                    let eventName = '';
                                    if (key === 'ListDataEvents') {
                                        icon = require('../../../../assets/images/hreWorkHistory/event.png');
                                        eventName = translate('HRM_PortalApp_EventCalendar_Event');
                                    } else if (key === 'ListDataLeaveday') {
                                        icon = require('../../../../assets/images/hreWorkHistory/leaveDay.png');
                                        eventName = translate('HRM_PortalApp_EventCalendar_LeaveDay');
                                    } else if (key === 'ListDataProfileHire') {
                                        icon = require('../../../../assets/images/hreWorkHistory/newEmp.png');
                                        eventName = translate('HRM_PortalApp_EventCalendar_ProfileHire');
                                    } else if (key === 'ListDataBirthDays') {
                                        icon = require('../../../../assets/images/hreWorkHistory/birthDay.png');
                                        eventName = translate('HRM_PortalApp_EventCalendar_BirthDay');
                                    } else if (key === 'ListDataSenior') {
                                        icon = require('../../../../assets/images/hreWorkHistory/growthYear.png');
                                        eventName = translate('HRM_PortalApp_EventCalendar_Seniority');
                                    } else if (key === 'ListDataProfileQuit') {
                                        icon = require('../../../../assets/images/hreWorkHistory/outWork.png');
                                        eventName = translate('HRM_PortalApp_EventCalendar_Resignation');
                                    }

                                    return (
                                        <View style={styles.eventItem} key={index}>
                                            <View style={styles.eventItemTitle}>
                                                <Image
                                                    source={icon}
                                                    style={[Size.iconSize, { marginRight: 6, width: 16, height: 16 }]}
                                                    resizeMode={'contain'}
                                                />
                                                <Text style={[styleSheets.lable, { fontWeight: '600' }]}>
                                                    {eventName}
                                                </Text>
                                            </View>
                                            {key === 'ListDataEvents'
                                                ? showEventDate?.['ListDataEvents'].map((item) => (
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
                                                : showEventDate?.[key].slice(0, 3).map((item) => {
                                                    return (
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
                                                    );
                                                })}
                                        </View>
                                    );
                                })}
                            </View>
                            {activeEvent.length > 3 ? (
                                <View>
                                    <Text style={[styleSheets.text, { color: Colors.gray_8, fontSize: 14 }]}>
                                        {translate('HRM_PortalApp_EventCalendar_OtherEvents').replace(
                                            '[value1]',
                                            activeEvent.length - 3
                                        )}
                                    </Text>
                                </View>
                            ) : (
                                <View />
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        }
    }
}

const styles = StyleSheet.create({
    styleViewContainer: {
        backgroundColor: Colors.gray_3,
        paddingTop: Size.defineSpace
    },
    eventContainer: {
        paddingHorizontal: Size.defineSpace,
        paddingTop: Size.defineHalfSpace,
        paddingBottom: 12,
        backgroundColor: Colors.white
    },
    noDataContainer: {
        paddingVertical: Size.defineSpace,
        backgroundColor: Colors.white,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    eventHeader: {
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.gray_4,
        paddingBottom: Size.defineHalfSpace,
        marginBottom: Size.defineHalfSpace,
        flexDirection: 'row'
    },
    eventItem: {
        marginBottom: Size.defineSpace
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

export default HreEventCalendarHome;
