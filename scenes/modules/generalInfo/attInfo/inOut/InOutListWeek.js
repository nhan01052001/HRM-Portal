import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconPlus, IconMinus } from '../../../../../constants/Icons';
import InOutItem from './InOutItem';
import { Colors, Size, styleSheets } from '../../../../../constants/styleConfig';
import moment from 'moment';

class InOutListWeek extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsedWeeks: {} // Lưu trạng thái collapse của từng tuần
        };

        this.dayRefs = {}; // Lưu vị trí của từng ngày
    }

    toggleCollapse = (weekItem) => {
        this.setState((prevState) => ({
            collapsedWeeks: {
                ...prevState.collapsedWeeks,
                [weekItem]: !prevState.collapsedWeeks[weekItem]
            }
        }));
    };

    scrollToCurrentDay = () => {
        const { weeklyData, scrollToSpecificDay } = this.props;
        const today = moment().format('YYYY-MM-DD'); // Lấy ngày hiện tại

        let foundDay = null;
        Object.keys(weeklyData).forEach((weekItem) => {
            weeklyData[weekItem].days.forEach((day) => {
                if (day.date === today) {
                    foundDay = this.dayRefs[day.date]?.yOffset;
                }
            });
        });

        if (foundDay !== null) {
            setTimeout(() => {
                scrollToSpecificDay(foundDay);
            }, 500);
        }
    };

    onDayLayout = (date, yOffset) => {
        this.dayRefs[date] = { yOffset };

        // Kiểm tra nếu tất cả các ngày đã có dữ liệu thì cuộn
        if (!this.state.hasLayoutCompleted) {
            const totalDays = Object.keys(this.dayRefs).length;
            const expectedDays = Object.values(this.props.weeklyData).reduce((sum, week) => sum + week.days.length, 0);

            if (totalDays >= expectedDays) {
                this.setState({ hasLayoutCompleted: true }, () => {
                    this.scrollToCurrentDay();
                });
            }
        }
    };

    render() {
        const { weeklyData } = this.props;
        const { collapsedWeeks } = this.state;

        return (
            <View>
                {Object.keys(weeklyData).map((weekItem, index) => {
                    const isCollapsed = collapsedWeeks[weekItem];

                    return (
                        <View style={styles.containerWeek} key={index}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={styles.styHeaderWeekWrap}
                                onPress={() => this.toggleCollapse(weekItem)}
                            >
                                <View style={styles.styViewWeekName}>
                                    <Text style={[styleSheets.text, { fontSize: Size.text - 1 }]}>{weekItem}</Text>
                                </View>
                                <View style={styles.styViewRangeWeek}>
                                    <Text style={[styleSheets.lable]}>{weeklyData[weekItem].range}</Text>
                                </View>
                                {isCollapsed ? (
                                    <IconPlus size={Size.iconSize} color={Colors.primary} />
                                ) : (
                                    <IconMinus size={Size.iconSize} color={Colors.primary} />
                                )}
                            </TouchableOpacity>

                            {!isCollapsed && (
                                <View style={styles.styViewWrapContent}>
                                    {weeklyData[weekItem].days.map((dateItem, indexDate) => (
                                        <InOutItem
                                            dataItem={dateItem}
                                            index={indexDate}
                                            key={indexDate}
                                            onLayout={(yOffset) => this.onDayLayout(dateItem.date, yOffset)}
                                        />
                                    ))}
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
        );
    }
}

export default InOutListWeek;

const styles = StyleSheet.create({
    styViewRangeWeek: {
        flex: 1,
        marginLeft: Size.defineSpace
    },
    containerWeek: {
        backgroundColor: Colors.white,
        marginBottom: Size.defineSpace,
        borderRadius: 6
    },
    styHeaderWeekWrap: {
        padding: Size.defineSpace,
        flexDirection: 'row',
        alignItems: 'center'
    },
    styViewWeekName: {
        backgroundColor: Colors.gray_3,
        alignSelf: 'flex-start',
        padding: Size.borderPicker,
        borderRadius: Size.borderRadiusPrimary
    },
    styViewWrapContent: {
        borderTopWidth: 0.5,
        borderTopColor: Colors.gray_3
    }
});
