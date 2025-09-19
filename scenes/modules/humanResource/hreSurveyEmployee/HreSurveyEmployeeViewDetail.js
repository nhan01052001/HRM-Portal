import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSafeAreaView, Size } from '../../../../constants/styleConfig';
import { WebView } from 'react-native-webview';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import { getDataVnrStorage } from '../../../../assets/auth/authentication';
export default class HreSurveyEmployeeViewDetail extends Component {
    constructor(props) {
        super(props);
        const _params = props.navigation.state.params,
            { isSurveyTraining, isSurveyTermination } = typeof _params == 'object' ? _params : JSON.parse(_params);

        this.state = {
            params: null
        };

        if (isSurveyTraining) {
            props?.navigation?.setParams({ title: 'CategoryType__E_TRAINING' });
        } else if (isSurveyTermination) {
            props?.navigation?.setParams({ title: 'HRM_HR_StopWorking_Survey' });
        }
        // biến để nhận biết có được goback nữa hay không
        this.canGoback = null;
    }

    componentDidMount() {
        const _params = this.props.navigation.state.params;
        this.setState({
            params: _params
        });
    }

    render() {
        const { params } = this.state;
        let uriSurvey = '',
            script_Inject = '';
        if (params != null) {
            const { dataId, dataItem, payloadTermination, ApproveQuitjobData } =
                    typeof params == 'object' ? params : JSON.parse(params),
                idSurvey = dataId ? dataId : dataItem.id,
                dataVnrStorage = getDataVnrStorage(),
                profileInfo = dataVnrStorage && dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info : null,
                { currentUser } = dataVnrStorage;

            script_Inject = `
            const meta = document.createElement('meta');
                    meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                    meta.setAttribute('name', 'viewport');
                    document.head.appendChild(meta);
                setTimeout(function () {
                    localStorage.setItem('AppMobileProfileID' , '${profileInfo.ProfileID}')
                    localStorage.setItem('RegisterQuitjobData' , '${
    payloadTermination ? JSON.stringify(payloadTermination) : null
}')
                    localStorage.setItem('ApproveQuitjobData' , '${
    ApproveQuitjobData ? JSON.stringify(ApproveQuitjobData) : null
}')
                    localStorage.setItem('accessTokenMobile' , '${currentUser?.headers?.tokenportalapp}')
                },2000);
                true;
            `;

            if (dataItem?.ClassID) {
                uriSurvey = `${dataVnrStorage.apiConfig.uriPor}/my-app/#/public/run-public/${idSurvey}/${
                    profileInfo.ProfileID
                }/${dataItem?.ClassID}`;
            } else if (dataItem?.SurveyPortalID) {
                uriSurvey = `${dataVnrStorage.apiConfig.uriPor}/my-app/#/public/run-public/${idSurvey}/${
                    profileInfo.ProfileID
                }?hrmSurveyId=${dataItem?.SurveyPortalID}`;
            } else {
                uriSurvey = `${dataVnrStorage.apiConfig.uriPor}/my-app/#/public/run-public/${idSurvey}`;
            }
        }
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
                                style={styles.styLoadingView}
                            >
                                {/* <VnrLoading size={"large"} /> */}
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
    styLoadingView: {
        position: 'absolute',
        width: Size.deviceWidth,
        height: Size.deviceheight - Size.headerHeight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styWebView: {
        flex: 1,
        width: Size.deviceWidth,
        height: Size.deviceheight - Size.headerHeight
    }
})