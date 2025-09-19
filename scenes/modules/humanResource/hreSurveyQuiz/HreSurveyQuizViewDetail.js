import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSafeAreaView, Size } from '../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import { WebView } from 'react-native-webview';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import DrawerServices from '../../../../utils/DrawerServices';
export default class HreSurveyQuizViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        props.navigation.setParams({
            goback: this.goBack.bind(this)
        });
        // biến để nhận biết có được goback nữa hay không
        this.canGoback = null;
    }

    goBack = () => {
        DrawerServices.goBack();
    };

    componentDidMount() {}

    render() {
        const _params = this.props.navigation.state.params,
            { dataItem } = _params,
            uriSurvey = `${dataVnrStorage.apiConfig.uriPor}/my-app/#/public/survey-run-mobile/${
                dataItem.id
            }/90118e17fc23e5b892c0f96e133a169f`,
            profileInfo = dataVnrStorage && dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info : null,
            script_Inject = `
            const meta = document.createElement('meta');
                    meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                    meta.setAttribute('name', 'viewport');
                    document.head.appendChild(meta);
                setTimeout(function () {
                    localStorage.setItem('AppMobileProfileID' , '${profileInfo.ProfileID}')
                },2000);
                true;
            `;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {uriSurvey != null ? (
                    <WebView
                        style={styles.styWebView}
                        javaScriptEnabled={true}
                        injectedJavaScript={script_Inject}
                        ref={refWebView => (this.refWebView = refWebView)}
                        source={{ uri: uriSurvey ? uriSurvey : null }}
                        startInLoadingState={true}
                        renderLoading={() => (
                            <View
                                style={styles.styLoadingWeb}
                            >
                                <VnrLoading size={'large'} />
                            </View>
                        )}
                    />
                ) : (
                    <VnrLoading size={'large'} />
                )}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styLoadingWeb: { position: 'absolute',
        width: Size.deviceWidth,
        height: Size.deviceheight - Size.headerHeight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styWebView: { flex: 1,
        width: Size.deviceWidth,
        height: Size.deviceheight - Size.headerHeight
    }
})