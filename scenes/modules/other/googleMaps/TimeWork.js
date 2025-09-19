import React, { Component } from 'react';
import { Text } from 'react-native';
import moment from 'moment';
import format from 'number-format.js';
import { styleSheets } from '../../../../constants/styleConfig';
export default class TimeWork extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: '00:00:00'
        };
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            const { TimeCheckIn } = this.props,
                now = moment(new Date()), //todays date
                end = moment(TimeCheckIn), // time check in
                duration = moment.duration(now.diff(end)),
                { hours, minutes, seconds } = duration._data;

            this.setState({
                time:
                    hours > -1 && minutes > -1
                        ? `${format('00', hours)}:${format('00', minutes)}:${format('00', seconds)}`
                        : '00:00:00'
            });
        }, 1000);
    }

    render() {
        const { style } = this.props;
        return (
            <Text style={[styleSheets.lable, style]} key={this.state.time}>
                {this.state.time}
            </Text>
        );
    }
}
