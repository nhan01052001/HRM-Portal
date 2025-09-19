import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors } from '../../constants/styleConfig';

const AnimationDot = () => {
    const [dot1] = useState(new Animated.Value(0));
    const [dot2] = useState(new Animated.Value(0));
    const [dot3] = useState(new Animated.Value(0));

    useEffect(() => {
        // Sequential animation for the dots
        const animateDots = () => {
            Animated.sequence([
                Animated.timing(dot1, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: false
                }),
                Animated.timing(dot2, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: false
                }),
                Animated.timing(dot3, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: false
                }),
                Animated.timing(dot1, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: false
                }),
                Animated.timing(dot2, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: false
                }),
                Animated.timing(dot3, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: false
                })
            ]).start(() => animateDots()); // Loop the animation
        };

        animateDots();
    }, [dot1, dot2, dot3]);

    return (
        <View style={styles.container}>
            <Animated.Text style={[styles.dot, { opacity: dot1 }]}>.</Animated.Text>
            <Animated.Text style={[styles.dot, { opacity: dot2 }]}>.</Animated.Text>
            <Animated.Text style={[styles.dot, { opacity: dot3 }]}>.</Animated.Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
        paddingLeft: 3
    },
    dot: {
        fontSize: 30,
        color: Colors.black,
        paddingVertical: 0,
        margin: 0,
        includeFontPadding: false
    }
});

export default AnimationDot;
