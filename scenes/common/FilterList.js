/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Colors, styleSafeAreaView } from '../../constants/styleConfig';
import VnrFilter from '../../components/VnrFilter/VnrFilter';
import Icon from 'react-native-vector-icons/Ionicons';

export default class FilterList extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            filterAdvance: null,
            onFinish: null
        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5, paddingLeft: 10 }}>
                    <Icon name={'md-close'} size={28} color={Colors.white} />
                </TouchableOpacity>
            )
        };
    };

    // componentWillReceiveProps(a, b) {
    // }

    componentDidMount() {
        let { filterAdvance, onFinish } = this.props.navigation.state.params;
        this.setState({ filterAdvance, onFinish });
    }

    render() {
        const { filterAdvance, onFinish } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {filterAdvance && <VnrFilter onFinish={onFinish} filterConfig={filterAdvance} />}
            </SafeAreaView>
        );
    }
}
