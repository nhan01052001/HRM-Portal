import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Size, styleSheets } from '../../constants/styleConfig';
import DrawerServices from '../../utils/DrawerServices';
import { IconBack } from '../../constants/Icons';

export default class ButtonGoBack extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            disable: false
        };
        this.disable = false;
    }

    GoBack = () => {
        const { navigation, gobackFunction } = this.props;
        let beforeScreen = DrawerServices.getBeforeScreen();
        // tuỳ biến goback đi đâu
        if (gobackFunction && typeof gobackFunction == 'function') {
            gobackFunction();
        } else if (beforeScreen != null && beforeScreen != '' && ['Notification'].includes(beforeScreen)) {
            // mục đích gọi goback để unmount component , và cho lần kế tiếp component đó sẽ chạy lại didmount
            DrawerServices.goBack();
            navigation.setParams({ isGoBack: true });
            // sau khi goback thì về lại DS thông báo , đây là cách củ chuối.
            DrawerServices.navigate('Notification');
        }
        else if (
          beforeScreen != null
          && beforeScreen != ''
          && (['ProfileInfo'].includes(beforeScreen) || beforeScreen.includes('TopTabProfile'))
        ) {
        // Khi từ màn hình thông tin cá nhân, liên hệ thì về thẳng màn hình Hồ sơ cá nhân
        DrawerServices.navigate('ProfileInfo');
        }
        else {
            DrawerServices.goBack();
        }
    };

    render() {
        return (
            <View style={styles.ContentCenter}>
                <TouchableOpacity accessibilityLabel={'ButtonGoBack'} onPress={this.GoBack} style={styles.bnt_right} >
                    <IconBack size={Size.iconSizeHeader} color={Colors.gray_10} />
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
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingRight: styleSheets.p_10,
        paddingLeft: Size.defineSpace - 6 //
    }
});
