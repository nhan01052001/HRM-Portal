import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Size } from '../../../../../constants/styleConfig';

// eslint-disable-next-line react/display-name, no-undef
export default (Indicator = ({
    itemCount,
    currentIndex,
    indicatorStyle,
    indicatorContainerStyle,
    indicatorActiveColor,
    indicatorInActiveColor,
    indicatorActiveWidth = 6
}) => {
    return (
        <View
            style={[
                styles.container,
                indicatorContainerStyle,
                {
                    left: Size.deviceWidth / 2 - (itemCount * 6) / 2
                }
            ]}
        >
            {renderIndicator(
                itemCount,
                currentIndex,
                indicatorStyle,
                indicatorActiveColor,
                indicatorInActiveColor,
                indicatorActiveWidth
            )}
        </View>
    );
});

export const renderIndicator = (
    count,
    currentIndex,
    indicatorStyle,
    indicatorActiveColor,
    indicatorInActiveColor,
    indicatorActiveWidth
) => {
    let indicators = [];
    for (let i = 0; i < count; i++) {
        indicators.push(
            <View
                style={[
                    styles.indicator,
                    indicatorStyle,
                    i === currentIndex
                        ? indicatorActiveColor
                            ? {
                                ...styles.active,
                                ...{
                                    backgroundColor: indicatorActiveColor,
                                    width: indicatorActiveWidth
                                }
                            }
                            : styles.active
                        : {
                            ...styles.inactive,
                            ...{ backgroundColor: indicatorInActiveColor }
                        }
                ]}
            />
        );
    }
    return indicators;
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 18,
        left: 100
    },
    indicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 5
    },
    active: {},
    inactive: {}
});
