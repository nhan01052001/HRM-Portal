/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
export default class Skeleton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            translateX: new Animated.Value(-props.width)
        };
        this.anim = null;
    }

    componentDidMount() {
        const { width } = this.props;
        this.anim = Animated.loop(
            Animated.timing(this.state.translateX, {
                toValue: width,
                useNativeDriver: true,
                duration: 1500
            })
        ).start();
    }

    componentWillUnmount() {}

    render() {
        const { width, height, style } = this.props;
        return (
            <View
                style={StyleSheet.flatten([
                    {
                        width: width,
                        height: height,
                        backgroundColor: 'rgba(0,0,0,0.12)',
                        overflow: 'hidden'
                    },
                    style
                ])}
            >
                <Animated.View
                    style={{
                        width: '100%',
                        height: '100%',
                        transform: [{ translateX: this.state.translateX }]
                    }}
                >
                    <LinearGradient
                        style={{ width: '100%', height: '100%' }}
                        colors={['transparent', 'rgba(0,0,0,0.05)', 'transparent']}
                        start={{ x: 1, y: 1 }}
                    />
                </Animated.View>
            </View>
        );
    }
}
