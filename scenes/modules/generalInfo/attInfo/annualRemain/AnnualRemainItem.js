import React from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { Size, styleSheets, Colors } from '../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import VnrText from '../../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';
export default class AnnualRemainItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.formatStringType = this.formatStringType.bind(this);
    }

    shouldComponentUpdate(nextProps) {
        if (
            nextProps.isPullToRefresh !== this.props.isPullToRefresh ||
            nextProps.isSelect !== this.props.isSelect ||
            nextProps.isOpenAction !== this.props.isOpenAction
        ) {
            return true;
        } else {
            return false;
        }
    }

    formatStringType = (data, col) => {
        if (data[col.Name]) {
            if (col.DataType && col.DataType.toLowerCase() == 'datetime') {
                return moment(data[col.Name]).format(col.DataFormat);
            }
            if (col.DataType && col.DataType.toLowerCase() == 'double') {
                return format(col.DataFormat, data[col.Name]);
            } else {
                return data[col.Name];
            }
        } else {
            return '';
        }
    };

    render() {
        const { dataItem, index } = this.props;
        // console.log(dataItem, 'dataItem')
        return (
            <View style={Platform.OS == 'ios' ? styles.viewButtonIOS : styles.swipeable} key={index}>
                <View style={styles.viewButton}>
                    <View style={styles.leftBody} key={index}>
                        <View style={styles.iconAvatarView}>
                            <Image
                                source={require('../../../../../assets/images/bg_calendar.png')}
                                style={styles.avatarUser}
                            />
                            <View style={styles.viewMonth}>
                                <VnrText i18nKey={'E_MONTH'} style={styles.txtMonthLable} />
                                <Text style={styles.txtMonthValue}>{moment(dataItem.MonthYear).format('MM')}</Text>
                            </View>
                        </View>
                        {/* <View style={{}}>
              <Text style={styleSheets.lable}>
                {
                  moment(dataItem.MonthYear).format('YYYY')
                }
              </Text>
            </View> */}
                    </View>
                    <View style={styles.rightBody}>
                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.lable, styles.txtLable]}
                                    i18nKey={'HRM_Attendance_AvailableTotal_Sort'}
                                />
                            </View>

                            <View style={styles.valueView}>
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {dataItem.AvailableTotal != null
                                        ? Vnr_Function.mathRoundNumber(dataItem.AvailableTotal)
                                        : ''}
                                </Text>
                                <Text numberOfLines={1} style={[styleSheets.text, styles.txtDay]}>
                                    {dataItem.AvailableTotal != null ? `(${translate('E_DAY_LOWERCASE')})` : ''}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.Line}>
                            <View style={styles.IconView}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.lable, styles.txtLable]}
                                    i18nKey={'HRM_Attendance_AnnualRemain_Sort'}
                                />
                            </View>
                            <View style={styles.valueView}>
                                <Text numberOfLines={1} style={[styleSheets.text]}>
                                    {dataItem.Remain != null ? Vnr_Function.mathRoundNumber(dataItem.Remain) : ''}
                                </Text>
                                <Text numberOfLines={1} style={[styleSheets.text, styles.txtDay]}>
                                    {dataItem.Remain != null ? `(${translate('E_DAY_LOWERCASE')})` : ''}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const frontSizeValueMonth = Size.text + 3;
const styles = StyleSheet.create({
    swipeable: {
        flex: 1,
        borderRadius: 10,
        flexDirection: 'row',
        marginBottom: 10,
        marginHorizontal: 10,
        backgroundColor: Colors.white,
        borderWidth: 2,
        borderColor: Colors.borderColor,
        paddingVertical: 10
    },
    viewButton: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    viewButtonIOS: {
        flex: 1,
        borderRadius: 10,
        marginBottom: 13,
        marginHorizontal: 10,
        shadowColor: Colors.black,
        // backgroundColor: '#f3f2f2',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.2,
        shadowRadius: 5.46,
        elevation: 8
    },
    leftBody: {
        flex: 2.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightColor: Colors.borderColor,
        borderRightWidth: 0.5
    },
    rightBody: {
        flex: 7.5,
        paddingHorizontal: 10
    },
    iconAvatarView: {
        flex: 1,
        marginBottom: 5,
        position: 'relative'
    },
    avatarUser: {
        maxWidth: 150,
        maxHeight: 150,
        width: Size.deviceWidth * 0.2,
        height: Size.deviceWidth * 0.2,
        resizeMode: 'contain'
    },
    viewMonth: {
        position: 'absolute',
        maxWidth: 150,
        maxHeight: 150,
        width: Size.deviceWidth * 0.2,
        height: Size.deviceWidth * 0.2,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom:
            Size.deviceWidth * 0.2 > 150
                ? 70 - frontSizeValueMonth * 2
                : (Size.deviceWidth * 0.2) / 2 - frontSizeValueMonth * 2
    },
    txtMonthLable: {
        fontSize: Size.text - 5,
        color: Colors.greySecondary
    },
    txtMonthValue: {
        fontSize: frontSizeValueMonth,
        fontWeight: '500'
    },
    Line: {
        flex: 1,
        flexDirection: 'row',
        maxWidth: '100%',
        justifyContent: 'center'
    },
    valueView: {
        flex: 5.5,
        marginLeft: 10,
        alignItems: 'center',
        flexDirection: 'row'
    },
    IconView: {
        flex: 4.5,
        height: '100%',
        justifyContent: 'center'
    },
    txtDay: {
        marginLeft: 3,
        color: Colors.greySecondary
    }
});
