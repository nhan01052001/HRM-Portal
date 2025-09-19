/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../constants/styleConfig';
export default class UserInfoScene extends Component {
    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: Colors.blue,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Text style={{ fontWeight: 'bold', fontSize: 22, color: Colors.white }}>User Info</Text>
                </View>
            </View>
        );
    }
}
