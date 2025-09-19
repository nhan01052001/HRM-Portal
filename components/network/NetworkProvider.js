import React from 'react';
import { View, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { connect } from 'react-redux';
import networkReducer from '../../redux/network';
import { Colors, styleSheets } from '../../constants/styleConfig';
import VnrText from '../VnrText/VnrText';
import { SafeAreaView } from 'react-navigation';
import HttpService from '../../utils/HttpService';

const TYPE = {
    NONE: 'none',
    UNKNOWN: 'unknown',
    wifi: 'wifi'
};

class NetworkProvider extends React.Component {
    unsubscribe = null;
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        const { type } = await NetInfo.fetch();

        if (type === TYPE.NONE || type === TYPE.UNKNOWN) {
            this.props.setIsConnected(false);
        }

        this.unsubscribe = NetInfo.addEventListener(({ isConnected }) => {
            if (isConnected == true) {
                HttpService.checkSubscribersConect();
            }

            NetInfo.fetch().then((res) => {
                this.props.setInfoNetwork({ isConnected: isConnected, detailsNetwork: res.details });
                if (this.props.listenerNetWork) this.props.listenerNetWork(isConnected);
            });
        });
    }

    UNSAFE_componentWillMount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    render() {
        if (this.props.isConnected) {
            return null;
        }
        return (
            <SafeAreaView forceInset={{ top: 'never', bottom: 'always' }}>
                <View style={styles.container}>
                    <VnrText i18nKey={'no-connect-internet'} style={[styleSheets.textFontMedium, styles.textStyle]} />
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.danger,
        paddingVertical: 5
    },
    textStyle: {
        color: Colors.white,
        textAlign: 'center',
        fontWeight: '500'
    }
});

const mapStateToProps = (state) => {
    return {
        isConnected: state.network.isConnected
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setIsConnected: (isConnected) => {
            dispatch(networkReducer.actions.setIsConnected(isConnected));
        },
        setInfoNetwork: (data) => {
            dispatch(networkReducer.actions.setInfoNetwork(data));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NetworkProvider);
