import React from 'react';
import { Text, StyleSheet } from 'react-native';
import moment from 'moment';
import { styleSheets, Size, Colors } from '../../../../constants/styleConfig';
export default class Time extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: null
        };
        this.timer = null;
        this.StartTime = null;
    }

    componentWillUnmount() {
        this.clearStartTime();
        this.clearSetTime();
    }

    componentDidMount() {
        this.getTime();
    }

    getTime() {
        const geTime = new Date();
        const timeOutfromTime = moment(geTime).get('second');
        this.StartTime = setTimeout(
            () => {
                this.setTime();
                this.clearStartTime();
            },
            60000 - timeOutfromTime * 1000
        );
        this.setState({ time: geTime });
    }

    clearStartTime = () => {
        this.StartTime && clearTimeout(this.StartTime);
    };

    clearSetTime = () => {
        this.timer && clearInterval(this.timer);
    };

    setTime = () => {
        this.timer = setInterval(() => {
            this.setState({ time: new Date() });
        }, 1000);
    };

    render() {
        const { format, style } = this.props;
        return (
            <Text style={[styleSheets.text, styles.textTime, style]}>
                {moment(this.state.time).format(format)}
            </Text>
        );
    }
}

const styles = StyleSheet.create({
    textTime: {
        fontSize: Size.text + 10,
        fontWeight: '500',
        color: Colors.black
    }
});
