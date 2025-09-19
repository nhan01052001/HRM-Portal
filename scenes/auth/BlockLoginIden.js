import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, CustomStyleSheet, styleSheets } from '../../constants/styleConfig';
import { logout } from '../../assets/auth/authentication';
import { translate } from '../../i18n/translate';

class BlockLoginIden extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <SafeAreaView
                style={CustomStyleSheet.flex(1)}
            >
                <View
                    style={[styleSheets.flex1Center, CustomStyleSheet.padding(12)]}
                >
                    <Text
                        style={[styleSheets.lable, styles.text, { color: Colors.primary }]}
                    >{translate('HRM_PortalApp_BlockLoginIden')}</Text>
                    <TouchableOpacity
                        onPress={() => logout()}
                        style={styles.buttonLogout}
                    >
                        <Text
                            style={[styleSheets.lable, styles.text]}
                        >{translate('HRM_PortalApp_Logout')}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView >
        );
    }
}

const styles = StyleSheet.create({
    buttonLogout: {
        marginTop: 22,
        borderColor: Colors.primary,
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: Colors.white
    },
    text: {
        textAlign: 'center', fontSize: 20
    }
});

export default BlockLoginIden;