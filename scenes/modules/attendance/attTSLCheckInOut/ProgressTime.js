import React, { Component } from 'react';
import { Colors } from '../../../../constants/styleConfig';
import * as Progress from 'react-native-progress';
export default class ProgressTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: 0,
            indeterminate: false
        };
    }
    getTime = () => {
        return new Date();
    };
    componentDidMount() {
        //this.animate();
    }

    animate() {
        let progress = 0;
        this.setState({ progress });
        setTimeout(() => {
            this.setState({ indeterminate: false });
            setInterval(() => {
                progress += Math.random() / 5;
                if (progress > 1) {
                    progress = 1;
                }
                this.setState({ progress });
            }, 500);
        }, 1500);
    }
    render() {
        return (
            <Progress.Circle
                size={175}
                //style={styles.progress}
                progress={0.0}
                indeterminate={this.state.indeterminate}
                color={Colors.primary}
                strokeCap="round"
                //unfilledColor={Colors.grey}
                borderColor={Colors.grey}
                borderWidth={2}
                endAngle={0.9}
                thickness={8}
            />
        );
    }
}
