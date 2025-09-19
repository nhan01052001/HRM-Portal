import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { styleSheets } from '../../constants/styleConfig';

const VnrProgressBar = ({ progress, width = 300, height = 20, hidePercent }) => {
    const progressWidth = (progress / 100) * width; // Calculate the progress width

    return (
        <View style={styles.container}>
            {
                !hidePercent && (
                    <Text style={[styleSheets.text, styles.percent]}>{progress}%</Text>
                )
            }
            <Svg width={width} height={height}>
                {/* Declare fill color of the indicator. */}
                <Defs>
                    <LinearGradient id="fadingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#0971DC" stopOpacity="1" />
                        <Stop offset="20%" stopColor="#3B98F7" stopOpacity="1" />
                        <Stop offset="40%" stopColor="#54A5F8" stopOpacity="1" />
                        <Stop offset="60%" stopColor="#6CB1F9" stopOpacity="1" />
                        <Stop offset="80%" stopColor="#9DCBFB" stopOpacity="1" />
                        <Stop offset="100%" stopColor="#CEE5FD" stopOpacity="1" />
                    </LinearGradient>
                </Defs>

                {/* Color of the remaining progress. */}
                <Rect x="0" y="0" width={width} height={height} fill="#eee" rx={height / 2} // Rounded corners
                    ry={height / 2} />

                {/* Fill color of the indicator. */}
                <Rect
                    x="0"
                    y="0"
                    width={progressWidth}
                    height={height}
                    fill="url(#fadingGradient)"
                    rx={height / 2} // Rounded corners
                    ry={height / 2}
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    percent: {
        fontSize: 20,
        marginBottom: 6
    }
});

export default VnrProgressBar;
