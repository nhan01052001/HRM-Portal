import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors, Size, styleSheets } from '../../../../../constants/styleConfig';
import moment from 'moment';
import VnrText from '../../../../../components/VnrText/VnrText';
import { IconNext } from '../../../../../constants/Icons';
import DrawerServices from '../../../../../utils/DrawerServices';
import { ScreenName } from '../../../../../assets/constant';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { typePaidLeave } from './AttPaidLeave';

export default class AttendanceDetailItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { dataItem, typeNumberLeave, screenDetail } = this.props,
            { icon, secondaryColor, primaryColor, keyTras, key } = dataItem.configType;

        let dateStart = dataItem.DateStart ? dataItem.DateStart : null,
            dateEnd = dataItem.DateEnd ? dataItem.DateEnd : null,
            timeCouse = '',
            txtLeaveDayHours = '',
            viewBtnToDetail = <View />,
            onPressToDetail = null;

        if (key == 'E_PREGNANT_LEAVE' && dataItem.MonthYear) {
            timeCouse = moment(dataItem.MonthYear).format('MM/YYYY');
            txtLeaveDayHours = `${dataItem.LeaveInMonth} ${typeNumberLeave}`;

            onPressToDetail = () => {
                DrawerServices.navigate(screenDetail, {
                    screenName: ScreenName.AttPaidLeavePregnant,
                    dataItem: dataItem
                });
            };

            viewBtnToDetail = (
                <View style={[styles.actionRight, { backgroundColor: secondaryColor }]}>
                    <IconNext color={primaryColor} size={Size.text} />
                </View>
            );
        } else {
            // xử lý dateStart và dateEnd
            if (dateStart && dateEnd) {
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
                    timeCouse = dmyStart;
                } else if (myStart === myEnd) {
                    timeCouse = `${dStart} - ${dEnd}/${myStart}`;
                } else if (yStart === yEnd) {
                    timeCouse = `${dmStart} - ${dmyEnd}`;
                } else {
                    timeCouse = `${dmyStart} - ${dmyEnd}`;
                }
            } else {
                if (dateStart) {
                    timeCouse = moment(dateStart).format('DD/MM/YYYY');
                }
                if (dateEnd) {
                    if (timeCouse !== '') {
                        timeCouse = `${timeCouse} - ${moment(dataItem.dateEnd).format('DD/MM/YYYY')}`;
                    } else {
                        timeCouse = moment(dataItem.dateEnd).format('DD/MM/YYYY');
                    }
                }
            }

            if (dataItem.LeaveDays && key !== 'E_COMPENSATORY_LEAVE') {
                txtLeaveDayHours = `${Vnr_Function.mathRoundNumber(dataItem.LeaveDays)} ${typeNumberLeave}`;
            } else if (dataItem.LeaveHours && key === 'E_COMPENSATORY_LEAVE') {
                txtLeaveDayHours = `${Vnr_Function.mathRoundNumber(dataItem.LeaveHours)} ${typeNumberLeave}`;
            }
        }

        return (
            <TouchableOpacity
                onPress={() => (onPressToDetail != null ? onPressToDetail() : null)}
                activeOpacity={onPressToDetail != null ? 0.5 : 1}
                style={styles.styContent}
            >
                <View style={styles.styItem}>
                    <View style={styles.styIcon(secondaryColor)}>
                        <Image source={icon} style={styles.styItemIcon} />
                    </View>
                    <View style={styles.styViewInfo}>
                        <View style={styles.styViewInfoPri}>
                            <Text style={[styleSheets.text, styles.styInfoTitle]}>{timeCouse}</Text>
                            {key == typePaidLeave.E_ANNUAL_LEAVE.key && dataItem.ExceptInAnlBeginning ? (
                                <VnrText
                                    style={[styleSheets.text, styles.styInfoSubTitle(Colors.orange)]}
                                    i18nKey={'HRM_PortalApp_Total_RemainAnlBegining'}
                                />
                            ) : (
                                <VnrText
                                    style={[styleSheets.text, styles.styInfoSubTitle(primaryColor)]}
                                    i18nKey={keyTras}
                                />
                            )}
                        </View>
                        <View style={styles.styViewLeave}>
                            <Text style={[styleSheets.text, styles.styLeaveDayHours]}>{txtLeaveDayHours}</Text>

                            {viewBtnToDetail}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const WIDTH_ITEM = Size.deviceWidth - Size.defineSpace * 2;
const styles = StyleSheet.create({
    styContent: {
        backgroundColor: Colors.white,
        paddingHorizontal: Size.defineSpace
    },
    styItem: {
        flexDirection: 'row',
        paddingVertical: 15,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        marginBottom: 0.5
    },
    styIcon: bgIcon => {
        return {
            backgroundColor: bgIcon,
            paddingHorizontal: 4,
            paddingVertical: 4,
            borderRadius: 7
        };
    },
    styItemIcon: {
        width: WIDTH_ITEM * 0.1,
        height: WIDTH_ITEM * 0.1
    },
    styViewInfoPri: {
        flex: 1
    },
    styViewInfo: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        marginLeft: Size.defineSpace
    },
    styInfoTitle: {},
    styInfoSubTitle: txtColor => {
        return {
            fontSize: Size.text - 5,
            color: txtColor
        };
    },
    styLeaveDayHours: {
        fontWeight: '500'
    },
    styViewLeave: {
        flexDirection: 'row'
    },
    actionRight: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 2,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: Size.defineHalfSpace
    }
});
