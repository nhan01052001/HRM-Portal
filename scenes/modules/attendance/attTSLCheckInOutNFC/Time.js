import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import moment from 'moment';
import { styleSheets, Size, Colors } from '../../../../constants/styleConfig';
export default class Time extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: new Date()
        };
    }
    getTime = () => {
        return new Date();
    };

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({ time: new Date() });
        }, 1000);
    }

    render() {
        const { format, style } = this.props;
        return <Text style={[styleSheets.text, styles.textTime, style]}>{moment(this.state.time).format(format)}</Text>;
    }
}

const styles = StyleSheet.create({
    textTime: {
        fontSize: Size.text + 10,
        fontWeight: '500',
        color: Colors.black
    }
});
