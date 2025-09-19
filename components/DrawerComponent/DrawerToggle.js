import React, { Component } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Colors, Size, styleSheets } from '../../constants/styleConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import DrawerServices from '../../utils/DrawerServices';

export default class DrawerToggle extends Component {
    constructor(porps) {
        super(porps);
    }

    opentDrawer = () => {
        DrawerServices.openDrawer();
    };

    render() {
        let { Key } = this.props;
        const { ContentCenter, bnt_right } = styles;
        let iconName = `${Platform.OS === 'ios' ? 'ios-' : 'md-'}menu`;

        return (
            Key == 'home' && (
                <View style={ContentCenter}>
                    <TouchableOpacity onPress={() => this.opentDrawer()} style={bnt_right}>
                        <Icon name={iconName} size={Size.iconSizeHeader} color={Colors.white} />
                    </TouchableOpacity>
                </View>
            )
        );
    }
}

const styles = {
    ContentCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bnt_right: {
        paddingHorizontal: styleSheets.p_10
    }
};
