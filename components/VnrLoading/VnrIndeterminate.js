import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Colors, Size } from '../../constants/styleConfig';
import * as Progress from 'react-native-progress';

const withIndeter = Size.deviceWidth * 0.4;
export default class VnrIndeterminate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            xview: new Animated.Value(-withIndeter),
            isLoading: true
        };
    }

    // moveAnimated = () => {
    //     Animated.sequence([
    //         Animated.timing(this.state.xview, {
    //             toValue: Size.deviceWidth,
    //             duration: 5000,
    //             // asing: Easing.linear
    //         }),
    //         Animated.timing(this.state.xview, {
    //             toValue: -withIndeter,
    //             duration: 0,
    //             // asing: Easing.linear
    //         })
    //     ]).start(() => {
    //         this.state.isLoading !== false && this.moveAnimated()
    //     });
    // }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.isVisible === false) {
    //         this.setState({ isLoading: false })
    //     };
    // }

    // componentDidMount() {
    //     this.props.isVisible === true &&
    //         this.moveAnimated()
    // }

    render() {
        if (this.props.isVisible == false) {
            return null;
        }
        return (
            <View accessibilityLabel='VnrLoading-VnrIndeterminate' style={[styles.containerProgress, this.props.style]}>
                <Progress.Bar
                    progress={0}
                    width={Size.deviceWidth - Size.defineSpace * 2}
                    indeterminate={true}
                    borderWidth={0}
                    height={2}
                    borderRadius={5}
                    animationType={'decay'}
                    color={Colors.primary_7}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerProgress: {
        height: 1.5,
        width: Size.deviceWidth - Size.defineSpace * 2,
        marginHorizontal: Size.defineSpace,
        borderRadius: 5
    }
});
