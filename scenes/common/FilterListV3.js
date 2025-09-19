/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Colors, styleSafeAreaView } from '../../constants/styleConfig';
import VnrFilter from '../../componentsV3/VnrFilter/VnrFilter';
import Icon from 'react-native-vector-icons/Ionicons';

export default class FilterListV3 extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            filterAdvance: null,
            onFinish: null,
            isShowModalFilter: null
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
        let { filterAdvance, onFinish, isShowModalFilter } = this.props.navigation.state.params;
        this.setState({ filterAdvance, onFinish, isShowModalFilter });
    }

    render() {
        const { filterAdvance, onFinish, isShowModalFilter } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {filterAdvance && (
                    <VnrFilter onFinish={onFinish} filterConfig={filterAdvance} isShowModalFilter={isShowModalFilter} />
                )}
            </SafeAreaView>
        );
    }
}
