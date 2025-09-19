import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { styleSheets, Colors, Size, CustomStyleSheet } from '../../../../constants/styleConfig';
import Color from 'color';
import { IconScore, IconDate } from '../../../../constants/Icons';
import moment from 'moment';
export default class EvaPerformanceResultItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
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

    convertTextToColor = (value) => {
        const [num1, num2, num3, opacity] = value.split(',');
        return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
    };

    render() {
        const { dataItem, index } = this.props;

        let TimeCouse = '',
            colorStatusView = null;

        // xử lý color
        if (dataItem.itemStatus) {
            const { colorStatus } = dataItem.itemStatus;
            colorStatusView = colorStatus ? colorStatus : null;
        }

        if (dataItem.DateEffect) {
            TimeCouse = moment(dataItem.DateEffect).format('DD/MM/YYYY');
        }

        return (
            <View style={styles.swipeable} key={index}>
                <View style={styles.styViewItem}>
                    <View
                        style={styles.styViewStatusColor(
                            colorStatusView ? this.convertTextToColor(colorStatusView) : Colors.primary
                        )}
                    />
                    <View style={styles.styContentItem}>
                        <View style={styles.styLine}>
                            <View style={styles.styLineLeft}>
                                <Text numberOfLines={1} style={[styleSheets.lable, styles.txtLable_1]}>
                                    {dataItem.PerformancePlanName}
                                </Text>
                            </View>
                            <View style={styles.styLineValue}>
                                <Text
                                    numberOfLines={1}
                                    style={[
                                        styleSheets.text,
                                        {
                                            color: colorStatusView
                                                ? this.convertTextToColor(colorStatusView)
                                                : Colors.gray_8
                                        }
                                    ]}
                                >
                                    {/* {dataItem.LevelName} */}
                                    {dataItem.StatusView != null ? dataItem.StatusView : ''}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.styLine}>
                            <View style={styles.styLineRow}>
                                <IconScore size={Size.text} color={Colors.gray_7} />
                                <Text numberOfLines={1} style={[styleSheets.text, styles.txtLable_2]}>
                                    {dataItem.TotalMark}
                                </Text>
                            </View>
                            {TimeCouse != '' && (
                                <View style={CustomStyleSheet.flexDirection('row')}>
                                    <IconDate size={Size.text} color={Colors.gray_7} />
                                    <Text numberOfLines={1} style={[styleSheets.text, styles.txtLable_2]}>
                                        {TimeCouse}
                                    </Text>
                                </View>
                            )}
                        </View>
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
        fontWeight: '500'
    },
    txtLable_2: {
        fontSize: Size.text,
        fontWeight: '400',
        marginLeft: 3
    },
    styViewStatusColor: (bgColor) => {
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
        marginBottom: 5
    },
    styLineValue: {
        marginLeft: 10
    },
    styLineLeft: {
        flex: 1
    },
    styLineRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }
});
