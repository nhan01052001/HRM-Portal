import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, Colors, Size, CustomStyleSheet } from '../../constants/styleConfig';
import { connect } from 'react-redux';
import DrawerServices from '../../utils/DrawerServices';
import { ConfigDashboard } from '../../assets/configProject/ConfigDashboard';
import { translate } from '../../i18n/translate';

class NoInternet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: false
        };
    }

    tryAgain = () => {
        const { isConnected } = this.state;
        if (isConnected === true) {
            if (ConfigDashboard.value && ConfigDashboard.value.length > 0) {
                let getBeforeScreen = DrawerServices.getBeforeScreen();
                DrawerServices.navigate(getBeforeScreen ? getBeforeScreen : 'Home');
            } else {
                DrawerServices.navigate('Permission');
            }
        }
    };

    // eslint-disable-next-line react/no-deprecated
    componentWillReceiveProps(nextProps) {
        if (nextProps.isConnected !== this.props.isConnected) {
            this.setState({ isConnected: nextProps.isConnected });
        }
    }

    componentDidMount() {
        this.setState({ isConnected: this.props.isConnected });
    }

    render() {
        const Img = require('../../assets/images/NO_INTERNET.png');
        return (
            <SafeAreaView style={CustomStyleSheet.flex(1)}>
                <View style={[styleSheets.container, styles.styContent]}>
                    <Image source={Img} style={styles.styImg} />
                    <Text style={[styleSheets.lable, { color: Colors.greySecondary }]}>
                        {translate('no-connect-internet') == 'no-connect-internet'
                            ? 'Không có kết nối internet'
                            : translate('no-connect-internet')}
                    </Text>
                    <TouchableOpacity style={styles.styBtn} onPress={this.tryAgain}>
                        <Text style={[styleSheets.lable, { color: Colors.white }]}>
                            {translate('HRM_Common_TryAgain') == 'HRM_Common_TryAgain'
                                ? 'Thử lại'
                                : translate('HRM_Common_TryAgain')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styContent: { justifyContent: 'center', alignItems: 'center' },
    styImg: {
        width: Size.deviceWidth - 160,
        height: Size.deviceWidth - 120,
        maxWidth: 254,
        maxHeight: 294,
        marginBottom: 30
    },
    styBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 15
    }
});

const mapStateToProps = state => {
    return {
        isConnected: state.network.isConnected
    };
};

export default connect(
    mapStateToProps,
    null
)(NoInternet);
