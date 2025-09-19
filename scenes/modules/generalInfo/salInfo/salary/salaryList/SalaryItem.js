import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { styleSheets, Size, Colors } from '../../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import Color from 'color';
export default class SalaryItem extends React.Component {
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

    convertTextToColor = value => {
        const [num1, num2, num3, opacity] = value.split(',');
        return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
    };

    render() {
        const { dataItem, index } = this.props;
        const themeColor = {
            '01': Colors.primary,
            '02': Colors.red,
            '03': Colors.green,
            '04': Colors.navy,
            '05': Colors.orange,
            '06': Colors.success,
            '07': Colors.primary,
            '08': Colors.red,
            '09': Colors.green,
            '10': Colors.navy,
            '11': Colors.orange,
            '12': Colors.success
        };
        let numberMonth = moment(dataItem.MonthYear).format('MM'),
            monthYear = moment(dataItem.MonthYear).format('MM/YYYY');
        // xử lý colo

        return (
            <View style={styles.swipeable} key={index}>
                <View style={styles.styViewItem}>
                    <View style={styles.styViewStatusColor(themeColor[numberMonth])} />
                    <View style={styles.styContentItem}>
                        <View style={styles.styLine}>
                            <View style={styles.styLineLeft}>
                                <Text numberOfLines={1} style={[styleSheets.lable, styles.txtLable_1]}>
                                    {`${monthYear}`}
                                </Text>
                            </View>
                        </View>

                        {dataItem.DateStart != null && dataItem.DateEnd != null && (
                            <View style={styles.styLine}>
                                <View style={styles.styLineLeft}>
                                    <Text numberOfLines={1} style={[styleSheets.text, styles.txtLable_2]}>
                                        {`${moment(dataItem.DateStart).format('DD/MM/YYYY')} - ${moment(
                                            dataItem.DateEnd
                                        ).format('DD/MM/YYYY')}`}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    swipeable: {
        flex: 1,
        borderRadius: 10,
        marginBottom: Size.defineSpace / 2,
        marginHorizontal: Size.defineSpace
    },
    styViewItem: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },

    txtLable_1: {
        fontSize: Size.text + 1,
        fontWeight: '500',
        marginBottom: 4
        // marginRight: 3,
    },
    txtLable_2: {
        fontSize: Size.text,
        fontWeight: '400',
        color: Colors.gray_7
    },
    styViewStatusColor: bgColor => {
        return {
            width: 4.5,
            height: '100%',
            backgroundColor: bgColor,
            marginLeft: Size.defineSpace / 2,
            borderRadius: 7
        };
    },
    styContentItem: {
        flex: 7,
        paddingHorizontal: 10
    },
    styLine: {
        flexDirection: 'row',
        marginBottom: 2
    },
    styLineLeft: {
        flex: 1
    }
});
