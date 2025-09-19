import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Size, styleSheets } from '../../constants/styleConfig';
import DrawerServices from '../../utils/DrawerServices';
import { IconBack, IconHome } from '../../constants/Icons';

export default class ButtonGoBackHome extends Component {
    constructor(props) {
        super(props);
    }

    GoBack = () => {
        if (DrawerServices.getNavigateFromNotify()) {
            DrawerServices.setNavigateFromNotify(false);
            // mục đích gọi goback để unmount component , và cho lần kế tiếp component đó sẽ chạy lại didmount
            DrawerServices.navigate('Home');
            // sau khi goback thì về lại DS thông báo , đây là cách củ chuối.
            DrawerServices.navigate('Notification');
        } else {
            DrawerServices.navigate('Home');
        }
    };

    render() {
        return (
            <View style={styles.ContentCenter}>
                <TouchableOpacity accessibilityLabel={'ButtonGoBackHome'} onPress={this.GoBack} style={styles.bnt_right}>
                    {DrawerServices.getNavigateFromNotify() ? (
                        <IconBack size={Size.iconSizeHeader} color={Colors.gray_10} />
                    ) : (
                        <IconHome size={Size.iconSizeHeader} color={Colors.gray_10} />
                    )}
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ContentCenter: {
        flex: 1
    },
    bnt_right: {
        height: '100%',
        width: '100%',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: styleSheets.p_10,
        paddingLeft: Size.defineSpace //
    }
});
